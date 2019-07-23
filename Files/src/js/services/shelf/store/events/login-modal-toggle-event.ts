import { ShelfStoreEvent } from '../shelf-store-event';

export class LoginModalToggleEvent implements ShelfStoreEvent {

	constructor(public value: boolean) { }

	public static eventName(): string {
		return 'LoginModalToggleEvent';
	}

	public eventName(): string {
		return 'LoginModalToggleEvent';
	}
}
