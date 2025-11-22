import type { SwaggerOptions } from '@fastify/swagger';
import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export const swaggerConfig: SwaggerOptions = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Fastify API',
      version: '1.0.0',
      description: 'API documentation for the Fastify API'
    },
    servers: [{ url: process.env.BASE_URL }],
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
    title: 'Fastify API Docs'
  }
};
