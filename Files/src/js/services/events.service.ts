import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

interface BroadcastEvent {
	key: any;
	data: any[];
}

// https://blog.lacolaco.net/post/event-broadcasting-in-angular-2/
export class Events {

	public static readonly NO_LOG_FILE = 'no-log-file';
	public static readonly START_LOG_FILE_DETECTION = 'start-log-file-detection';
	public static readonly STREAMING_LOG_FILE = 'streaming-log-file';

	public static REPLAY_SAVED = 'replay-saved';
	public static REPLAY_CREATED = 'replay-created';

	public static SHOW_LOGIN = 'show-login';
	public static HIDE_LOGIN = 'hide-login';

	public static UPLOAD_STARTED = 'upload-started';
	public static UPLOAD_COMPLETE = 'upload-complete';

	public static START_SHARING_AFTER_UPLOAD = "start-sharing-after-upload";

	public static GLOBAL_ERROR = 'global-error';

	private _eventBus: Subject<BroadcastEvent>;

	constructor() {
        console.log('starting events service');
		this._eventBus = new Subject<BroadcastEvent>();
	}

	broadcast(key: any, ...data: any[]) {
		// console.log('broadcasting', key, data);
		this._eventBus.next({key, data});
	}

	on(key: any): Observable<BroadcastEvent> {
		return this._eventBus.asObservable()
			.filter(event => event.key === key)
			.map(event => event);
	}
}
