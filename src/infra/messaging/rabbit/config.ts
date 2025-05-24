import { IMessageProducer } from '../../../domain/providers/message';
import { RabbitProducer } from './producer';

let producerSingleton: IMessageProducer | null = null;

export async function getProducer(): Promise<IMessageProducer> {
  if (!producerSingleton) {
    producerSingleton = new RabbitProducer();
    await (producerSingleton as RabbitProducer).connect();
  }
  return producerSingleton;
}
