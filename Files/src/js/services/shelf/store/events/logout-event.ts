import { ShelfStoreEvent } from '../shelf-store-event';

export class LogoutEvent implements ShelfStoreEvent {

	constructor() { }

	public static eventName(): string {
		return 'LogoutEvent';
	}

	public eventName(): string {
		return 'LogoutEvent';
	}
}
