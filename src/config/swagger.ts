import fs from 'node:fs';
import appConfig from '@/config/app';
import type { SwaggerOptions } from '@fastify/swagger';
import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export const swaggerConfig: SwaggerOptions = {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'URL Shortener',
            version: '1.0.0',
            description: 'URL Shortener API Example using TypeScript, Zod and Swagger'
        },
        servers: [
            {
                url: appConfig.rootUrl
            }
        ],
        tags: [{ name: 'URL', description: 'URL shortener endpoints' }]
    },
    transform: jsonSchemaTransform
};

export const swaggerUIConfig: FastifySwaggerUiOptions = {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
        layout: 'BaseLayout'
    },
    theme: {
        title: 'URL Shortener API Documentation',
        css: [
            {
                filename: 'swagger.css',
                content: fs.readFileSync('./public/swagger.min.css', 'utf-8')
            }
        ],
        favicon: [
            {
                filename: 'favicon.ico',
                rel: 'icon',
                type: 'image/x-icon',
                sizes: '16x16',
                content: fs.readFileSync('./public/favicon.ico')
            }
        ]
    }
};
