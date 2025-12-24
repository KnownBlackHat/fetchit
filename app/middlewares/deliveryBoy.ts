import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            usrId: string
        }
    }
}

export const deliveryMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];

    if (!token) {
        res.status(403).json({
            success: false,
            error: "No token provided"
        });
        return;
    }

    try {
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET || "MY_SECRET") as { usrid: string, role: string };
        if (decodedPayload.role !== "delivery_boy") {
            throw new Error();
        }
        req.usrId = decodedPayload.usrid;
        next();
    } catch {
        res.status(401).json({ success: false, error: "Unauthorized" })
        return;
    }

}


