import amqp, { Connection, Channel } from 'amqplib/callback_api';
import { IMessageProducer } from '../../../domain/providers/message';
import { RABBIT_URL, RABBIT_EXCH } from '../../config';

export class RabbitProducer implements IMessageProducer {
  private connection!: Connection;
  private channel!: Channel;

  async connect(url: string = RABBIT_URL): Promise<void> {
    return new Promise((resolve, reject) => {
      amqp.connect(url, (err, conn) => {
        if (err) return reject(err);
        this.connection = conn;
        conn.createChannel((errCh, ch) => {
          if (errCh) return reject(errCh);
          this.channel = ch;
          ch.assertExchange(RABBIT_EXCH, 'fanout', { durable: true }, (assertErr) => {
            if (assertErr) return reject(assertErr);
            resolve();
          });
        });
      });
    });
  }

  async send(routingKey: string, message: unknown): Promise<void> {
    const payload = Buffer.from(JSON.stringify(message));
    this.channel.publish(RABBIT_EXCH, routingKey, payload, { persistent: true });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.channel.close((errCh) => {
        if (errCh) return reject(errCh);
        this.connection.close((errConn) => {
          if (errConn) return reject(errConn);
          resolve();
        });
      });
    });
  }
}
