import { ShelfState } from '../../../../models/shelf/shelf-state';
import { PopulateStoreEvent } from '../events/populate-store-event';
import { Processor } from '../processor';

export class PopulateStoreProcessor implements Processor {
	public async process(event: PopulateStoreEvent, currentState: ShelfState): Promise<ShelfState> {
		return currentState;
	}
}
