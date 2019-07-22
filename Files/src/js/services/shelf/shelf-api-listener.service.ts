import { Injectable } from '@angular/core';
import { ShelfApiService } from './shelf-api.service';
import { NGXLogger } from 'ngx-logger';
import { ShelfStoreService } from './store/shelf-store.service';
import { GameSelectedEvent } from './store/events/game-selected-event';

@Injectable()
export class ShelfApiListenerService {

	constructor(
			private logger: NGXLogger,
			private shelfApi: ShelfApiService,
			private store: ShelfStoreService) {
		this.shelfApi.currentGame.subscribe(game => {
			this.logger.info('[shelf-api-listener] Updating current game', game);
			this.store.publishEvent(new GameSelectedEvent(game));
		});
		logger.debug('[shelf-api-listener] initialized shelfApi listener');
	}
}
