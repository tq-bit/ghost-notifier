require('dotenv').config();

import express from 'express';
import cors from 'cors';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';

import notificationRouter from './components/notification/notification.routes';
import domainRouter from './components/domain/domain.routes';
import userRouter from './components/user/user.routes';
import viewRouter from './components/views/view.routes';

import logger from './util/logger.util';
import accessLogger from './middleware/accesslog.middleware';
import dbClient from './db/dbClient';

const HOST: string = process.env.API_HOST || '0.0.0.0';
const PORT: string = process.env.API_PORT || '3001';
const app: express.Application = express();

app.use(cors());
app.use(cookieParser());
app.use(accessLogger);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/api/notification', notificationRouter);
app.use('/api/domain', domainRouter);
app.use('/api/user', userRouter);
app.use('/', viewRouter);

app.listen(PORT, () => {
	dbClient.connect().then(() => {
		logger.verbose('Connected to MongoDB');
	});
	logger.verbose(`Server listening on http://${HOST}:${PORT}`);
});

import Config from './config/app.config';
