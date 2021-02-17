import { config as env } from 'dotenv';
process.env.NODE_ENV = `${process.env.NODE_ENV}`.trim();
env();

import Server from './server';
import session from "express-session";

async function start() {
    const server = new Server();

    server.addMiddleware('session', session({
        secret: 'test phrase',
        resave: true,
        saveUninitialized: true,
    }))

    await server.start({
        port: Number.parseInt(process.env.PORT),
    });
}

start().catch((err) => {
    console.error(err);
})