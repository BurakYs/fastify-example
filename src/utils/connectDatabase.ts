import mongoose from 'mongoose';
import appConfig from '@/config/app';

export default async function connectDatabase(url: string) {
    try {
        await mongoose.connect(url, {
            dbName: appConfig.isProduction ? 'production' : 'development'
        });

        global.logger.info('Connected to MongoDB');
    } catch (error) {
        global.logger.fatal('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}