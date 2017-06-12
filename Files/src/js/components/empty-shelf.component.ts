import { Component } from '@angular/core';


@Component({
	selector: 'empty-shelf',
	styleUrls: [`css/component/empty-shelf.component.css`],
	template: ` 
		<div>
			<img src="static/images/clockwork.png" alt="">

			<h1>No Replay</h1>
			<p>We found no match to replay in this session.<br>
		If you did play a match, check our <a href="http://support.overwolf.com/article-categories/zerotoheroes/" target="_blank">support page</a></p> 
		</div>
	`,
})

export class EmptyShelfComponent {

}
