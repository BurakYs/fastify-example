const { NODE_ENV = '', PORT = 3000 } = process.env;

const isDevelopment = ['development', 'dev', 'test'].includes(NODE_ENV.toLowerCase());

const AppConfig = {
    app: {
        url: isDevelopment ? `http://localhost:${PORT}` : 'https://api.example.com',
        isDevelopment
    }
};

export default AppConfig;