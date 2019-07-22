import { Processor } from '../processor';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { GameSelectedEvent } from '../events/game-selected-event';

export class GameSelectedProcessor implements Processor {

	public async process(event: GameSelectedEvent, currentState: ShelfState): Promise<ShelfState> {
		return Object.assign(new ShelfState(), currentState, {
			currentGame: event.game,
		} as ShelfState);
	}
}
