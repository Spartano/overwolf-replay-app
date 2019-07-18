import { Injectable, EventEmitter } from '@angular/core';
import { Game } from '../../models/game';
import { OverwolfService } from '../overwolf.service';
import { BehaviorSubject } from 'rxjs';
import { GameRetrieveService } from '../game-retrieve.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class ShelfApiService {

    // public currentGame: EventEmitter<Game> = new EventEmitter<Game>();
    public currentGame = new BehaviorSubject<Game>(null);

    constructor(private ow: OverwolfService, private gameService: GameRetrieveService, private logger: NGXLogger) { 
        this.init();
    }

    private async init() {
        // TODO: plug the GS listener here instead
        console.log('[shelf-api] Getting extension info');
        const callbackInfo = await this.ow.getExtensionInfo('nafihghfcpikebhfhdhljejkcifgbdahdhngepfb');
        const info = callbackInfo.info;
        this.loadGameFromSession((info && info.sessionId) || null);
    }

    private async loadGameFromSession(sessionId: string) {
        this.logger.debug('Loading games from session', sessionId);
        const games = await this.gameService.getGames(sessionId);
        if (games) {
            this.currentGame.next(games.reverse()[0]);
        } else {
            this.logger.warn('Could not find any game in session', sessionId);
        }
	}

}
