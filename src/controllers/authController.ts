// Dependencies
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../prisma.js";
import type { Role } from "../generated/prisma/enums.js";

// Typescript: Udvid Express Request med brugerens id
declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

// Typescript: AuthController.ts - JWT payload
interface JwtPayload {
  exp: number;
  data: {
    id: number;
  };
}

class AuthController {
  // authController.ts - generateToken
  generateToken = (user: { id: number }, type: "access" | "refresh") => {
    // Vælg den rigtige hemmelige nøgle
    const secret =
      type === "access"
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error("JWT secret is missing");
    }

    // Bestem hvor længe tokenen er gyldig
    const expiresIn = type === "access" ? 900 : 604800;

    // Generer en signeret JWT
    return jwt.sign({ data: { id: user.id } }, secret, {
      expiresIn,
      algorithm: "HS256",
    });
  };

  // authController.ts - authenticate
  authenticate = async (req: Request, res: Response) => {
    try {
      // Hent email og password fra request
      const { email, password } = req.body ?? {};

      if (typeof email !== "string" || typeof password !== "string") {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Find brugeren ud fra email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Returnér fejl hvis brugeren ikke findes
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Kontrollér password med bcrypt
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Kontrollér om brugeren er aktiv
      if (!user.isActive) {
        return res.status(403).json({ message: "User is not active" });
      }

      // Generer access og refresh tokens
      const accessToken = this.generateToken(user, "access");
      const refreshToken = this.generateToken(user, "refresh");

      // Gem en hash af refresh tokenen i databasen
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      });

      // Returnér tokens til klienten
      return res.json({ accessToken, refreshToken });
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // authController.ts - authorize
  authorize = (req: Request, res: Response, next: NextFunction) => {
    // Hent Authorization-headeren
    const authorization = req.headers.authorization;

    // Kontrollér Bearer-formatet
    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token required" });
    }

    // Fjern Bearer fra headeren
    const token = authorization.slice(7);

    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      return res.status(500).json({ message: "JWT secret is missing" });
    }

    try {
      // Kontrollér tokenens signatur og udløbstid
      const decoded = jwt.verify(token, secret, {
        algorithms: ["HS256"],
      });

      // Kontrollér at payload indeholder et bruger-id
      if (
        typeof decoded === "string" ||
        typeof decoded.data !== "object" ||
        decoded.data === null ||
        !Number.isInteger(decoded.data.id)
      ) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Gem brugerens id på requestet
      req.user = { id: decoded.data.id };

      // Send requestet videre
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

  // authController.ts - requireRole
  requireRole = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Hent brugerens id fra authorize middleware
        const id = req.user?.id;

        if (!id) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        // Hent brugerens rolle fra databasen
        const user = await prisma.user.findUnique({
          where: { id },
          select: { role: true, isActive: true },
        });

        if (!user || !user.isActive) {
          return res.status(403).json({ message: "Access denied" });
        }

        // Kontrollér om brugerens rolle er tilladt
        if (!roles.includes(user.role)) {
          return res.status(403).json({ message: "Insufficient permissions" });
        }

        // Brugeren har adgang
        next();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    };
  };

  // authController.ts - refreshAccessToken
  refreshAccessToken = async (req: Request, res: Response) => {
    try {
      // Hent refresh token fra request body
      const { refreshToken } = req.body ?? {};

      if (typeof refreshToken !== "string" || !refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
      }

      const secret = process.env.JWT_REFRESH_SECRET;

      if (!secret) {
        return res.status(500).json({ message: "JWT secret is missing" });
      }

      // Kontrollér refresh tokenens signatur og udløbstid
      const decoded = jwt.verify(refreshToken, secret, {
        algorithms: ["HS256"],
      });

      if (
        typeof decoded === "string" ||
        typeof decoded.data !== "object" ||
        decoded.data === null ||
        !Number.isInteger(decoded.data.id)
      ) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      // Find brugeren i databasen
      const user = await prisma.user.findUnique({
        where: { id: decoded.data.id },
      });

      if (!user || !user.isActive || !user.refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      // Sammenlign token med hashen i databasen
      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isValid) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      // Generer en ny access token
      const accessToken = this.generateToken(user, "access");

      return res.json({ accessToken });
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }
  };
}

export const authController = new AuthController();
