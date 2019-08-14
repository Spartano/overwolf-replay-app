import { GlobalErrorType } from '../../../../models/shelf/global-error.type';
import { ShelfStoreEvent } from '../shelf-store-event';

export class GlobalErrorEvent implements ShelfStoreEvent {
	constructor(public error: GlobalErrorType) {}

	public static eventName(): string {
		return 'GlobalErrorEvent';
	}

	public eventName(): string {
		return 'GlobalErrorEvent';
	}
}
