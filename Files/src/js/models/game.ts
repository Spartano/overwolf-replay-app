export class Game {
	replay: string;
	title: string;
	result: string;
	player: Player = new Player();
	opponent: Player = new Player();
}

export class Player {
	name: string;
	class: string;
	hero: string;
}
