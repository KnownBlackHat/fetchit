import type { Request, Response } from "express";
import {
  CustomError,
  DuplicateResourceError,
  ParseError,
  UnauthorizedError,
} from "@/utils/errorClasses";
import { Prisma } from "@/generated/prisma/client";

type AsyncController = (req: Request, res: Response) => Promise<any>;

export function errorHandler(fn: AsyncController) {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof ParseError) {
        res.status(400).json({
          success: false,
          error: "Invalid request",
        });
      } else if (err instanceof CustomError) {
        res.status(err.stausCode).json({
          success: false,
          error: err.message,
        });
      } else if (err instanceof UnauthorizedError) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      } else if (err instanceof DuplicateResourceError) {
        res.status(409).json({
          success: false,
          error: "Duplicate Resource",
        });
      } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          res.status(409).json({
            success: false,
            error: "Duplicate Resource",
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Internal Server Error",
          });
        }
      } else {
        res.status(500).json({
          success: false,
          error: "Internal Server Error" + err,
        });
      }
    }
  };
}
