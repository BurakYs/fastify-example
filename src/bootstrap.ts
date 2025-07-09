import dotenv from 'dotenv';

import checkEnv from '@/utils/checkEnv';
import setupLogger from '@/utils/setupLogger';

dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    quiet: true
});

setupLogger();
checkEnv();
