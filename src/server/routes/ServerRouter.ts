import {Application, Router} from "express";

export default class ServerRouter {
    private readonly app: Application;
    private readonly router: Router;

    constructor(app: Application) {
        this.app = app;
        this.router = Router();
    }

    getRouter() {
        return this.router;
    }
}