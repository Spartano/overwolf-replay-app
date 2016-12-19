import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

import { AppComponent }  from '../../components/app.component';
import { GameReplayComponent } from '../../components/game-replay.component';
import { CarouselComponent } from '../../components/carousel.component';
import { GameThumbnailComponent } from '../../components/game-thumbnail.component';
import { HeroAvatarComponent } from '../../components/hero-avatar.component';

// import { GameService } from './game.service';
import { GameStorageService } from '../../services/game-storage.service';
// import { GameRetrieveService } from './service/game-retrieve.service';
import { LogListenerService } from '../../services/log-listener.service';
import { GameParserService } from '../../services/game-parser.service';

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		LocalStorageModule.withConfig({
			prefix: 'replay-viewer',
			storageType: 'localStorage',
		}),
	],
	declarations: [
		AppComponent,
		CarouselComponent,
		GameReplayComponent,
		GameThumbnailComponent,
		HeroAvatarComponent,
	],
	bootstrap: [
		AppComponent,
	],
	providers: [
		GameStorageService,
		// GameService,
		LogListenerService,
		GameParserService,
		LocalStorageService,
		// {
		//     provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
		// }
	],
})

export class AppModule { }
