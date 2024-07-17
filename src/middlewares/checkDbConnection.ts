import type { FastifyReply, FastifyRequest } from 'fastify';
import mongoose from 'mongoose';

export default function checkDbConnection(_request: FastifyRequest, response: FastifyReply, done: () => void) {
    if (mongoose.connection.readyState !== 1) return response.sendError('Database connection not established', 500);

    done();
}