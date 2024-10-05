import pino from 'pino';

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            ignore: 'pid,hostname',
            translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
            colorize: true
        }
    }
});

export default logger;