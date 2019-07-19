declare var LZString: any;

export class Game {
	id: string;
	reviewId: string;
	title: string;

	spectating: boolean;

	gameMode: string;
	gameFormat: string;
	rank: string;
	opponentRank: string;
	result: string;
	matchInfo: any;
	arenaInfo: any;
	durationTimeSeconds: number;
	durationTurns: number;
	ended: boolean;

	player: Player = new Player();
	opponent: Player = new Player();

	deckstring: string;
	public replay: string;
	path: string;
	replayBytes: any[];

	private _url: string;

	static createEmptyGame(): Game {
		const game = new Game();
		game.id = '' + Date.now();
		return game;
	}

	public extractMatchInfoData() {
		if (this.matchInfo != null && this.matchInfo.LocalPlayer != null) {
			if ('Wild' === this.gameFormat) {
				if (this.matchInfo.LocalPlayer.WildLegendRank > 0) {
					this.rank = 'legend';
				} else {
					this.rank = this.matchInfo.LocalPlayer.WildRank;
				}

				if (this.matchInfo.OpposingPlayer.WildLegendRank > 0) {
					this.opponentRank = 'legend';
				} else {
					this.opponentRank = this.matchInfo.OpposingPlayer.WildRank;
				}
			} else if ('Standard' === this.gameFormat) {
				if (this.matchInfo.LocalPlayer.StandardLegendRank > 0) {
					this.rank = 'legend';
				} else {
					this.rank = this.matchInfo.LocalPlayer.StandardRank;
				}

				if (this.matchInfo.OpposingPlayer.StandardLegendRank > 0) {
					this.opponentRank = 'legend';
				} else {
					this.opponentRank = this.matchInfo.OpposingPlayer.StandardRank;
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

