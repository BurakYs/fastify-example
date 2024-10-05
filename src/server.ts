import Fastify, { type FastifyError, type FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ZodError } from 'zod';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { swaggerConfig, swaggerUIConfig } from '@/config/swagger';
import { glob } from 'glob';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import connectDatabase from '@/utils/connectDatabase';
import * as middlewares from '@/middlewares';
import mongoose from 'mongoose';

export default class Server {
    public server: FastifyInstance;

    constructor() {
        this.server = Fastify();
    }

    public async create() {
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
            middlewares.ip(request);
        });

        this.server.addHook('onResponse', async (request, response) => {
            const responseMs = response.elapsedTime.toFixed(2);
            const responseSize = response.getHeader('content-length') ?? 0;

            global.logger.info(`${response.statusCode} ${request.method} ${request.url} from ${request.clientIp} - ${responseSize} bytes in ${responseMs}ms`);
        });

        this.server.setErrorHandler((error: ZodError & FastifyError, _request: FastifyRequest, response: FastifyReply) => {
            if (error.code === 'FST_ERR_VALIDATION')
                return response.sendError('Invalid Parameters', 400, {
                    validationFailures: error.issues?.map((x) => ({
                        path: x.path.join('.'),
                        message: x.message
                    }))
                });

            if (error.statusCode === 429)
                return response.sendError('Too Many Requests', 429);

            global.logger.error(error);
            response.sendError('Internal Server Error', 500);
        });

        this.server.setNotFoundHandler((_request: FastifyRequest, response: FastifyReply) => {
            response.sendError('Not Found', 404);
        });

        await this.registerPlugins();
        await this.registerRoutes();

        const port = parseInt(process.env.PORT || '3000');
        await this.server.listen({ port, host: '0.0.0.0' });

        global.logger.info(`Server listening on http://localhost:${port}`);

        await connectDatabase(process.env.MONGO_URI);

        ['SIGINT', 'SIGTERM'].forEach((signal) => {
            process.on(signal, async () => {
                await this.server.close();
                await mongoose.connection.close();
                process.exit();
            });
        });
    }

    private async registerRoutes() {
        this.server.register(fastifySwagger, swaggerConfig);
        this.server.register(fastifySwaggerUi, swaggerUIConfig);

        const files = await glob('./dist/routes/**/*.js');

        for (let file of files) {
            file = './' + file.replace(/\\/g, '/').substring(file.indexOf('routes'));
            let prefix = file.substring(8, file.length - 3);
            if (prefix.endsWith('/index')) prefix = prefix.substring(0, prefix.length - 6) || '/';
            prefix = prefix.replace(/\[([^\]]+)]/g, ':$1');

            const routeFile = await import(file);
            this.server.register(routeFile.default, { prefix });
        }
    }

    private async registerPlugins() {
        const files = await glob('./dist/plugins/**/*.js');

        for (let file of files) {
            file = './' + file.replace(/\\/g, '/').substring(file.indexOf('plugins'));

            const pluginFile = await import(file);
            this.server.register(pluginFile.default);
        }
    }
}