import { ShelfStoreEvent } from '../shelf-store-event';

export class CreateAccountEvent implements ShelfStoreEvent {

	constructor(public value: { username: string, password: string, email: string }) { }

	public static eventName(): string {
		return 'CreateAccountEvent';
	}

	public eventName(): string {
		return 'CreateAccountEvent';
	}
}
