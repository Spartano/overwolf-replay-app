import { ShelfStoreEvent } from './shelf-store-event';
import { ShelfState } from '../../../models/shelf/shelf-state';

export abstract class Processor {
	abstract async process(event: ShelfStoreEvent, state: ShelfState): Promise<ShelfState>;
}
