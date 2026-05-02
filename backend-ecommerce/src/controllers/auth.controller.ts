import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import type { UserRole } from "../models/User";

function isValidRole(role: unknown): role is UserRole {
  return role === "admin" || role === "seller";
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "name, email and password are required" });
      return;
    }

    const result = await registerUser({
      name,
      email,
      password,
      role: isValidRole(role) ? role : "seller",
    });

    res.status(201).json(result);
  } catch (error) {
    if ((error as Error).message === "EMAIL_ALREADY_REGISTERED") {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }

    const result = await loginUser({ email, password });
    res.status(200).json(result);
  } catch {
    res.status(401).json({ message: "Invalid credentials" });
  }
}
