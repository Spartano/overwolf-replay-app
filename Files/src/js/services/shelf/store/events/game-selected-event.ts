import { ShelfStoreEvent } from '../shelf-store-event';
import { Game } from '../../../../models/game';

export class GameSelectedEvent implements ShelfStoreEvent {

	constructor(public game: Game) { }

	public static eventName(): string {
		return 'GameSelectedEvent';
	}

	public eventName(): string {
		return 'GameSelectedEvent';
	}
}
