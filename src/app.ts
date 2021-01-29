import express, { Response, Request } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler, notFoundError } from './middlewares';

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(
  cors({
    origin: /(chrome|moz)-extension:\/\//,
  })
);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200);
  res.json({
    message: 'hello world time is flying',
  });
});

app.use(notFoundError);
app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
