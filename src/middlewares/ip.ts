import type { FastifyRequest } from 'fastify';

export default function ip(request: FastifyRequest) {
    const ip = (request.headers['x-forwarded-for'] || request.ip) as string;
    return ip.split(',').at(-1);
}
