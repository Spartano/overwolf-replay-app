import { Injectable } from '@angular/core';
import { SimpleIOService } from './plugins/simple-io.service';
import { GameEvents } from './game-events.service';

const HEARTHSTONE_GAME_ID = 9898;

declare var overwolf: any;

@Injectable()
export class DevService {

	constructor(
		private io: SimpleIOService,
		private gameEvents: GameEvents) {
		this.addTestCommands();
	}

	private addTestCommands() {
		this.addCustomLogLoaderCommand();
	}

	private addCustomLogLoaderCommand() {	
		window['loadLog'] = (logName, deckString) => {
			overwolf.games.getRunningGameInfo(async (res: any) => {
				if (res && res.isRunning && res.id && Math.floor(res.id / 10) === HEARTHSTONE_GAME_ID) {
					const logsLocation = res.executionPath.split('Hearthstone.exe')[0] + 'Logs\\' + logName;
					const logContents = await this.io.getFileContents(logsLocation);
					this.loadArbitraryLogContent(logContents);
				}
			});
		}
	}

	private async loadArbitraryLogContent(content: string) {
        content.split('\n').forEach((line) => this.gameEvents.receiveLogLine(line));
	}
}
