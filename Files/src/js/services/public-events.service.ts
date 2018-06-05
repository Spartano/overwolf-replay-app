import { Injectable, NgZone } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from "@angular/http";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

declare var overwolf: any;


@Injectable()
export class PublicEventsService {

	public static readonly REPLAY_UPLOADED = 'publicevents-replay-uploaded';

	private readonly port = 35410;
	private listeners: string[] = [];

	constructor(private http: Http) {
		overwolf.web.createServer(this.port, serverInfo => {
			if (serverInfo.status == "error") {
		        console.log("Failed to create server");
		        return;
		    }
		    else {
		        let server = serverInfo.server;
		        let handler = server.onRequest.addListener((info) => {
		        	this.onRequest(info);
		        });

		        server.listen(info => {
		            console.log("Server listening status on port ", this.port, info);
		            //info = { "status": "success", "url": "http://localhost:61234/"}
		        });
		    }
		});
	}

	public broadcast(evt: string, object: any) {
		console.log('broadcasting public event', evt, object);
		let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers});
        let body = { event: evt, object: object };
		for (let listener in this.listeners) {
			console.log('notifying listener', listener);
			this.http
				.post(listener, body, options)
				.map(res => { console.log(res) });
		}
	}

	private onRequest(info) {
		console.log('received request', info);
		try {
			let content = JSON.parse(info.content);
			let requestType = content.requestType;
			if (requestType == 'register') {
				this.addListener(content.listenerUrl);
			}
			this.broadcast('test', {});
		}
		catch (e) {
			console.info('received invalid request', info, e);
		}
	}

	private addListener(url: string) {
		if (this.listeners.indexOf(url) == -1) {
			this.listeners.push(url);
			console.log('added listener', url);
		}
	}

}
