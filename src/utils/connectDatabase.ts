import mongoose from 'mongoose';

export default async function connectDatabase(url: string) {
    try {
        await mongoose.connect(url, {
            dbName: process.env.NODE_ENV === 'production' ? 'production' : 'development'
        });

        global.logger.info('Connected to MongoDB');
    } catch (error) {
        global.logger.fatal('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}