import pino, { type LevelWithSilent } from 'pino';

export default function setupLogger(level?: LevelWithSilent) {
  global.logger = pino({
    level,
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
