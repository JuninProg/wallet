export const env = () => ({
  databaseConnection: process.env.DATABASE_URL,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '5002',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  rabbitmqRelatoryQueue:
    process.env.RABBITMQ_RELATORY_QUEUE || 'relatory_queue',
  transaction_ms_port: process.env.TRANSACTION_MS_PORT || '5002',
  transaction_ms_host: process.env.TRANSACTION_MS_HOST || 'localhost',
});
