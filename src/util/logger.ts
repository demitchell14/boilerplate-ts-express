import winston, { Logger as WinstonLogger, format } from 'winston';
import { RequestHandler } from "express";
import * as expressWinston from "express-winston";
const { combine, timestamp: winstonTimestamp, label, prettyPrint, json, printf } = format;

type Loggers = 'error'|'verbose';

type LoggerProps = {
    mode: string;
    direction?: string;
    storageDirectory?: string;
}

export class Logger {
    readonly mode: string;
    readonly basedir: string;

    loggers: {
        [s in Loggers]: WinstonLogger;
    };

    constructor(props: LoggerProps) {
        this.mode = props.mode;
        this.basedir = props.storageDirectory || 'logs'

        this.loggers = {
            verbose: winston.createLogger({
                format: this.getFormat(),
                transports: this.getTransports('verbose'),
            }),
            error: winston.createLogger({
                format: this.getFormat(),
                transports: this.getTransports('error'),
            })
        }
    }

    getTransports(name: string) {
        const transports = [];
        if (process.env.NODE_ENV !== 'production') {
            transports.push(new winston.transports.Console())
        } else {
            transports.push(new winston.transports.File({
                dirname: this.basedir,
                filename: `${name}.log`,
            }))
        }
        return transports;
    }

    getFormat() {
        const formatOptions = [this.timestamp('default')];
        if (process.env.NODE_ENV === 'production') {
            formatOptions.push(json({ space: 2 }));
            formatOptions.push(printf((info) => JSON.stringify(info) + '\n'))
        } else {
            formatOptions.push(prettyPrint({ colorize: true }))
        }
        return combine(...formatOptions);
    }

    getMiddleware(): RequestHandler {
        const transports = this.getTransports('middleware');
        const format = this.getFormat();

        return expressWinston.logger({
            transports,
            format,
            meta: false,
            msg: 'HTTP {{req.method} {{req.url}}',
            expressFormat: true,
            colorize: false,
        })
    }

    private timestamp(str?: string) {
        if (this.mode === 'production')
            return winstonTimestamp();

        return label({ label: str || 'Development' });
    }

    logger(type: Loggers) {
        return this.loggers[type];
    }

    log(...args) {
        try {
            this.loggers.verbose.log({ level: 'info', message: JSON.stringify(args) });
        } catch (e) {
            console.trace(e);
        }
    }
}

export default new Logger({ mode: process.env.NODE_ENV })