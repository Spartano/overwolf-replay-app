import { Injectable, EventEmitter } from '@angular/core';

import { GameEvent } from '../models/game-event';
import { captureEvent } from '@sentry/core';
import { S3FileUploadService } from './s3-file-upload.service';
import { SimpleIOService } from './plugins/simple-io.service';
import { GameEventsPluginService } from './plugins/game-events-plugin.service';
import { OverwolfService } from './overwolf.service';

@Injectable()
export class GameEvents {

	public allEvents = new EventEmitter<GameEvent>();
	public newLogLineEvents = new EventEmitter<GameEvent>();
	public onGameStart = new EventEmitter<GameEvent>();

	// The start / end spectating can be set outside of game start / end, so we need to keep it separate
	private spectating: boolean;

	constructor(
		private gameEventsPlugin: GameEventsPluginService,
		private io: SimpleIOService,
		private ow: OverwolfService,
		private s3: S3FileUploadService) {
		this.init();
	}

	private logLines: string[] = [];
	private processingLines = false;

	async init() {
		console.log('init game events monitor');
		const plugin = await this.gameEventsPlugin.get();
		plugin.onGlobalEvent.addListener((first: string, second: string) => {
			console.log('[game-events] received global event', first, second);
			if (first.toLowerCase().indexOf('exception') !== -1 || first.toLowerCase().indexOf('error') !== -1) {
				this.uploadLogsAndSendException(first, second);
			}
		});
		plugin.onGameEvent.addListener((gameEvent) => {
			this.dispatchGameEvent(JSON.parse(gameEvent));
		});
		plugin.initRealtimeLogConversion(() => {
			console.log('[game-events] real-time log processing ready to go');
		});

		setInterval(() => {
			if (this.processingLines) {
				return;
			}
			this.processingLines = true;
			let toProcess: string[] = [];
			let shouldDebug = false;
			if (this.logLines.some((data) => data.indexOf('CREATE_GAME') !== -1)) {
				console.log('[game-events] preparing log lines that include game creation to feed to the plugin', this.logLines);
				shouldDebug = true;
			}
			while (this.logLines.length > 0) {
				toProcess = [...toProcess, ...this.logLines.splice(0, this.logLines.length)];
			}
			if (shouldDebug) {
				console.log('[game-events] build log logs to feed to the plugin', toProcess);
			}
			if (toProcess.length > 0) {
				// console.log('processing start', toProcess);
				plugin.realtimeLogProcessing(toProcess, () => {
					this.processingLines = false;
				});
			} else {
				this.processingLines = false;
			}
		},
		500);
	}

	public dispatchGameEvent(gameEvent) {
		switch (gameEvent.Type) {
			case 'NEW_GAME':
				console.log(gameEvent.Type + ' event', gameEvent);
				this.allEvents.next(new GameEvent(GameEvent.GAME_START));
				this.onGameStart.next(new GameEvent(GameEvent.GAME_START));
				break;
			case 'MATCH_METADATA':
				console.log(gameEvent.Type + ' event', gameEvent);
				this.allEvents.next(new GameEvent(GameEvent.MATCH_METADATA, gameEvent.Value));
				break;
			case 'LOCAL_PLAYER':
				console.log(gameEvent.Type + ' event', gameEvent);
				this.allEvents.next(new GameEvent(GameEvent.LOCAL_PLAYER, gameEvent.Value));
				break;
			case 'OPPONENT_PLAYER':
				console.log(gameEvent.Type + ' event', gameEvent);
				this.allEvents.next(new GameEvent(GameEvent.OPPONENT, gameEvent.Value));
				break;
			case 'GAME_END':
				console.log(gameEvent.Type + ' event', gameEvent);
				this.allEvents.next(new GameEvent(GameEvent.GAME_END, gameEvent.Value.Game, gameEvent.Value.ReplayXml));
				break;
			default:
				// console.log('unsupported game event', gameEvent);
		}
	}

	public receiveLogLine(data: string) {
		if (data.indexOf('Begin Spectating') !== -1) {
			console.log('begin spectating', data);
			this.spectating = true;
		}
		if (data.indexOf('End Spectator Mode') !== -1) {
			console.log('end spectating', data);
			this.spectating = false;
		}

		if (this.spectating) {
			// For now we're not interested in spectating events, but that will come out later
			return;
		}

		this.logLines.push(data);

		if (data.indexOf('CREATE_GAME') !== -1) {
			console.log('[game-events] received CREATE_GAME log', data, this.logLines);
		}
	}

	private async uploadLogsAndSendException(first, second) {
		try {
			// Get the HS Power.log file
			const res = await this.ow.getRunningGameInfo();
			const logsLocation = res.executionPath.split('Hearthstone.exe')[0] + 'Logs\\Power.log';
			const logLines = await this.io.getFileContents(logsLocation);
			const s3LogFileKey = await this.s3.postLogs(logLines);
			console.log('uploaded logs to S3', s3LogFileKey, 'from location', logsLocation);
			const fullLogsFromPlugin = second.indexOf('/#/') !== -1 ? second.split('/#/')[0] : second;
			const pluginLogsFileKey = await this.s3.postLogs(fullLogsFromPlugin);
			console.log('uploaded fullLogsFromPlugin to S3', pluginLogsFileKey);
			const lastLogsReceivedInPlugin = second.indexOf('/#/') !== -1 ? second.split('/#/')[1] : second;
			const firestoneLogs = await this.io.zipAppLogFolder('Firestone');
			const firstoneLogsKey = await this.s3.postBinaryFile(firestoneLogs);
			console.log('posted Firestone logs', firstoneLogsKey);
			captureEvent({
				message: 'Exception while running plugin: ' + first,
				extra: {
					first: first,
					firstProcessedLine: fullLogsFromPlugin.indexOf('\n') !== -1 ? fullLogsFromPlugin.split('\n')[0] : fullLogsFromPlugin,
					lastLogsReceivedInPlugin: lastLogsReceivedInPlugin,
					logFileKey: s3LogFileKey,
					pluginLogsFileKey: pluginLogsFileKey,
					firestoneLogs: firstoneLogsKey,
					typeScriptLogLines: this.logLines,
				}
			});
			console.log('uploaded event to sentry');
		} catch (e) {
			console.error('Exception while uploading logs for troubleshooting', e);
		}
	}
}
