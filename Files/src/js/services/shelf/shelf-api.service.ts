import { Injectable } from '@angular/core';
import { Game } from '../../models/game';
import { OverwolfService } from '../overwolf.service';
import { BehaviorSubject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { GameDbService } from '../game-db.service';

@Injectable()
export class ShelfApiService {

	public currentGame = new BehaviorSubject<Game>(null);

	constructor(private ow: OverwolfService, private gameDb: GameDbService, private logger: NGXLogger) {
		setTimeout(() => this.init(), 50);
	}

	private async init() {
		// TODO: plug the GS listener here instead
		this.logger.debug('[shelf-api] Getting extension info');
		const anyGame: Game = await this.gameDb.getOneGame();
		this.currentGame.next(anyGame);
	}
}
