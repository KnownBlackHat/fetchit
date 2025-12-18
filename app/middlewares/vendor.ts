import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            vendorId: string
        }
    }
}

export const vendorMiddleWare = (req: Request, res: Response, next: NextFunction) => {
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
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET || "MY_SECRET") as { shop_id: string, role: string };
        if (decodedPayload.role !== "vendor") {
            throw new Error();
        }
        req.vendorId = decodedPayload.shop_id;
        next();
    } catch {
        res.status(401).json({ success: false, error: "Unauthorized" })
        return;
    }

}
