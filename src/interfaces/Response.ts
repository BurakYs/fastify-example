import { FastifyReply } from 'fastify';

export interface Response extends FastifyReply {
	sendSuccess: (message: any, status: number, otherProperties?: any) => this;
	sendError: (message: any, status: number, otherProperties?: any) => this;
}