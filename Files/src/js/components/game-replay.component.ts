import { Component, Input, ViewEncapsulation, ElementRef, HostListener } from '@angular/core';
import { Game } from '../models/game';

declare var manastorm: any;

@Component({
	selector: 'game-replay',
	styleUrls: [`css/component/game-replay.component.css`],
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="hearthstone" id="container" [class.hidden]="!game" [style.width]="width + 'px'">
			<div class="manastorm main-container">
				<div class="external-player-container">
					<div id="dummy"></div>
					<div id="externalPlayer" class="external-player">
						Waiting waiting
					</div>
				</div>
			</div>
		</div>
	`,
})
export class GameReplayComponent {
	@Input() game: Game;

	width: number;
	// 80%
	aspectRatio: number = 0.85;

	constructor(private elementRef: ElementRef) {}

	ngOnInit(): void {
		// console.log('Initializing manastorm');
		let manastormOptions = {
			// hideButtomLog: true,
			hideSideLog: true,
			showGameBorder: true,
			useCompressedImages: true,
			noGolden: true,
		};
		manastorm.initPlayer(manastormOptions);
	}

	reload(replay: string, callback: Function): void {
		manastorm.reload(replay, () => {
			setTimeout(() =>  {
				// console.log('player height is ', this.elementRef.nativeElement.clientHeight, this.elementRef);
				this.width = this.elementRef.nativeElement.clientHeight * this.aspectRatio;
				callback();
			});
		});
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		setTimeout(() =>  {
			// console.log('player height is ', this.elementRef.nativeElement.clientHeight, this.elementRef);
			this.width = this.elementRef.nativeElement.clientHeight * this.aspectRatio;
		});
	}
}
