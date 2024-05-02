import 'module-alias/register';
import 'dotenv/config';
import { Logger } from '@/helpers';
import Server from './server';
import { existsSync, mkdirSync } from 'fs';

if (!existsSync('./logs')) mkdirSync('./logs');

if (process.argv.includes('--production')) process.env.NODE_ENV = 'production';

global.logger = new Logger();

const server = new Server();
server.create();

process.on('unhandledRejection', (error: any) => global.logger.error(error));
process.on('uncaughtException', (error: any) => global.logger.error(error));