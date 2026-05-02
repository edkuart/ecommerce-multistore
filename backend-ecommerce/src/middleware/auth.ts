import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { User, type UserRole } from "../models/User";

type DecodedToken = {
  sub: string;
  email: string;
  role: UserRole;
};

function getBearerToken(req: Request): string | null {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : null;
}

export function requireAuth(roles: UserRole[] = []): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = getBearerToken(req);

      if (!token) {
        res.status(401).json({ message: "Token required" });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      const user = await User.findByPk(decoded.sub, {
        attributes: ["id", "email", "role"],
      });

      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
}

export function optionalAuth(): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = getBearerToken(req);

      if (!token) {
        next();
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      const user = await User.findByPk(decoded.sub, {
        attributes: ["id", "email", "role"],
      });

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    } catch {
      // Public reads should stay public; invalid tokens simply behave as anonymous.
    }

    next();
  };
}
