import express, {Application, RequestHandler} from 'express';
import { logger } from "../util";
import cookieParser from "cookie-parser";
import cors from 'cors';
import RouterManager from "./routes";

type MiddlewareNames = 'cors'|'cookie'|'session'|'logger'|string;
type MiddlewareFunction = RequestHandler;

type Middleware = {
    [s in MiddlewareNames]: MiddlewareFunction;
}

export type StartProps = {
    port: number;
};

export default class Server {
    private readonly app: Application;
    private readonly routerManager: RouterManager;
    private readonly mode: string;

    private started = false;
    private middleware: Middleware;

    constructor(mode: string = 'production') {
        this.app = express();
        this.routerManager = new RouterManager(this.app);
        this.mode = mode;
        this.middleware = {
            logger: logger.getMiddleware(),
            cors: cors({
                origin: /.*(localhost).*/
            }),
            cookie: cookieParser(),
        }
    }

    public addMiddleware(name: string, middlewareFn: MiddlewareFunction) {
        if (this.started) throw new Error('Cannot add middleware to a server that is already running.');
        this.middleware[name] = middlewareFn;
    }


    public async start(props: StartProps) {
        const { port } = props;
        const { app } = this;
        this.started = true;

        Object.values(this.middleware)
            .map((middleware) => app.use(middleware));

        app.use(this.routerManager.getRouter());

        app.listen(port, () => logger.log(`Server listening on port ${port}.`));
    }

}