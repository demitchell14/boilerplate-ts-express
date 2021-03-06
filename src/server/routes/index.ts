import {Application, RequestHandler} from "express";
import ErrorMiddleware from "../middleware/ErrorMiddleware";
import ServerRouter from "./ServerRouter";
import AuthenticationError from "../../util/errors/AuthenticationError";

export type RouterManagerProps = {};

export default class RouterManager extends ServerRouter {

    constructor(app: Application, props?: RouterManagerProps) {
        super(app);

        this.getRouter().all('/', ErrorMiddleware(this.homeRoute));
        this.getRouter().all('/test', ErrorMiddleware(this.testRoute));
        this.getRouter().all('/:id', ErrorMiddleware(this.anotherTestRoute));
    }

    testRoute: RequestHandler = async (req, res) => {
        throw new AuthenticationError(`authentication error message`);
    }

    homeRoute: RequestHandler = (req, res) => {
        res.send({
            hello: 'world',
        });
    }

    anotherTestRoute: RequestHandler = (req, res) => {
        const timeout = Math.floor(Math.random() * 3000) + 1000;
        setTimeout(() => {
            res.send({
                hello: 'world',
            });
        }, timeout);
    }

}