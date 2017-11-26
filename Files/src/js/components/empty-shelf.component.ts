import { Component } from '@angular/core';


@Component({
	selector: 'empty-shelf',
	styleUrls: [
		`../../css/global/fonts.scss`,
		`../../css/component/empty-shelf.component.scss`
	],
	template: `
		<div>
			<img src="../assets/images/clockwork.png" alt="">

			<h1>No Replay</h1>
			<p>We found no match to replay in this session.<br>
		If you did play a match, check our <a href="http://support.overwolf.com/knowledge-base/manastorm-troubleshooting/" target="_blank">support page</a></p>
		</div>
	`,
})

export class EmptyShelfComponent {

}
