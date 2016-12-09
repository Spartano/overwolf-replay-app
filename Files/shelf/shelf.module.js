"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
// import { LocalStorageService } from '../angular-2-local-storage/angular-2-local-storage'; 
var angular_2_local_storage_1 = require('angular-2-local-storage');
var shelf_component_1 = require('../app/component/shelf/shelf.component');
var game_replay_component_1 = require('../app/component/game-replay/game-replay.component');
var carousel_component_1 = require('../app/component/carousel/carousel.component');
var game_thumbnail_component_1 = require('../app/component/game-thumbnail/game-thumbnail.component');
var hero_avatar_component_1 = require('../app/component/game-thumbnail/hero-avatar.component');
// import { GameService } from './game.service';
var game_retrieve_service_1 = require('../app/service/game-retrieve.service');
var log_listener_service_1 = require('../app/service/log-listener.service');
var game_parser_service_1 = require('../app/service/game-parser.service');
// Create config options (see ILocalStorageServiceConfigOptions) for deets:
var localStorageServiceConfig = {
    prefix: 'replay-viewer',
    storageType: 'localStorage'
};
var ShelfModule = (function () {
    function ShelfModule() {
    }
    ShelfModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule
            ],
            declarations: [
                shelf_component_1.ShelfComponent,
                game_replay_component_1.GameReplayComponent,
                carousel_component_1.CarouselComponent,
                game_thumbnail_component_1.GameThumbnailComponent,
                hero_avatar_component_1.HeroAvatarComponent
            ],
            bootstrap: [
                shelf_component_1.ShelfComponent
            ],
            providers: [
                game_retrieve_service_1.GameRetrieveService,
                log_listener_service_1.LogListenerService,
                game_parser_service_1.GameParserService,
                angular_2_local_storage_1.LocalStorageService,
                {
                    provide: angular_2_local_storage_1.LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
                }
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], ShelfModule);
    return ShelfModule;
}());
exports.ShelfModule = ShelfModule;
//# sourceMappingURL=shelf.module.js.map