import { Injectable } from '@angular/core';

import { SimpleIOService } from './plugins/simple-io.service'
import { GameEvents } from './game-events.service'
import { LogListenerService } from './log-listener.service'
import { DeckParserService } from './deck/deck-parser.service';

@Injectable()
export class LogRegisterService {

	constructor(
		private decksService: DeckParserService,
		private gameEvents: GameEvents,
		private plugin: SimpleIOService) {
		this.init();
	}

	init(): void {
		console.log('[log-register] initiating log registerservice');
		new LogListenerService(this.plugin)
			.configure("Decks.log", (data) => this.decksService.parseActiveDeck(data))
			.subscribe((status) => {
				console.log('[log-register] status for decks', status);
			})
			.start();
		new LogListenerService(this.plugin)
			.configure("Power.log", (data) => this.gameEvents.receiveLogLine(data))
			.subscribe((status) => {
				console.log('[log-register] status for power.log', status);
			})
			.start();
	}
}
