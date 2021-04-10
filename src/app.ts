import express, { Response, Request } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler, notFoundError } from './middlewares';
import routes from './routes/index';

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.status(200);
  res.json({
    message: 'hello world time is flying',
  });
});

app.use('/v1', routes);

app.use(notFoundError);
app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
