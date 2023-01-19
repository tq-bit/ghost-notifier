require('dotenv').config();

import express from 'express';
import cors from 'cors';
import { engine } from 'express-handlebars';

import viewRouter from './routes/view.router';
import articleRouter from './routes/article.router';
import realtimeRouter from './routes/realtime.router';
import logger from './util/logger.util';
import accessLogger from './middleware/accesslog.middleware';
import dbClient from './model/dbClient';

import NotificationListener from './realtime/notification.listener';

const HOST: string = process.env.API_HOST || '0.0.0.0';
const PORT: string = process.env.API_PORT || '3001';
const app: express.Application = express();

app.use(cors());
app.use(accessLogger);
app.use(express.static('public'));
app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/api/article', articleRouter);
app.use('/api/subscribe', realtimeRouter);
app.use('/', viewRouter);

app.listen(PORT, () => {
	dbClient.connect().then(() => {
		NotificationListener.initLametricListener();
		logger.verbose('Connected to MongoDB');
	});
	logger.verbose(`Server listening on http://${HOST}:${PORT}`);

	// const db = client.db('ghost');
	// const collection = db.collection('articles');

	// const changeStream = collection.watch();
	// changeStream.on('change', (next) => {
	// 	console.log({ msg: 'next', next });
	// });

	// setTimeout(async () => {
	// 	await collection.insertOne({
	// 		originalUrl: 'https://localhost:3030',
	// 		shortUrl: 'http://bit.ly/p/123',
	// 	});
	// 	await collection.insertOne({
	// 		originalUrl: 'https://localhost:3030',
	// 		shortUrl: 'http://bit.ly/p/462',
	// 	});
	// }, 1000);

	// await connection.close();
});
