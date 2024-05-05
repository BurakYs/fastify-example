import { SwaggerOptions } from '@fastify/swagger';
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import appConfig from '@/config/app';

export const swaggerConfig: SwaggerOptions = {
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
        ],
        tags: [
            { name: 'Zod', description: 'Zod example endpoints' }
        ]
    },
    transform: jsonSchemaTransform
};

export const swaggerUIConfig: FastifySwaggerUiOptions = {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
        layout: 'BaseLayout'
    }
};