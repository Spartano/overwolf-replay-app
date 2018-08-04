import { Component, Output, EventEmitter } from '@angular/core';

import { Events } from '../services/events.service';

@Component({
	selector: 'first-time',
	styleUrls: [
		`../../css/global/_vars.scss`,
		`../../css/global/fonts.scss`,
		`../../css/global/forms.scss`,
		`../../css/global/modal-inner.scss`,
		`../../css/global/modal-window.scss`,
		`../../css/global/tooltip.scss`,
		`../../css/global/component-global.scss`,
		`../../css/component/first-time.component.scss`,
	],
	template: `
		<div class="first-time-container">
			<div class="modal modal-welcome active">
				<div class="modal-window modal-window-welcome">
					<i class="cloud-icon">
						<i class="cloud-sun">
							<svg class="cloud-sun-bg">
								<use xlink:href="/Files/assets/svg/sprite.svg#cloud-sun-bg" />
							</svg>

							<svg>
								<use xlink:href="/Files/assets/svg/sprite.svg#cloud-sun" />
							</svg>
						</i>

						<svg>
							<use xlink:href="/Files/assets/svg/sprite.svg#cloud" />
						</svg>
					</i>

					<h1>Share Your Replays!</h1>
					<p>Your matches will be uploaded to Zero to Heroes website for you to share at any moment. Connect your account to see all your replays at one place. <a class="text-link" href="http://support.overwolf.com/knowledge-base/manastorm-how-does-it-work/" target="_blank">Learn more</a></p>

					<footer>
						<button class="btn" (click)="showLogin()">Continue</button>
					</footer>

					<button class="window-control window-control-close" (click)="closeWindow()">
						<svg class="svg-icon-fill">
							<use xlink:href="/Files/assets/svg/sprite.svg#window-control_close" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	`,
})

export class FirstTimeComponent {

	@Output() close = new EventEmitter();

	constructor(private events: Events) {

	}

	showLogin() {
		this.events.broadcast(Events.SHOW_LOGIN);
		this.closeWindow();
	}

	closeWindow() {
		this.close.emit(null);
	}

}
