import { Injectable } from '@angular/core';
import { DeckParserService } from '../hs-integration/services/deck-parser.service';
import { GameEvents } from '../hs-integration/services/game-events.service';
import { OverwolfService } from '../hs-integration/services/overwolf.service';
import { SimpleIOService } from '../hs-integration/services/simple-io.service';
import { LogListenerService } from './log-listener.service';

@Injectable()
export class LogRegisterService {
	monitoring: boolean;
	fileInitiallyPresent: boolean;
	logsLocation: string;

	retriesLeft = 20;

	constructor(
		private decksService: DeckParserService,
		private ow: OverwolfService,
		private gameEvents: GameEvents,
		private plugin: SimpleIOService,
	) {
		console.log('starting debug service');
		this.init();
	}

	init(): void {
		console.log('[log-register] initiating log registerservice');
		new LogListenerService(this.plugin, this.ow)
			.configure('Power.log', data => this.gameEvents.receiveLogLine(data))
			.subscribe(status => {
				console.log('[log-register] status for power.log', status);
				// this.events.broadcast(status, "Power.log");
			})
			.start();
		new LogListenerService(this.plugin, this.ow)
			.configure('Decks.log', data => this.decksService.parseActiveDeck(data))
			.subscribe(status => {
				console.log('[log-register] status for decks', status);
			})
			.start();
	}
}
