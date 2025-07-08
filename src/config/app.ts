const env = process.env;

const appConfig = {
    rootUrl: env.NODE_ENV === 'production' ? env.BASE_URL : `http://localhost:${env.PORT}`
};

export default appConfig;
