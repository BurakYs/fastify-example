import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { hasZodFastifySchemaValidationErrors, serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { glob } from 'glob';
import { swaggerConfig, swaggerUIConfig } from '@/config/swagger';
import connectDatabase from '@/utils/connectDatabase';

export default class Server {
    public server = Fastify().withTypeProvider<ZodTypeProvider>().setValidatorCompiler(validatorCompiler).setSerializerCompiler(serializerCompiler);

    public async create() {
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
        this.server.decorateReply('sendError', function (status, message, otherProperties) {
            return this.code(status).send({ success: false, status, error: message, ...otherProperties });
        });

        this.server.decorateReply('sendSuccess', function (status, message, otherProperties) {
            return this.code(status).send({ success: true, status, data: message, ...otherProperties });
        });

        this.server.addHook('onResponse', async (request, response) => {
            const responseMs = response.elapsedTime.toFixed(2);
            const responseSize = response.getHeader('content-length') ?? 0;

            global.logger.info(`${response.statusCode} ${request.method} ${request.url} from ${request.ip} - ${responseSize} bytes in ${responseMs}ms`);
        });

        this.server.setErrorHandler((error, _request, response) => {
            if (hasZodFastifySchemaValidationErrors(error))
                return response.sendError(400, 'Invalid Parameters', {
                    validationFailures: error.validation?.map((x) => ({
                        path: x.instancePath.substring(1).replaceAll('/', '.'),
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
        const files = await glob('./src/plugins/**/*.ts');

        for (const file of files) {
            const filePath = `./${file.replace(/\\/g, '/').substring(file.indexOf('plugins'))}`;

            const plugin = await import(filePath);
            this.server.register(plugin.default);
        }
    }

    private async registerRoutes() {
        this.server.register(fastifySwagger, swaggerConfig);
        this.server.register(fastifySwaggerUi, swaggerUIConfig);

        const files = await glob('./src/routes/**/*.ts');

        for (let file of files) {
            file = `./${file.replace(/\\/g, '/').substring(file.indexOf('routes'))}`;
            let prefix = file.slice(8, -3).replaceAll('__', ':');

            if (prefix.endsWith('/index')) prefix = prefix.slice(0, -6) || '/';

            const route = await import(file);
            this.server.register(route.default, { prefix });
        }
    }
}
