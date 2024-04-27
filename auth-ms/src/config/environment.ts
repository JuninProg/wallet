export const env = () => ({
  databaseConnection: process.env.DATABASE_URL,
  secret: process.env.SECRET || 'somesecret',
  salt: process.env.SALT || '10',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '5001',
});
