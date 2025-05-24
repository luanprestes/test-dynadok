export interface IMessageProducer {
  send(routingKey: string, message: unknown): Promise<void>;
}
