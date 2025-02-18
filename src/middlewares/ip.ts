import type { FastifyRequest } from 'fastify';

export default function ip(request: FastifyRequest) {
    const proxyIp = (request.headers['x-forwarded-for'] as string | undefined)?.split(',').at(-1);
    return proxyIp || request.ip;
}
