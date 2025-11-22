export {};

declare module 'bun' {
    interface Env {
        NODE_ENV: 'production' | 'development' | 'test';

        PORT: string;
        BASE_URL: string;

        MONGODB_URI: string;
    }
}
