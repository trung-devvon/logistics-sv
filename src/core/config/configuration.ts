export default () => ({
  nodeEnv: process.env.NODE_ENV || 'test',
  app: {
    name: process.env.APP_NAME || 'trung-logistics',
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || '0.0.0.0',
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10) || 587,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-super-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  prisma: {
    env: process.env.PRISMA_ENV || 'dev',
  },
});