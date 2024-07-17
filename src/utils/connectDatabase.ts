import mongoose from 'mongoose';
import appConfig from '@/config/app';

export default async function connectDatabase(url: string) {
    const shouldLog = process.env.NODE_ENV !== 'test';

    try {
        await mongoose.connect(url, {
            dbName: appConfig.isProduction ? 'production' : 'development'
        });

        if (shouldLog) global.logger.info('Connected to MongoDB');
    } catch (error) {
        if (shouldLog) {
            global.logger.fatal('Failed to connect to MongoDB', error);
            process.exit(1);
        }
    }
}