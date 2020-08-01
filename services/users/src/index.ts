import { RabbitBroker } from './config/amqp';
import { connectDB } from './config/mongoose';
import app from './app';

async function init() {
  await RabbitBroker.connectBroker();
  await connectDB();
  app.listen(3000);
  console.log('Server on port', 3000);
}

init();
