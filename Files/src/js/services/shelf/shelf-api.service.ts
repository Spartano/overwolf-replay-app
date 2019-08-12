import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../../models/game';
import { GameDbService } from '../game-db.service';
import { OverwolfService } from '../overwolf.service';

@Injectable()
export class ShelfApiService {
	public currentGame = new BehaviorSubject<Game>(null);

	constructor(private ow: OverwolfService, private gameDb: GameDbService, private logger: NGXLogger) {
		this.init();
	}

	private async init(): Promise<void> {
		// setTimeout(() => this.init(), 50);
		this.ow.addMatchSelectionInfoChangedListener((matchInfo: { gameId: number; matchId: string; sessionId: string }) => {
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
		this.logger.debug('[shelf-api] Loading match with id', matchId);
		const game: Game = await this.gameDb.getGame(matchId);
		this.logger.debug('[shelf-api] Loaded game', game);
		this.currentGame.next(game);
	}

	// private async init() {
	// 	// TODO: plug the GS listener here instead
	// 	this.logger.debug('[shelf-api] Getting extension info');
	// 	const anyGame: Game = await this.gameDb.getOneGame();
	// 	this.currentGame.next(anyGame);
	// }
}
