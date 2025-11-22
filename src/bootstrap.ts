import checkEnv from '@/utils/checkEnv';
import setupLogger from '@/utils/setupLogger';

setupLogger(process.env.NODE_ENV === 'test' ? 'warn' : 'info');
checkEnv();
