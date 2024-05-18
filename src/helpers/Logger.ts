import { ILogObj, ILogObjMeta, Logger } from 'tslog';
import { appendFileSync } from 'fs';
import loggerSettings from '@/config/logger';

export default class CustomLogger extends Logger<ILogObj> {
    constructor() {
        super(loggerSettings);

        this.attachTransport((logObj) => {
            const meta = logObj._meta || {};
            const message = Object.entries(logObj).filter(([key]) => !isNaN(parseInt(key))).map(([, value]) => value).join(' ');

            if (meta.logLevelName === 'REQUEST') {
                appendFileSync('./logs/request.log', `${new Date(meta.date).toISOString()} ${message}\n`);
            }
        });
    }

    /**
     * Logs an HTTP request.
     * @param args - Multiple log attributes that should be logged.
     * @return LogObject with meta property, when log level is >= minLevel
     */
    public logRequest(...args: unknown[]): ILogObj & ILogObjMeta | undefined {
        return super.log(6, 'REQUEST', ...args);
    }
}