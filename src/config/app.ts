const { NODE_ENV = '', PORT = 3000 } = process.env;

const isProduction = NODE_ENV === 'production';

const appConfig = {
    rootUrl: isProduction ? 'https://api.example.com' : `http://localhost:${PORT}`,
    isProduction
};

export default appConfig;