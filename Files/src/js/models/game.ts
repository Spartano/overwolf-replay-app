export class Game {
	id: string;
	replay: string;
	spectating: boolean;
	gameMode: string;
	gameFormat: string;
	rank: string;
	title: string;
	result: string;
	player: Player = new Player();
	opponent: Player = new Player();
	reviewId: string;

	private _url: string;

	static createEmptyGame(): Game {
		let game = new Game();
		game.id = '' + Date.now();
		return game;
	}
}

export class Player {
	name: string;
	class: string;
	hero: string;
}
