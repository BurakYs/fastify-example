import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify, { type FastifyError, type FastifyInstance } from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { glob } from 'glob';
import type { ZodError, ZodIssue } from 'zod';
import { swaggerConfig, swaggerUIConfig } from '@/config/swagger';
import connectDatabase from '@/utils/connectDatabase';

export default class Server {
    public server: FastifyInstance;

    constructor() {
        this.server = Fastify();
    }

    public async create() {
        this.server.withTypeProvider<ZodTypeProvider>().setValidatorCompiler(validatorCompiler).setSerializerCompiler(serializerCompiler);

        await this.registerHooks();
        await this.registerPlugins();
        await this.registerRoutes();

        const port = Number.parseInt(process.env.PORT || '3000');
        await this.server.listen({ port });

        global.logger.info(`Server listening on http://localhost:${port}`);

        await connectDatabase(process.env.MONGO_URI);

        return port;
    }

    private async registerHooks() {
        const ipAddressesToIgnore = process.env.LOG_IGNORE_IPS?.split(',') || [];

        this.server.decorateReply('sendError', function (status, message, otherProperties) {
            return this.code(status).send({ success: false, status, error: message, ...otherProperties });
        });

        this.server.decorateReply('sendSuccess', function (status, message, otherProperties) {
            return this.code(status).send({ success: true, status, data: message, ...otherProperties });
        });

        this.server.addHook('onResponse', async (request, response) => {
            const isIgnoredIp = ipAddressesToIgnore.includes(request.ip);

            if (!isIgnoredIp) {
                const responseMs = response.elapsedTime.toFixed(2);
                const responseSize = response.getHeader('content-length') ?? 0;

                global.logger.info(`${response.statusCode} ${request.method} ${request.url} from ${request.ip} - ${responseSize} bytes in ${responseMs}ms`);
            }
        });

        this.server.setErrorHandler((error: ZodError & FastifyError, _request, response) => {
            if (error.code === 'FST_ERR_VALIDATION')
                return response.sendError(400, 'Invalid Parameters', {
                    validationFailures: error.validation?.map((x) => ({
                        path: (x.params.issue as ZodIssue)?.path?.join('.') || null,
                        message: x.message
                    }))
                });

            if (error.statusCode === 429) return response.sendError(429, 'Too Many Requests');

            global.logger.error(error);
            response.sendError(500, 'Internal Server Error');
        });

        this.server.setNotFoundHandler((_request, response) => {
            response.sendError(404, 'Not Found');
        });
    }

    private async registerPlugins() {
        const files = await glob('./dist/plugins/**/*.js');

        for (const file of files) {
            const filePath = `./${file.replace(/\\/g, '/').substring(file.indexOf('plugins'))}`;

            const plugin = await import(filePath);
            this.server.register(plugin.default);
        }
    }

    private async registerRoutes() {
        this.server.register(fastifySwagger, swaggerConfig);
        this.server.register(fastifySwaggerUi, swaggerUIConfig);

        const files = await glob('./dist/routes/**/*.js');

        for (let file of files) {
            file = `./${file.replace(/\\/g, '/').substring(file.indexOf('routes'))}`;

            let prefix = file.slice(8, -3).replaceAll('__', ':');

            if (prefix.endsWith('/index')) prefix = prefix.slice(0, -6) || '/';

            const route = await import(file);
            this.server.register(route.default, { prefix });
        }
    }
}
