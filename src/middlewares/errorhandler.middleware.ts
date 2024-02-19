import { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import {ValidationError} from 'joi'
const ErrorHandlerMiddleware: ErrorRequestHandler = (err: unknown, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
          error: err.message,
          errors: err.errors,
          status: err.statusCode,
          success: false,
          timestamp: new Date(),
        });
      } else if(err instanceof ValidationError){
        res.status(400).json({
            error: err.message,
            errors: err.details,
            status: 400,
            success: false,
            timestamp: new Date(),
        });

      }else {
        res.status(500).json({
            error: err ?? "Internal Server Error",
            errors: null,
            status: 500,
            success: false,
            timestamp: new Date(),
        });
      }
}

export default ErrorHandlerMiddleware;