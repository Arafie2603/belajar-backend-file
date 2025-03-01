import { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    console.error("Global Error:", err);

    if (res.headersSent) {
        return next(err); 
    }

    const statusCode = err.status || 500;
    const message = err.message || "Internal server error";
    const errors = err.errors || null;

    res.status(statusCode).json({
        status: statusCode,
        message,
        errors
    });
}
