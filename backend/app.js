import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import middleware from './middleware/index.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const origins = JSON.parse(process.env.CORS_ORIGIN || '*')
app.use(cors({ origin: origins }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(middleware.log);
app.use(middleware.auth);

app.get('/api', (req, res) => res.json({ message: 'ok' }));

app.use('/api/user', userRoutes);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  console.error(error.message, error.stack);
  res.status(status).json({ error: 'something went wrong' });
});

app.use(middleware.error404);

export default app;
