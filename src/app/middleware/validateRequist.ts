import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequistBody = (zodSchema: z.ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = zodSchema.safeParse(req.body);
        if (!result.success) {
            next(result.error);
        }
        // sanitizing and validating the request body
        req.body = result.data;
        next();
    }
}