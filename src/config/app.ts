const { NODE_ENV = '', PORT = 3000 } = process.env;

const isProduction = ['prod', 'production'].includes(NODE_ENV.toLowerCase());

const appConfig = {
    rootUrl: isProduction ? 'https://api.example.com' : `http://localhost:${PORT}`,
    isProduction
};

export default appConfig;