import pino from 'pino';

export default function setupLogger() {
    global.logger = pino({
        transport: {
            target: 'pino-pretty',
            options: {
                ignore: 'pid,hostname',
                translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
                colorize: true
            }
        }
    });
}
