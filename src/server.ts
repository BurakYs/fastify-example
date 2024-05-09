import { glob } from 'glob';
import path from 'path';
import Fastify, { FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { Request, Response } from '@/interfaces';
import { RESPONSES } from '@/constants';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { swaggerConfig, swaggerUIConfig } from '@/config/swagger';
import * as middlewares from '@/middlewares';

export default class Server {
    private server;

    constructor() {
        this.server = Fastify();
    }

    public create() {
        const ipAddressesToIgnore = process.env.LOG_IGNORE_IPS?.split(',') || [];

        this.server
            .withTypeProvider<ZodTypeProvider>()
            .setValidatorCompiler(validatorCompiler)
            .setSerializerCompiler(serializerCompiler);

        this.server.decorateReply('sendError', function (message, status, otherProperties) {
            return this.code(status).send({ success: false, status, error: message, ...otherProperties });
        });

        this.server.decorateReply('sendSuccess', function (message, status, otherProperties) {
            return this.code(status).send({ success: true, status, data: message, ...otherProperties });
        });

        this.server.addHook('onRequest', async (request) => {
            request.clientIp = middlewares.ip(request);
        });

        this.server.addHook('onResponse', async (request, response) => {
            if (!ipAddressesToIgnore.includes(request.clientIp) && (!request.url.startsWith('/docs/') || request.url === '/docs/json')) {
                global.logger.logRequest(`${request.clientIp} - ${request.method} ${request.url} - ${response.statusCode}`);
            }
        });

        this.server.setErrorHandler((error: ZodError & FastifyError, request: Request, response: Response) => {
            if (error.code === 'FST_ERR_VALIDATION') {
                response.sendError(`Invalid parameters were provided: ${error.issues.map(x => x.path.join('.')).join(', ')}`, 400, {
                    validationFailures: error.issues.map(x => ({
                        path: x.path.join('.'),
                        message: x.message
                    }))
                });
                return;
            }

            global.logger.error(error);
            response.sendError(RESPONSES.INTERNAL_SERVER_ERROR, 500);
            return;
        });

        this.server.setNotFoundHandler((request: Request, response: Response) => {
            response.sendError(RESPONSES.PAGE_NOT_FOUND, 404);
        });

        this.registerRoutes().then(() => {
            const port = parseInt(process.env.PORT || '3000');

            this.server.listen({ port, host: '0.0.0.0' }).then(() => {
                global.logger.info(`Server listening on http://localhost:${port}`);
            }).catch(err => {
                global.logger.error(err);
                process.exit(1);
            });
        });
    }

    private async registerRoutes() {
        this.server.register(fastifySwagger, swaggerConfig);
        this.server.register(fastifySwaggerUi, swaggerUIConfig);

        const files = await glob(path.resolve(__dirname, 'routes/**/*.js').replace(/\\/g, '/'));

        for (let file of files) {
            file = './' + file.replace(/\\/g, '/').substring(file.indexOf('routes'));
            let prefix = file.substring(8, file.length - 3);
            if (prefix.endsWith('/index')) prefix = prefix.substring(0, prefix.length - 6) || '/';

            const route = await import(file);
            this.server.register(route.default, { prefix });
        }
    }
}