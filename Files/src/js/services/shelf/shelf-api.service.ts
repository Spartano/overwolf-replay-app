import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Game } from '../../models/game';
import { GameDbService } from '../game-db.service';
import { OverwolfService } from '../overwolf.service';
import { GameSelectedEvent } from './store/events/game-selected-event';
import { GlobalErrorEvent } from './store/events/global-error-event';
import { ShelfStoreService } from './store/shelf-store.service';

@Injectable()
export class ShelfApiService {
	constructor(private logger: NGXLogger, private ow: OverwolfService, private gameDb: GameDbService, private store: ShelfStoreService) {
		this.init();
	}

	private async init(): Promise<void> {
		// setTimeout(() => this.init(), 50);
		this.ow.addMatchSelectionInfoChangedListener(async (matchInfo: { gameId: number; matchId: string; sessionId: string }) => {
			this.logger.debug('[shelf-api] Match selected', matchInfo);
			this.loadGame(matchInfo.matchId);
		});
		const matchInfo = await this.ow.getSelectedMatch();
		this.logger.debug('[shelf-api] Retrieved match', matchInfo);
		if (matchInfo.matchId) {
			this.loadGame(matchInfo.matchId);
		}
	}

	private async loadGame(matchId: string): Promise<void> {
		// If we have no match ID, it means the GS itself doesn't have it, so
		// we're dealing with an old session
		if (!matchId) {
			this.store.publishEvent(new GlobalErrorEvent('old-session'));
			return;
		}
		this.logger.debug('[shelf-api] Loading match with id', matchId);
		const game: Game = await this.gameDb.getGame(matchId);
		this.logger.debug('[shelf-api] Loaded game', game);
		// If we don't have a game, it means that the GS recorded the game, but for
		// some reason there was a bug and we didn't save the game in our DB
		if (!game) {
			this.store.publishEvent(new GlobalErrorEvent('old-session'));
			console.warn('incorrect event, dev stuff');
			// this.store.publishEvent(new GlobalErrorEvent('no-match-found'));
			return;
		}
		this.store.publishEvent(new GameSelectedEvent(game));
	}
}
