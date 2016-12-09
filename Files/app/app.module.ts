import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

// import { ShelfComponent }  from './component/shelf/shelf.component';
import { AppComponent }  from './component/app/app.component';
import { GameReplayComponent } from './component/game-replay/game-replay.component';
import { CarouselComponent } from './component/carousel/carousel.component';
import { GameThumbnailComponent } from './component/game-thumbnail/game-thumbnail.component';
import { HeroAvatarComponent } from './component/game-thumbnail/hero-avatar.component';

// import { GameService } from './game.service';
import { GameStorageService } from './service/game-storage.service';
// import { GameRetrieveService } from './service/game-retrieve.service';
import { LogListenerService } from './service/log-listener.service';
import { GameParserService } from './service/game-parser.service';

let localStorageServiceConfig = {
    prefix: 'replay-viewer',
    storageType: 'localStorage'
};

@NgModule({
	imports:      [ 
		BrowserModule,
    	HttpModule
	],
	declarations: [ 
		AppComponent,
		// ShelfComponent,
		GameReplayComponent,
		CarouselComponent,
		GameThumbnailComponent,
		HeroAvatarComponent
	],
	bootstrap: [ 
		AppComponent
	],
	providers: [
		GameStorageService,
		// GameService,
		LogListenerService,
		GameParserService,
        LocalStorageService,
        {
            provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
	]
})

export class AppModule { }
