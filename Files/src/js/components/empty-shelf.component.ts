import { Component } from '@angular/core';


@Component({
	selector: 'empty-shelf',
	styleUrls: [`css/component/empty-shelf.component.css`],
	template: ` 
		<div>
			<img src="static/images/clockwork.png" alt="">

			<h1>No Replay</h1>
			<p>We found no match to replay in this session.<br>If you did play a match, please <a href="#">contact us</a></p>
		</div>
	`,
})

export class EmptyShelfComponent {

}
