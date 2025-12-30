import express from 'express';
import cors from 'cors';
import { loadEnv } from './config';
import { askStructured } from './ask-core';

loadEnv();

const app = express();

app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: false,
	})
);
app.use(express.json());

app.post('/ask', async (req, res) => {
	try {
		const { query } = req.body ?? {};

		if (!query || !String(query).trim()) {
			return res.status(400).json({ error: 'Invalid query' });
		}

		const out = await askStructured(query);

		return res.status(200).json(out);
	} catch (error: any) {
		res.status(500).json({ error: error.message || 'Internal Server Error' });
	}
});

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
