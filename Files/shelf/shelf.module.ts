import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
// import { LocalStorageService } from '../angular-2-local-storage/angular-2-local-storage'; 
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

import { ShelfComponent }  from '../app/component/shelf/shelf.component';
import { GameReplayComponent } from '../app/component/game-replay/game-replay.component';
import { CarouselComponent } from '../app/component/carousel/carousel.component';
import { GameThumbnailComponent } from '../app/component/game-thumbnail/game-thumbnail.component';
import { HeroAvatarComponent } from '../app/component/game-thumbnail/hero-avatar.component';

// import { GameService } from './game.service';
import { GameRetrieveService } from '../app/service/game-retrieve.service';
import { LogListenerService } from '../app/service/log-listener.service';
import { GameParserService } from '../app/service/game-parser.service';

// Create config options (see ILocalStorageServiceConfigOptions) for deets:
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
		ShelfComponent,
		GameReplayComponent,
		CarouselComponent,
		GameThumbnailComponent,
		HeroAvatarComponent
	],
	bootstrap: [ 
		ShelfComponent
	],
	providers: [
		GameRetrieveService,
		LogListenerService,
		GameParserService,
        LocalStorageService,
        {
            provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
	]
})

export class ShelfModule { }
