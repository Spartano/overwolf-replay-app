import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";

import { Game } from '../models/game';

declare var overwolf: any;
declare var AWS: any;

@Injectable()
export class PublicEventsService {

	public static readonly REPLAY_UPLOADED = 'publicevents-replay-uploaded';

	private listeners: string[] = [];

	constructor(private http: Http) {
		let port = 4765;

		overwolf.web.createServer(port, serverInfo => {
		    if (serverInfo.status == "error") {
		        console.log("Failed to create server");
		        return;
		    } 
		    else {
		        let server = serverInfo.server;
		        server.onRequest.addListener((info) => this.onRequest(info));

		        server.listen(info => {
		            console.log("Server listening status on port ", port, info);
		        });
		    }
		});
	}

	public broadcast(event: string, object: any) {
		// console.log('broadcasting', event, object, this.listeners);
		let eventToBroadcast = JSON.stringify({
			event: event,
			object: object
		});
		let headers = new Headers({ 'Content-Type': 'text/plain' });
    	let options = new RequestOptions({ headers: headers });
		this.listeners.forEach((listener) => {
			this.http
					.post(listener, eventToBroadcast, options)
					.map((res) => res.json())
					.subscribe((success) => console.log('success', success), (error) => console.log('error', error));
		});
	}

	private onRequest(info) {
	    console.log('request: ', info);
	    if (info && info.content) {
	    	try {
	    		let request = JSON.parse(info.content);
	    		this.handleRequest(request);
	    	}
	    	catch (e) {
	    		console.warn('invalid request', info.content);
	    	}
	    }
	    // info = { "content": "{'hello': 'world'}", "contentType": "application/json", "url": "http://localhost:59873/"}
	}

	private handleRequest(request) {
		if (request.requestType == 'register') {
			this.handleRegister(request);
		}
	}

	private handleRegister(request) {
		if (!request.callbackUrl) {
			console.log('Cant register without a callback URL', request);
			return;
		}
		if (this.listeners.indexOf(request.callbackUrl) != -1) {
			console.log('Listener already registered', request.callbackUrl, this.listeners);
			return;
		}
		console.log('Registering listener', request.callbackUrl);
		this.listeners.push(request.callbackUrl);
	}
}
