import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Game } from '../models/game';

declare var $: any;

@Component({
	selector: 'carousel',
	styleUrls: [`css/component/carousel.component.css`],
	template: `
		<nav>
			<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
				<symbol id="carousel-nav-icon" viewBox="0 0 50 20">
					<polyline points="18 12 25 8 32 12" stroke-linecap="round" stroke-miterlimit="10" />
				</symbol>
			</svg>

			<i class="carousel-nav carousel-nav-top" [class.carousel-nav-disabled]="!showTopArrow" (click)="showPrevious()">
				<svg class="svg-icon-stroke">
					<use xlink:href="#carousel-nav-icon" />
				</svg>
			</i>

			<ul class="carousel" *ngIf="games">
				<li *ngFor="let game of games | slice:startIndex:endIndex" (click)="onSelect(game)" [style.transform]="'translateY(-' + translateAmount + '%)'">
					<game-thumbnail [game]="game" [selected]="game === selectedGame" [class.carousel-item-selected]="game === selectedGame"></game-thumbnail>
				</li>
			</ul>

			<i class="carousel-nav carousel-nav-bottom" [class.carousel-nav-disabled]="!showBottomArrow" (click)="showNext()">
				<svg class="svg-icon-stroke">
					<use xlink:href="#carousel-nav-icon" />
				</svg>
			</i>
		</nav>
	`,
})

export class CarouselComponent {
	@Input() games: Game[];
	@Output() onGameSelected = new EventEmitter<Game>();

	selectedGame: Game;
	showTopArrow: boolean;
	showBottomArrow: boolean;
	numberOfDisplayedGames: number;
	firstDisplayedGameIndex: number;
	translateAmount: number;
	bouncing: boolean;

	// displayedGames: number;
	// startIndex: number;
	// endIndex: number;

	ngOnInit(): void {
		// this.displayedGames = 4;
		// this.startIndex = 0;
		// this.endIndex = this.startIndex + this.displayedGames;
	}

	newGame(game: Game): void {
		// if (!this.selectedGame) {
		// this.onSelect(game);
		// }
		this.recomputeVisibleElements(50);
	}

	onSelect(game: Game): void {
		// console.log('loading game', game);
		this.recomputeVisibleElements(50);
		this.selectedGame = game;
		this.onGameSelected.emit(game);
	}

	// showPrevious(): void {
	// 	if (this.startIndex === 0) return;
	// 	if (this.startIndex - this.displayedGames < 0) return;
	// 	this.startIndex = this.startIndex - this.displayedGames;
	// 	this.endIndex = this.startIndex + this.displayedGames;
	// }

	// showNext(): void {
	// 	if (this.startIndex + this.displayedGames >= this.games.length) return;

	// 	this.startIndex = this.startIndex + this.displayedGames;
	// 	this.endIndex = Math.min(this.games.length, this.startIndex + this.displayedGames);
	// }



	showPrevious(): void {
		// console.log('showPrevious?', this.showTopArrow, (this.firstDisplayedGameIndex - this.numberOfDisplayedGames) * 100);
		if (this.showTopArrow) {
			this.translateAmount = (this.firstDisplayedGameIndex - this.numberOfDisplayedGames) * 100;
			this.recomputeVisibleElements(700);
		}
	}

	showNext(): void {
		if (this.showBottomArrow) {
			this.translateAmount = (this.firstDisplayedGameIndex + this.numberOfDisplayedGames) * 100;
			this.recomputeVisibleElements(700);
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.recomputeVisibleElements(50);
	}

	isElementInViewport (el: any): boolean {
		let rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
			rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
		);
	}

	recomputeVisibleElements(delay:number): void {
		if (!this.bouncing) {
			this.bouncing = true;
			setTimeout(() =>  {
				console.log('recomputing visible elements');
				this.showTopArrow = false;
				this.showBottomArrow = false;
				this.numberOfDisplayedGames = 0;
				this.firstDisplayedGameIndex = -1;

				let thumbnailElements = $('.carousel li');
				console.log('thumbnailElements', thumbnailElements);
				if (!thumbnailElements || thumbnailElements.length === 0) {
					return;
				}

				let index = 0;
				for (let el of thumbnailElements) {
					// console.log('element', el, $(el));
					// Hide elements that are outside of the visible viewport
					$(el).css('opacity', '1');
					console.log('considering', el, this.isElementInViewport(el), el.getBoundingClientRect());
					if (this.isElementInViewport(el)) {
						this.numberOfDisplayedGames++;
						if (this.firstDisplayedGameIndex === -1) {
							this.firstDisplayedGameIndex = index;
						}
					}
					else {
						$(el).css('opacity', '0');
					}
					index++;
					console.log('increased index', index);
				}
				this.showTopArrow = this.firstDisplayedGameIndex > 0;
				this.showBottomArrow = (this.firstDisplayedGameIndex + this.numberOfDisplayedGames) < thumbnailElements.length - 1;
				console.log('showing arrows', this.showTopArrow, this.showBottomArrow);

				console.log('number of displayed games', this.numberOfDisplayedGames, this.firstDisplayedGameIndex);
				this.bouncing = false;
			}, delay );
		}
	}
}
