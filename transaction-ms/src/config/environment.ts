export const env = () => ({
  databaseConnection: process.env.DATABASE_URL,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '5002',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  rabbitmqRelatoryQueue:
    process.env.RABBITMQ_RELATORY_QUEUE || 'relatory_queue',
  rabbitmqTransactionQueue:
    process.env.RABBITMQ_TRANSACTION_QUEUE || 'transaction_queue',
});
