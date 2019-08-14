import { ShelfState } from '../../../../models/shelf/shelf-state';
import { GlobalErrorEvent } from '../events/global-error-event';
import { Processor } from '../processor';

export class GlobalEventProcessor implements Processor {
	public async process(event: GlobalErrorEvent, currentState: ShelfState): Promise<ShelfState> {
		return Object.assign(new ShelfState(), currentState, {
			globalError: event.error,
		} as ShelfState);
	}
}
