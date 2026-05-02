import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { User, type UserRole } from "../models/User";

export type AuthUserDTO = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

type LoginInput = {
  email: string;
  password: string;
};

export function toAuthUserDTO(user: User): AuthUserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function signToken(user: User): string {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    options,
  );
}

export async function registerUser(input: RegisterInput): Promise<{ user: AuthUserDTO; token: string }> {
  const existing = await User.findOne({ where: { email: input.email } });

  if (existing) {
    throw new Error("EMAIL_ALREADY_REGISTERED");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    name: input.name.trim(),
    email: input.email,
    password: passwordHash,
    role: input.role || "seller",
  });

  return {
    user: toAuthUserDTO(user),
    token: signToken(user),
  };
}

export async function ensureAdminUser(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL || "admin@ecommerce.local").toLowerCase().trim();
  const existing = await User.findOne({ where: { email } });
  if (existing) return;

  const password = process.env.ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    name: "Admin",
    email,
    password: passwordHash,
    role: "admin",
  });

  console.log(`Admin user created: ${email}`);
}

export async function loginUser(input: LoginInput): Promise<{ user: AuthUserDTO; token: string }> {
  const user = await User.findOne({ where: { email: input.email } });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    user: toAuthUserDTO(user),
    token: signToken(user),
  };
}
