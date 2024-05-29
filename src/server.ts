import Fastify, { FastifyError, FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { Request, Response } from '@/interfaces';
import { glob } from 'glob';
import { swaggerConfig, swaggerUIConfig } from '@/config/swagger';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import * as middlewares from '@/middlewares';
import connectDatabase from '@/database/connect';

export default class Server {
    public server: FastifyInstance;

    constructor() {
        this.server = Fastify();
    }

    public async create() {
        const ipAddressesToIgnore = process.env.LOG_IGNORE_IPS?.split(',') || [];
        const isTestEnvironment = process.env.NODE_ENV === 'test';

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
            const isIgnoredIp = ipAddressesToIgnore.includes(request.clientIp);
            const isDocsRoute = !request.url.startsWith('/docs') || request.url === '/docs/json';

            if (!isTestEnvironment && !isIgnoredIp && isDocsRoute) {
                global.logger.logRequest(`${request.clientIp} - ${request.method} ${request.url} - ${response.statusCode}`);
            }
        });

        this.server.setErrorHandler((error: ZodError & FastifyError, request: Request, response: Response) => {
            if (error.code === 'FST_ERR_VALIDATION') {
                response.sendError('Invalid Parameters', 400, {
                    validationFailures: error.issues.map((x) => ({
                        path: x.path.join('.'),
                        message: x.message
                    }))
                });
                return;
            }
            if (error.statusCode === 429) {
                response.sendError('Too Many Requests', 429);
                return;
            }

            global.logger.error(error);
            response.sendError('Internal Server Error', 500);
        });

        this.server.setNotFoundHandler((request: Request, response: Response) => {
            response.sendError('Not Found', 404);
        });

        await this.registerRoutes();
        await this.registerPlugins();

        const port = parseInt(process.env.PORT || '3000');
        if (!isTestEnvironment) await this.server.listen({ port, host: '0.0.0.0' });

        await connectDatabase(process.env.MONGO_URI);

        return port;
    }

    private async registerRoutes() {
        this.server.register(fastifySwagger, swaggerConfig);
        this.server.register(fastifySwaggerUi, swaggerUIConfig);

        const dir = process.env.NODE_ENV === 'test' ? './src' : './dist';
        const files = await glob(dir + '/routes/**/*.{js,ts}');

        for (let file of files) {
            file = './' + file.replace(/\\/g, '/').substring(file.indexOf('routes'));
            let prefix = file.substring(8, file.length - 3);
            if (prefix.endsWith('/index')) prefix = prefix.substring(0, prefix.length - 6) || '/';

            const route = await import(file);
            this.server.register(route.default, { prefix });
        }
    }

    private async registerPlugins() {
        const dir = process.env.NODE_ENV === 'test' ? './src' : './dist';
        const files = await glob(dir + '/plugins/**/*.{js,ts}');

        for (let file of files) {
            file = './' + file.replace(/\\/g, '/').substring(file.indexOf('plugins'));
            const plugin = await import(file);
            this.server.register(plugin.default);
        }
    }
}