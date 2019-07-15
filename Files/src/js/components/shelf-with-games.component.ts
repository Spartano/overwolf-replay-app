import { Component, ViewChild, Input } from '@angular/core';

import { GameReplayComponent } from '../components/game-replay.component';
import { CarouselComponent } from '../components/carousel.component';

import { Game } from '../models/game';

import { Events } from '../services/events.service';
import { GameHelper } from '../services/gameparsing/game-helper.service';
import { AccountService } from '../services/account.service';
import { OverwolfService } from '../services/overwolf.service';

@Component({
	selector: 'shelf-with-games',
	styleUrls: [
		`../../css/global/component-global.scss`,
		`../../css/component/shelf-with-games.component.scss`,
	],
	template: `
		<div class="shelf-with-games">
			<div class="main-zone">
				<div class="header">
					<info-zone [game]="selectedGame" *ngIf="selectedGame"></info-zone>
					<button *ngIf="!accountClaimed" class="btn btn-connect" (click)="showLogin()">
						Connect
						<div class="zth-tooltip bottom">
							<p>Connect to your Zero to Heroes account now to store all your games online and post your games for advice!</p>
							<svg class="tooltip-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 4">
								<polygon points="12,0 6,-4 0,0 "/>
							</svg>
						</div>
					</button>
					<button *ngIf="accountClaimed" class="btn btn-connect" (click)="disconnect()">
						Disconnect
					</button>
				</div>
				<game-replay [game]="selectedGame"></game-replay>
			</div>
			<carousel [games]="_games" (onGameSelected)=onGameSelected($event)></carousel>
			<upload-social class="upload-social" [game]="selectedGame"></upload-social>
		</div>
	`,
})
export class ShelfWithGamesComponent {
	_games: Game[] = null;

	@ViewChild(CarouselComponent) private carouselComponent: CarouselComponent;
	@ViewChild(GameReplayComponent) private gameReplayComponent: GameReplayComponent;

	selectedGame: Game;
	accountClaimed = true;

	private shelfLoaded: boolean;

	constructor(
            private gameHelper: GameHelper,
            private accountService: AccountService,
            private ow: OverwolfService,
            private events: Events) {
		this.shelfLoaded = false;
	}

	ngOnInit(): void {
		this.accountService.accountClaimStatusSubject.subscribe((value) => {
			this.accountClaimed = value;
			console.log('accountClaimedStatus', value);
		});
	}

	@Input() set games(value: Game[]) {
		this._games = value;
		// if (this._games && this._games.length > 0) {
			this.carouselComponent.onSelect(this._games[0]);
		// }
	}

	onGameSelected(game: Game) {
		console.log('reloading game', game);
		this.selectedGame = game;
		this.gameReplayComponent.reload(this.gameHelper.getXmlReplay(game), () => {
			console.log('game reloaded');

			if (!this.shelfLoaded) {
				this.loadShelf();
			}
		});
	}

	async loadShelf() {
        await this.ow.setShelfStatusReady();
        this.shelfLoaded = true;
	}

	showLogin() {
		this.events.broadcast(Events.SHOW_LOGIN);
	}

	disconnect() {
		this.accountService.disconnect();
	}
}
