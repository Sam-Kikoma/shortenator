export default () => ({
  environment: process.env.NODE_ENV || 'development',
  appHost: process.env.APP_HOST,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
});
