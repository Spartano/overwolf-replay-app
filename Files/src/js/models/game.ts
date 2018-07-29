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
	// fullLogs: string;
	public replay: string;
	path: string;
	replayBytes: any[];

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

				if (this.matchInfo.OpposingPlayer.WildLegendRank > 0) {
					this.opponentRank = 'legend';
				}
				else {
					this.opponentRank = this.matchInfo.OpposingPlayer.WildRank;
				}
			}
			else if ('Standard' === this.gameFormat) {
				if (this.matchInfo.LocalPlayer.StandardLegendRank > 0) {
					this.rank = 'legend';
				}
				else {
					this.rank = this.matchInfo.LocalPlayer.StandardRank;
				}

				if (this.matchInfo.OpposingPlayer.StandardLegendRank > 0) {
					this.opponentRank = 'legend';
				}
				else {
					this.opponentRank = this.matchInfo.OpposingPlayer.StandardRank;
				}
			}
		}
	}

	// private setXmlReplay(xml: string) {
	// 	var compressed = LZString.compress(xml);
	// 	console.log("Compressed from " + xml.length + " to " + compressed.length);
	// 	this.replay = compressed;
	// }

	// private getXmlReplay(): string {
	// 	return LZString.decompress(this.replay);
	// }

	// We need this, otherwise functions don't exist if we simply parse json
	// public static deserialize(gameStr: string): Game {
	// 	let other = JSON.parse(gameStr);
	// 	let copy = new Game();
	// 	copy.id = other.id;
	// 	copy.reviewId = other.reviewId;
	// 	copy.title = other.title;
	// 	copy.spectating = other.spectating;
	// 	copy.gameMode = other.gameMode;
	// 	copy.gameFormat = other.gameFormat;
	// 	copy.rank = other.rank;
	// 	copy.result = other.result;
	// 	copy.matchInfo = other.matchInfo;
	// 	copy.arenaInfo = other.arenaInfo;
	// 	copy.durationTimeSeconds = other.durationTimeSeconds;
	// 	copy.durationTurns = other.durationTurns;
	// 	copy.ended = other.ended;
	// 	copy.player = other.player;
	// 	copy.opponent = other.opponent;
	// 	copy.deckstring = other.deckstring;
	// 	copy.fullLogs = other.fullLogs;
	// 	copy.replay = other.replay;
	// 	copy.path = other.path;
	// 	copy.replayBytes = other.replayBytes;
	// 	other = null;
	// 	return copy;
	// }
}

export class Player {
	name: string;
	class: string;
	hero: string;
}

