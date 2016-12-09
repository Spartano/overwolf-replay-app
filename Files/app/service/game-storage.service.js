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
var angular_2_local_storage_1 = require('angular-2-local-storage');
var log_listener_service_1 = require('./log-listener.service');
var GameStorageService = (function () {
    // games: Game[] = [];
    // subject:Subject<Game> = new Subject<Game>();
    function GameStorageService(logListenerService, localStorageService) {
        this.logListenerService = logListenerService;
        this.localStorageService = localStorageService;
        console.log('in GameStorageService constructor');
        this.init();
    }
    GameStorageService.prototype.init = function () {
        var _this = this;
        console.log('init gameservice', this.localStorageService.get('games'));
        this.localStorageService.clearAll('.*');
        console.log('after init', this.localStorageService.get('games'));
        this.logListenerService.addGameCompleteListener(function (game) {
            console.log('game complete', game);
            _this.addGame(game);
            // this.games.push(game);
        });
    };
    GameStorageService.prototype.addGame = function (game) {
        // Get the games from the local storage
        var games = this.localStorageService.get('games') || [];
        games.push(game);
        this.localStorageService.set('games', games);
        console.log('after adding game', this.localStorageService.get('games'));
        // this.subject.next(game);
    };
    GameStorageService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [log_listener_service_1.LogListenerService, angular_2_local_storage_1.LocalStorageService])
    ], GameStorageService);
    return GameStorageService;
}());
exports.GameStorageService = GameStorageService;
//# sourceMappingURL=game-storage.service.js.map