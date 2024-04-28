export const env = () => ({
  databaseConnection: process.env.DATABASE_URL,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '5002',
});
