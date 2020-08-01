import { connect } from 'mongoose';

export async function connectDB() {
  try {
    await connect('mongodb://localhost/micro-tasks', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB is Online');
  } catch (err) {
    console.error(err);
  }
}
