const { NODE_ENV, PORT = 3000 } = process.env;

const appConfig = {
    rootUrl: NODE_ENV === 'production' ? 'https://api.example.com' : `http://localhost:${PORT}`
};

export default appConfig;