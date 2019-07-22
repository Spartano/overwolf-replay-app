import { ShelfStoreEvent } from '../shelf-store-event';

export class PopulateStoreEvent implements ShelfStoreEvent {

	public static eventName(): string {
		return 'PopulateStoreEvent';
	}

	public eventName(): string {
		return 'PopulateStoreEvent';
	}
}
