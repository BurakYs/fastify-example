export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            NODE_ENV: 'development' | 'production' | 'test';
            LOG_IGNORE_IPS?: string;
        }
    }
}