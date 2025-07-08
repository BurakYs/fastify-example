export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';

            PORT: string;
            BASE_URL: string;

            MONGO_URI: string;
        }
    }
}
