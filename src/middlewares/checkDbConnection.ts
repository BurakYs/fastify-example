import type { FastifyReply, FastifyRequest } from 'fastify';
import mongoose from 'mongoose';

export default async function checkDbConnection(_request: FastifyRequest, response: FastifyReply) {
    if (mongoose.connection.readyState !== 1) return response.sendError(500, 'Database connection not established');
}