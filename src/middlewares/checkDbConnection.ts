import { Request, Response } from '@/interfaces';
import mongoose from 'mongoose';

export default function checkDbConnection(request: Request, response: Response, done: () => void) {
    if (mongoose.connection.readyState !== 1) {
        response.sendError('Database connection not established', 500);
        return;
    }

    done();
}