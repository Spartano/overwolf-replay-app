import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, Input, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Game } from '../../models/game';
import { GameHelper } from '../../services/gameparsing/game-helper.service';

@Component({
	selector: 'game-replay',
	styleUrls: [
		`../../../css/component/shelf/manastorm-themes.scss`,
		`../../../css/component/shelf/manastorm-fonts.scss`,
		`../../../css/global.scss`,
		`../../../css/component/shelf/game-replay.component.scss`,
	],
	template: `
		<div>
			<div id="externalPlayer" class="external-player"></div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameReplayComponent implements OnInit {
	private initDone = false;

	constructor(private logger: NGXLogger, private gameHelper: GameHelper) {}

	@Input('game') set game(value: Game) {
		if (value) {
			this.logger.debug('[game-replay] setting game', value.id);
			const replay = value.uncompressedXmlReplay;
			this.reload(replay, value.reviewId);
		} else {
			this.resetGame();
		}
	}

	async ngOnInit() {
		// this.logger.debug('initializing coliseum');
		const coliseum = (window as any).coliseum;
		await coliseum.init();
		coliseum.zone.run(() => coliseum.component.reset());
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
				reviewId: reviewId,
			});
		});
	}

	async resetGame() {
		// Resetting the game
		await this.waitForViewerInit();
		this.logger.debug('[game-replay] resetting player');
		const coliseum = (window as any).coliseum;
		coliseum.zone.run(() => coliseum.component.reset());
	}

	private waitForViewerInit(): Promise<void> {
		return new Promise<void>(resolve => {
			const viewerWait = () => {
				if (this.initDone) {
					resolve();
				} else {
					setTimeout(() => viewerWait(), 50);
				}
			};
			viewerWait();
		});
	}
}
