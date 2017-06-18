export class Game {
	id: string;
	reviewId: string;
	title: string;

	fullLogs: string;
	replay: string;

	spectating: boolean;

	gameMode: string;
	gameFormat: string;
	rank: string;
	matchInfo: any;
	result: string;

	player: Player = new Player();
	opponent: Player = new Player();

	private _url: string;

	static createEmptyGame(): Game {
		let game = new Game();
		game.id = '' + Date.now();
		return game;
	}

	public extractMatchInfoData() {
		if (this.matchInfo != null && this.matchInfo.LocalPlayer != null) {
			if ('Wild' === this.gameFormat) {
				if (this.matchInfo.LocalPlayer.WildLegendRank > 0) {
					this.rank = 'legend';
				}
				else {
					this.rank = this.matchInfo.LocalPlayer.WildRank;
				}
			}
			else if ('Standard' === this.gameFormat) {
				if (this.matchInfo.LocalPlayer.StandardLegendRank > 0) {
					this.rank = 'legend';
				}
				else {
					this.rank = this.matchInfo.LocalPlayer.StandardRank;
				}
			}
		}
	}
}

export class Player {
	name: string;
	class: string;
	hero: string;
}
