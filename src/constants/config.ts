export const config = {
  nodeEnv: process.env.NODE_ENV,
  app: {
    env: process.env.APP_ENV,
    port: process.env.PORT || 5000
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || '9843j98wjf9jf!asda',
      signOptions: {}
    }
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    db: parseInt(process.env.REDIS_DB || '0'),
    password: process.env.REDIS_PASSWORD,
    keyPrefix: process.env.REDIS_PREFIX
  }
};
