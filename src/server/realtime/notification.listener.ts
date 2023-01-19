import axios from 'axios';
import { Request, Response } from 'express';
import { ChangeStreamDocument, OperationOptions } from 'mongodb';
import { NotificationEntry } from '../../@types';

import { notificationCollection } from '../model/dbClient';
import logger from '../util/logger.util';

type EventType =
	| 'open'
	| 'drop'
	| 'rename'
	| 'dropDatabase'
	| 'invalidate'
	| 'createIndexes'
	| 'create'
	| 'modify'
	| 'dropIndexes'
	| 'shardCollection'
	| 'reshardCollection'
	| 'refineCollectionShardKey'
	| 'insert'
	| 'update'
	| 'replace'
	| 'delete';

function _writeOpeningMessage(res: Response) {
	const notificationHeaders = {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',
	};

	res.writeHead(200, notificationHeaders);

	_writeEventMessage(res, 'open', 'Connection Opened');
}

function _writeEventMessage(res: Response, type: EventType, data: NotificationEntry | string) {
	res.write(`event: ${type}\n`);
	res.write(`data: ${typeof data === 'string' ? data : JSON.stringify(data)}\n`);
	res.write(`id: ${new Date().getTime()}\n\n`);
}

function _sendLametricNotification(notificationEntry: NotificationEntry) {
	const url = `http://${process.env.LAMETRIC_IP}/api/v2/device/notifications`;
	const payload = {
		model: {
			frames: [
				{
					icon: 4139, // Spooky!
					text: 'New article published! ' + notificationEntry.postTitle,
				},
			],
		},
	};
	const config = {
		headers: {
			authorization:
				'Basic ' + Buffer.from(`dev:${process.env.LAMETRIC_API_KEY}`).toString('base64'),
		},
	};
	axios
		.post(url, payload, config)
		.then((res) => logger.info('Notification sent to lametric device'))
		.catch((err) => logger.error(`Could not send to lametric: ${err}`));
}

function handlePostNotification(req: Request, res: Response) {
	_writeOpeningMessage(res);

	const notificationStream = notificationCollection.watch();

	notificationStream.on('change', (next: ChangeStreamDocument<NotificationEntry>) => {
		// fullDocument is not part of 'next'
		// @ts-ignore
		const notificationEntry: NotificationEntry = next.fullDocument;
		const operationType = next.operationType;
		logger.verbose(
			`Sending post operation ${operationType} to client ${req.ip} with postId ${notificationEntry.postId}`
		);

		return _writeEventMessage(res, operationType, notificationEntry);
	});

	req.on('close', () => {
		logger.http('SSE session with client closed');
		notificationStream.close();
		res.end('closed');
	});
}

// Bonus function if LAMETRIC_IP and LAMETRIC_API_KEY are enabled
function initLametricListener() {
	if (process.env.LAMETRIC_IP && process.env.LAMETRIC_API_KEY) {
		logger.verbose('Lametric notifications enabled');
		const notificationStream = notificationCollection.watch();
		notificationStream.on('change', (next: ChangeStreamDocument<NotificationEntry>) => {
			// fullDocument is not part of 'next'
			// @ts-ignore
			const notificationEntry: NotificationEntry = next.fullDocument;

			_sendLametricNotification(notificationEntry);
		});
	}
}

export default { handlePostNotification, initLametricListener };
