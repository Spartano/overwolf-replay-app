import { Component, Input } from '@angular/core';
import { Game } from '../../models/game';
import { NGXLogger } from 'ngx-logger';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { GameHelper } from '../../services/gameparsing/game-helper.service';

@Component({
	selector: 'game-replay',
	styleUrls: [
        `../../../css/component/shelf/manastorm-themes.scss`,
        `../../../css/component/shelf/manastorm-fonts.scss`,
        `../../../css/global.scss`,
        `../../../css/component/shelf/game-replay.component.scss`
    ],
	template: `
		<div class="manastorm-player">
            <div id="externalPlayer" class="external-player">
                Waiting waiting
            </div>
		</div>
	`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameReplayComponent {
    
    private initDone: boolean = false;

    constructor(private logger: NGXLogger, private gameHelper: GameHelper) {}

	@Input('game') set game(value: Game) {
        this.logger.debug('[game-replay] setting game', value);
        if (value) {
            const replay = this.gameHelper.getXmlReplay(value);
            this.reload(replay, value.reviewId);
        }
    }
    
    async ngOnInit() {
        this.logger.debug('initializing coliseum');
        const coliseum = (window as any).coliseum;
        await coliseum.init();
        this.logger.debug('coliseum init done');
        this.initDone = true;
    }

	async reload(replay: string, reviewId: string) {
        this.logger.debug('requested replay load');
        await this.waitForViewerInit();
        this.logger.debug('loading replay');
        const coliseum = (window as any).coliseum;
        coliseum.zone.run(() => {
            coliseum.component.loadReplay(replay, {
				reviewId: reviewId
			});
        })
	}
    
    private waitForViewerInit(): Promise<void> {
		return new Promise<void>((resolve) => {
			const viewerWait = () => {
				if (this.initDone) {
					resolve();
				} 
				else {
					setTimeout(() => viewerWait(), 50);
				}
			}
			viewerWait();
		});
	}
}