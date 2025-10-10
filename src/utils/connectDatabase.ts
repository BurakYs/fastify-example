import mongoose from 'mongoose';

export default async function connectDatabase(url: string) {
    try {
        await mongoose.connect(url);

        if (process.env.NODE_ENV !== 'test') {
            global.logger.info('Connected to MongoDB');
        }
    } catch (error) {
        global.logger.fatal({ msg: 'Failed to connect to MongoDB', err: error });
        process.exit(1);
    }
}
