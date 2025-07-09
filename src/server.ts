import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyAutoload from '@fastify/autoload';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { hasZodFastifySchemaValidationErrors, serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { swaggerConfig, swaggerUIConfig } from '@/config/swagger';
import connectDatabase from '@/utils/connectDatabase';

export default class Server {
    public fastify = Fastify().withTypeProvider<ZodTypeProvider>().setValidatorCompiler(validatorCompiler).setSerializerCompiler(serializerCompiler);

    public async create() {
        // @ts-expect-error
        const dirname = path.dirname(fileURLToPath(import.meta.url));

        await this.registerHooks();
        await this.registerPlugins(dirname);
        await this.registerRoutes(dirname);

        const port = Number.parseInt(process.env.PORT || '3000');
        await this.fastify.listen({ port });

        global.logger.info(`Server listening on http://localhost:${port}`);

        await connectDatabase(process.env.MONGO_URI);

        return port;
    }

    private async registerHooks() {
        this.fastify.decorateReply('sendError', function (status, message, otherProperties) {
            return this.code(status).send({ error: message, ...otherProperties });
        });

        this.fastify.decorateReply('sendSuccess', function (status, data) {
            return this.code(status).send(data);
        });

        this.fastify.addHook('onResponse', async (request, response) => {
            const responseMs = response.elapsedTime.toFixed(2);
            const responseSize = response.getHeader('Content-Length') ?? 0;

            global.logger.info(`${response.statusCode} ${request.method} ${request.url} from ${request.ip} - ${responseSize} bytes in ${responseMs}ms`);
        });

        this.fastify.setErrorHandler((error, _request, response) => {
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

        this.fastify.setNotFoundHandler((_request, response) => {
            response.sendError(404, 'Not Found');
        });
    }

    private async registerPlugins(dirname: string) {
        await this.fastify.register(fastifyAutoload, {
            dir: path.join(dirname, 'plugins')
        });
    }

    private async registerRoutes(dirname: string) {
        this.fastify.register(fastifySwagger, swaggerConfig);
        this.fastify.register(fastifySwaggerUi, swaggerUIConfig);

        this.fastify.register(fastifyAutoload, {
            dir: path.join(dirname, 'routes')
        });
    }
}
