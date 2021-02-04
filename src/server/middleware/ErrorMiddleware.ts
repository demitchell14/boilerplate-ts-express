import {NextFunction, Request, Response} from "express";
import logger from "../../util/logger";
import CustomError from "../../util/errors/CustomError";

type RequestHandler = (req: Request, res: Response, next?: NextFunction) => any;

export default function(handler: RequestHandler): RequestHandler {
    return (req, res, next) => {
        try {
            const action = handler(req, res, next);
            if (action instanceof Promise) {
                action.catch((err) => {
                    logger.logger('error').log({
                        level: 'info',
                        message: err as any,
                    })
                    if (err instanceof CustomError) {
                        return res.status(err.getStatusCode()).send(err);
                    }

                    return res.status(500).send(err);
                })
            }
        } catch (err) {
            logger.logger('error').log({
                level: 'info',
                message: JSON.stringify(err),
            })
            if (err instanceof CustomError) {
                return res.status(err.getStatusCode()).send(err);
            }
            return res.status(500).send(err);
        }
    }
}

//
// export default function errorHandler(fn) {
//     return (req: Request, res, next) => {
//         return fn(req, res).catch(err => {
//
//         })
//     }
// }