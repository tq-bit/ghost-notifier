import axios from 'axios';
import { Request, Response } from 'express';
import { ChangeStreamDocument, OperationOptions } from 'mongodb';
import crypto from 'crypto';
import { NotificationEntry } from '../../../@types';

import { notificationCollection } from '../../db/dbClient';
import logger from '../../util/logger.util';

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

const writeEventMessage = (res: Response, type: EventType, data: NotificationEntry | string) => {
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

		notificationStream.on('change', (next: ChangeStreamDocument<NotificationEntry>) => {
			// @ts-ignore, fullDocument is not part of 'next'
			const notificationEntry: NotificationEntry = next.fullDocument;
			const operationType = next.operationType;
			logger.verbose(
				`Sending article update ${operationType} to client ${req.ip} with articleId ${notificationEntry.postId}`
			);

			return writeEventMessage(res, operationType, notificationEntry);
		});

		req.on('close', () => {
			logger.http('SSE session with client closed');
			notificationStream.close();
			res.end('closed');
		});
	},
};
