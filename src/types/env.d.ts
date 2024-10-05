export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            NODE_ENV: 'development' | 'production';
            MONGO_URI: string;
        }
    }
}