import { Component, Input, ViewEncapsulation, ElementRef, HostListener } from '@angular/core';
import { Game } from '../models/game';

// https://murhafsousli.github.io/ng2-sharebuttons/
@Component({
	selector: 'game-replay',
	styleUrls: [`../../css/component/game-replay.component.scss`],
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="hearthstone" id="container" [class.hidden]="!game">
            <div id="externalPlayer" class="external-player">
                Waiting waiting
            </div>
		</div>
	`,
})
export class GameReplayComponent {
	@Input() game: Game;
    
    private initDone: boolean = false;

    constructor(private elementRef: ElementRef) {}
    
    async ngOnInit() {
        console.log('initializing coliseum');
        const coliseum = (window as any).coliseum;
        await coliseum.init();
        console.log('coliseum init done');
        this.initDone = true;
    }

	async reload(replay: string) {
        await this.waitForViewerInit();
        console.log('loading replay', replay);
        const coliseum = (window as any).coliseum;
        coliseum.zone.run(() => {
            coliseum.component.loadReplay(replay);
        })
	}
    
    private waitForViewerInit(): Promise<void> {
		return new Promise<void>((resolve) => {
			const viewerWait = () => {
				// console.log('Promise waiting for db');
				if (this.initDone) {
					// console.log('wait for db init complete');
					resolve();
				} 
				else {
					// console.log('waiting for db init');
					setTimeout(() => viewerWait(), 50);
				}
			}
			viewerWait();
		});
	}
}
