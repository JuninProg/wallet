export const env = () => ({
  databaseConnection: process.env.DATABASE_URL,
  secret: process.env.SECRET || '',
  salt: process.env.SALT || '10',
  host: process.env.HOST,
});
