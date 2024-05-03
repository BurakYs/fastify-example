import { FastifyReply } from 'fastify';

export default interface Response extends FastifyReply {
	sendSuccess: (message: unknown, status: number, otherProperties?: Record<string, any>) => this;
	sendError: (message: unknown, status: number, otherProperties?: Record<string, any>) => this;
	// eslint-disable-next-line semi
}