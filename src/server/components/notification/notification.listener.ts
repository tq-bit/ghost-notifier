import crypto from 'crypto';
import { Request, Response } from 'express';
import { ChangeStreamDocument } from 'mongodb';
import { Notification } from '../../../@types/notification';

import { notificationCollection } from '../../db/dbClient';
import logger from '../../util/logger.util';

import { NotificationEventType } from '../../../@types/notification';

const writeEventMessage = (
	res: Response,
	type: NotificationEventType,
	data: Notification | string
) => {
	res.write(`event: ${type}\n`);
	res.write(`data: ${typeof data === 'string' ? data : JSON.stringify(data)}\n`);
	res.write(`id: ${crypto.randomUUID()}\n\n`);
};

const writeOpeningMessage = (res: Response) => {
	const notificationHeaders = {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',
	};

	res.writeHead(200, notificationHeaders);

	writeEventMessage(res, 'open', 'Connection opened');
};

export default {
	subscribeToArticleNotifications(req: Request, res: Response) {
		writeOpeningMessage(res);

		const notificationStream = notificationCollection.watch();

		notificationStream.on('change', (next: ChangeStreamDocument<Notification>) => {
			// @ts-ignore, fullDocument is not part of 'next'
			const notification: Notification = next.fullDocument;
			const operationType = next.operationType;
			logger.verbose(
				`Sending article update ${operationType} to client ${req.ip} with articleId ${notification.ghostId}`
			);

			return writeEventMessage(res, operationType, notification);
		});

		req.on('close', () => {
			logger.http('SSE session with client closed');
			notificationStream.close();
			res.end('closed');
		});
	},
};
