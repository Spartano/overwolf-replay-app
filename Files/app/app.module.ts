import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './component/app/app.component';
import { GameReplayComponent } from './component/game-replay/game-replay.component';
import { CarouselComponent } from './component/carousel/carousel.component';
import { GameThumbnailComponent } from './component/game-thumbnail/game-thumbnail.component';
import { HeroAvatarComponent } from './component/game-thumbnail/hero-avatar.component';

// import { GameService } from './game.service';
import { GameService } from './service/game.service';
import { LogListenerService } from './service/log-listener.service';
import { GameParserService } from './service/game-parser.service';

@NgModule({
	imports:      [ 
		BrowserModule,
    	HttpModule
	],
	declarations: [ 
		AppComponent,
		GameReplayComponent,
		CarouselComponent,
		GameThumbnailComponent,
		HeroAvatarComponent
	],
	bootstrap: [ 
		AppComponent		
	],
	providers: [
		GameService,
		LogListenerService,
		GameParserService
	]
})

export class AppModule { }
