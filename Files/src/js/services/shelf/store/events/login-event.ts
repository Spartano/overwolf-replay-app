import { ShelfStoreEvent } from '../shelf-store-event';

export class LoginEvent implements ShelfStoreEvent {
	constructor(public value: { loginId: string; password: string }) {}

	public static eventName(): string {
		return 'LoginEvent';
	}

	public eventName(): string {
		return 'LoginEvent';
	}
}
