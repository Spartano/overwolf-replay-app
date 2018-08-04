import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Events } from '../services/events.service';

@Component({
	selector: 'global-error',
	styleUrls: [
		`../../css/global/_vars.scss`,
		`../../css/global/fonts.scss`,
		`../../css/global/forms.scss`,
		`../../css/global/modal-inner.scss`,
		`../../css/global/modal-window.scss`,
		`../../css/global/tooltip.scss`,
		`../../css/global/component-global.scss`,
		`../../css/component/global-error.component.scss`,
	],
	template: `
		<div class="global-error-container">
			<div class="modal modal-welcome active">
				<div class="modal-window modal-window-error">

					<section class="error">
						<h1>An error occured</h1>
						{{error}}
					</section>

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

export class GlobalErrorComponent {

	@Output() close = new EventEmitter();
	@Input() error: string;

	constructor(private events: Events) {

	}

	closeWindow() {
		this.close.emit(null);
	}

}
