import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib/callback_api';
import { RABBIT_EXCH, RABBIT_URL } from '../../config';

export class RabbitConsumer {
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

  async consume(queueName: string, onMessage: (msg: ConsumeMessage) => void): Promise<void> {
    this.channel.assertQueue(queueName, { durable: true }, (errQ, q) => {
      if (errQ) throw errQ;
      this.channel.bindQueue(q.queue, RABBIT_EXCH, '', {}, (errB) => {
        if (errB) throw errB;
        this.channel.consume(q.queue, (msg) => {
          if (msg) {
            onMessage(msg as any);
            this.channel.ack(msg);
          }
        });
      });
    });
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
