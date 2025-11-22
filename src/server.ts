import path from 'node:path';
import fastifyAutoload from '@fastify/autoload';
import { FastifyError } from '@fastify/error';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod';
import mongoose from 'mongoose';
import { swaggerConfig, swaggerUIConfig } from '@/config/swagger';

export default class Server {
  public fastify = Fastify()
    .withTypeProvider<ZodTypeProvider>()
    .setValidatorCompiler(validatorCompiler)
    .setSerializerCompiler(serializerCompiler);

  public async start() {
    this.registerHooks();
    this.registerPlugins();
    this.registerRoutes();

    await this.fastify.ready();

    if (process.env.NODE_ENV !== 'test') {
      const port = Number.parseInt(process.env.PORT || '3000', 10);
      await this.fastify.listen({ port });
      global.logger.info(`Server listening on http://localhost:${port}`);
    }

    try {
      await mongoose.connect(process.env.MONGODB_URI);
      global.logger.info('Connected to MongoDB');
    } catch (error) {
      global.logger.fatal({ msg: 'Failed to connect to MongoDB', error });
      process.exit(1);
    }
  }

  public async shutdown() {
    await this.fastify.close();
    await mongoose.disconnect();
  }

  private registerHooks() {
    this.fastify.decorateReply('sendError', function (status, message, otherProperties) {
      return this.code(status).send({ error: message, ...otherProperties });
    });

    this.fastify.decorateReply('sendSuccess', function (status, data) {
      return this.code(status).send(data);
    });

    this.fastify.addHook('onResponse', async (request, response) => {
      const elapsed = response.elapsedTime.toFixed(2);
      global.logger.info(`${response.statusCode} ${request.method} ${request.url} from ${request.ip} - ${elapsed}ms`);
    });

    this.fastify.setErrorHandler((error, _request, response) => {
      if (hasZodFastifySchemaValidationErrors(error)) {
        return response.sendError(400, 'Invalid Parameters', {
          validationFailures: error.validation?.map((x) => ({
            path: x.instancePath.substring(1).replaceAll('/', '.'),
            message: x.message
          }))
        });
      }

      if (error instanceof FastifyError && error.statusCode === 429) {
        return response.sendError(429, 'Too Many Requests');
      }

      global.logger.error(error);
      response.sendError(500, 'Internal Server Error');
    });

    this.fastify.setNotFoundHandler((_request, response) => {
      response.sendError(404, 'Not Found');
    });
  }

  private registerPlugins() {
    this.fastify.register(fastifyAutoload, {
      dir: path.join(__dirname, 'plugins')
    });
  }

  private registerRoutes() {
    this.fastify.register(fastifySwagger, swaggerConfig);
    this.fastify.register(fastifySwaggerUi, swaggerUIConfig);

    this.fastify.register(fastifyAutoload, {
      dir: path.join(__dirname, 'routes')
    });
  }
}
