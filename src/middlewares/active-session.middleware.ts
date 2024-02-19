import type { Request,Response, NextFunction } from "express";


export const checkActiveSession = async (req: any, res: Response, next: NextFunction) => {
    if(req.session && req.session?.passport?.user){
        next()
    }else {
        res.send("session expired")
    }
}