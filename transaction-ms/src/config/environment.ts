export const env = () => ({
  databaseConnection: process.env.DATABASE_URL,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '5002',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  rabbitmqReportQueue: process.env.RABBITMQ_REPORT_QUEUE || 'report_queue',
  rabbitmqTransactionQueue:
    process.env.RABBITMQ_TRANSACTION_QUEUE || 'transaction_queue',
});
