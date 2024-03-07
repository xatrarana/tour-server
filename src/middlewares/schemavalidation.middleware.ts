import JOI from 'joi';
import type { Request, Response, NextFunction } from 'express';
export const schemaValidation = (schema: JOI.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const {error,value} = schema.validate(req.body);
        if(error) return next(error);
        req.body = value;
        next();
    }   
}