import { connect, Connection, Channel } from 'amqplib';

export const tasksQueue = 'tasks';
export const usersCreatedQueue = 'users_created';
export const usersDeletedQueue = 'users_deleted';

export class RabbitBroker {
  private static connection: Connection | null;
  public static ch: Channel;

  private constructor() {}

  static async connectBroker() {
    if (!this.connection) {
      this.connection = await connect({
        hostname: '172.17.0.2',
        port: 5672,
        username: 'guest',
        password: 'guest'
      });

      console.log('Connected to RabbitMQ');

      this.ch = await this.connection.createChannel();
      await this.ch.assertQueue(tasksQueue);
      await this.ch.assertQueue(usersCreatedQueue);
      await this.ch.assertQueue(usersDeletedQueue);
    }
  }
}
