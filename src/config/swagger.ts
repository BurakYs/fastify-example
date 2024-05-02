import { SwaggerOptions } from '@fastify/swagger';
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import appConfig from '@/config/app';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

const swaggerConfig: SwaggerOptions = {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'Fastify API',
            version: '1.0.0',
            description: 'Fastify API Example using TypeScript, Swagger and Zod'
        },
        servers: [
            {
                url: appConfig.app.url
            }
        ]
    },
    transform: jsonSchemaTransform
};

const swaggerUIConfig: FastifySwaggerUiOptions = {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
        layout: 'BaseLayout'
    }
};

export { swaggerConfig, swaggerUIConfig };