import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import userRoutes from './routes/user.routes';
import { handleError } from './error';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

app.use(handleError);

export default app;
