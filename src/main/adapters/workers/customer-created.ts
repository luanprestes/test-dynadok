import type { ConsumeMessage } from 'amqplib';
import { RabbitConsumer } from '../../../infra/messaging/rabbit/consumer';
import { makePrintLogCustomerUseCase } from '../../factories/customer';

export async function startWorker() {
  const consumer = new RabbitConsumer();
  await consumer.connect().then((e) => console.log(e));

  const printLogUC = await makePrintLogCustomerUseCase();

  await consumer.consume('customer_logs', async (msg: ConsumeMessage) => {
    const event = JSON.parse(msg.content.toString());
    await printLogUC.execute(event);
  });
}
