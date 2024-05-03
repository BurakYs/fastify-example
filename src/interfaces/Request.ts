import { FastifyRequest } from 'fastify';

export default interface Request extends FastifyRequest {
    clientIp: string;
    // eslint-disable-next-line semi
}