import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/database';
import { messageRouter } from './routes/messageRoute';
import { env } from './config/env';

const app = express();

initializeDatabase();

app.use(
	cors({
		origin: env.ALLOWED_ORIGIN,
		methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
		allowedHeaders: ['Content-Type'],
		credentials: false,
	})
);
app.use(express.json());

app.use('/chat', messageRouter);

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
