import type { NextFunction, Request, Response } from "express";

const asyncHandler = (
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error),
    );
  };
};

export { asyncHandler };
