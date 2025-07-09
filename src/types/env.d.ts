export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development' | 'test';

            PORT: string;
            BASE_URL: string;

            MONGODB_URI: string;
        }
    }
}
