import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/app-error.ts";
import { JwtServive } from "../application/auth/jwt.service.ts";
import type { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const checkAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      throw new UnauthorizedError("Token not found");
    }

    const jwt = new JwtServive();
    const payload = jwt.validateAccessToken(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    req.user = payload;

    return next();
  } catch (error) {
    return next(error);
  }
};
