import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Game } from '../models/game';

import $ from 'jquery';

declare var ga: any;

@Component({
	selector: 'carousel',
	styleUrls: [`../../css/component/carousel.component.scss`],
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
	showTopArrow = false;
	showBottomArrow = false;
	numberOfDisplayedGames = 0;
	firstDisplayedGameIndex = 0;
	translateAmount = 0;
	bouncing: boolean;

	constructor() {
		this.computeNumberOfVisibleElements(50, () => this.recomputeVisibleElements());
	}

	onSelect(game: Game): void {
		console.log('loading game', game);
		ga('send', 'event', 'select-game', game.player.class + '-' + game.opponent.class);
		// this.recomputeVisibleElements(50);
		this.selectedGame = game;
		this.onGameSelected.emit(game);
	}

	showNext(): void {
		if (this.showBottomArrow) {
			this.firstDisplayedGameIndex = Math.min(
				this.firstDisplayedGameIndex + this.numberOfDisplayedGames,
				this.games.length - this.numberOfDisplayedGames);
			this.translateAmount = 100 * this.firstDisplayedGameIndex;
			this.recomputeVisibleElements(500);
		}
	}

	showPrevious(): void {
		if (this.showTopArrow) {
			this.firstDisplayedGameIndex = Math.max(0, this.firstDisplayedGameIndex - this.numberOfDisplayedGames);
			this.translateAmount = 100 * this.firstDisplayedGameIndex;
			this.recomputeVisibleElements(500);
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.computeNumberOfVisibleElements(200, () => this.recomputeVisibleElements());
	}

	isElementInViewport (el: any): boolean {
		let rect = el.getBoundingClientRect();
		console.log('rect', rect);

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	computeNumberOfVisibleElements(delay: number, callback): void {
		setTimeout(() =>  {
			let atBottom = this.firstDisplayedGameIndex + this.numberOfDisplayedGames == this.games.length;
			// console.log('computing number of visible elements');
			this.numberOfDisplayedGames = 0;

			let thumbnailElements = $('.carousel li');
			// console.log('thumbnailElements', thumbnailElements.length);
			if (!thumbnailElements || thumbnailElements.length === 0) {
				this.computeNumberOfVisibleElements(100, callback);
				// console.log('No thumbnail elements detected, retrying soon to compute number of visible elements');
				return;
			}

			let el = thumbnailElements[0];
			// console.log('calibrating from thumbnail', el, el.getBoundingClientRect());
			let thumbnailSize = el.getBoundingClientRect().bottom - el.getBoundingClientRect().top;
			// console.log('thumbnail height', thumbnailSize);
			let carousel = $('.carousel')[0];
			// console.log('carousel', carousel, carousel.getBoundingClientRect());
			let carouselSize = carousel.getBoundingClientRect().bottom - carousel.getBoundingClientRect().top;
			this.numberOfDisplayedGames = Math.floor(carouselSize / thumbnailSize);

			// console.log('computed displayed games', this.numberOfDisplayedGames);
			if (atBottom) {
				this.firstDisplayedGameIndex = this.games.length - this.numberOfDisplayedGames;
				this.translateAmount = 100 * this.firstDisplayedGameIndex;
			}

			callback();
		}, delay);
	}

	recomputeVisibleElements(hideDelay?: number): void {
		console.log('recomputing visible elements');

		this.showTopArrow = false;
		this.showBottomArrow = false;

		let thumbnailElements = $('.carousel li');

		let index = 0;
		for (let i = 0; i < thumbnailElements.length; i++) {
			let el = thumbnailElements[i];
			// Hide elements that are outside of the visible viewport
			if (i >= this.firstDisplayedGameIndex && i < this.firstDisplayedGameIndex + this.numberOfDisplayedGames) {
				$(el).css('opacity', '1');
				// console.log('showing game', i, this.firstDisplayedGameIndex, this.firstDisplayedGameIndex + this.numberOfDisplayedGames);
			}
			else {
				if (hideDelay) {
					setTimeout(() => {
						$(el).css('opacity', '0');
						// console.log('hiding game', i, this.firstDisplayedGameIndex, this.firstDisplayedGameIndex + this.numberOfDisplayedGames);
					}, hideDelay);
				}
				else {
					$(el).css('opacity', '0');
				}
			}
		}
		this.showTopArrow = this.firstDisplayedGameIndex > 0;
		this.showBottomArrow = (this.firstDisplayedGameIndex + this.numberOfDisplayedGames) < thumbnailElements.length;
		console.log('showing arrows', this.showTopArrow, this.showBottomArrow);
	}
}
