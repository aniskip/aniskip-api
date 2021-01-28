import express, { Response, Request } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.status(200);
  res.json({
    message: 'hello world',
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
