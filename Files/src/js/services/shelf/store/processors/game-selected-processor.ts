import { LoginModalInfo } from '../../../../models/shelf/login-modal-info';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { GameSelectedEvent } from '../events/game-selected-event';
import { Processor } from '../processor';

export class GameSelectedProcessor implements Processor {
	public async process(event: GameSelectedEvent, currentState: ShelfState): Promise<ShelfState> {
		const loginModalInfo = Object.assign(new LoginModalInfo(), currentState.loginModalInfo, {
			toggled: false,
		} as LoginModalInfo);
		return Object.assign(new ShelfState(), currentState, {
			currentGame: event.game,
			globalError: undefined,
			loginModalInfo: loginModalInfo,
		} as ShelfState);
	}
}
