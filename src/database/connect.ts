import mongoose from 'mongoose';
import appConfig from '@/config/app';

export default function connect(url?: string) {
    if (!url) {
        global.logger.fatal('MongoDB URI not provided');
        process.exit(1);
    }

    mongoose.connect(url, {
        dbName: appConfig.isProduction ? 'production' : 'development'
    }).then(() => {
        global.logger.info('Connected to MongoDB');
    }).catch((err) => {
        global.logger.error(err);
        process.exit(1);
    });
}