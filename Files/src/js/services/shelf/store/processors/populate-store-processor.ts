import { Processor } from '../processor';
import { PopulateStoreEvent } from '../events/populate-store-event';
import { ShelfState } from '../../../../models/shelf/shelf-state';

export class PopulateStoreProcessor implements Processor {

	constructor() { }

	public async process(event: PopulateStoreEvent, currentState: ShelfState): Promise<ShelfState> {
		return currentState;
	}
}
