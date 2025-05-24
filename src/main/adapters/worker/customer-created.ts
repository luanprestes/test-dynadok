import type { ConsumeMessage } from 'amqplib';
import { RabbitConsumer } from '../../../infra/messaging/rabbit/consumer';
import { makePrintLogCustomerUseCase } from '../../factories/customer';

async function startWorker() {
  const consumer = new RabbitConsumer();
  await consumer.connect();

  const printLogUC = await makePrintLogCustomerUseCase();

  await consumer.consume('customer_logs', async (msg: ConsumeMessage) => {
    const event = JSON.parse(msg.content.toString());
    await printLogUC.execute(event);
  });
}

startWorker().catch((err) => {
  console.error('❌ Worker falhou:', err);
  process.exit(1);
});
