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
var CarouselComponent = (function () {
    function CarouselComponent() {
        this.onGameSelected = new core_1.EventEmitter();
    }
    CarouselComponent.prototype.ngOnInit = function () {
        this.displayedGames = 4;
        this.startIndex = 0;
        this.endIndex = this.startIndex + this.displayedGames;
    };
    CarouselComponent.prototype.newGame = function (game) {
        if (!this.selectedGame) {
            this.onSelect(game);
        }
    };
    CarouselComponent.prototype.onSelect = function (game) {
        // console.log('loading game', game);
        this.selectedGame = game;
        this.onGameSelected.emit(game);
    };
    CarouselComponent.prototype.showPrevious = function () {
        if (this.startIndex == 0)
            return;
        if (this.startIndex - this.displayedGames < 0)
            return;
        this.startIndex = this.startIndex - this.displayedGames;
        this.endIndex = this.startIndex + this.displayedGames;
    };
    CarouselComponent.prototype.showNext = function () {
        if (this.startIndex + this.displayedGames >= this.games.length)
            return;
        this.startIndex = this.startIndex + this.displayedGames;
        this.endIndex = Math.min(this.games.length, this.startIndex + this.displayedGames);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], CarouselComponent.prototype, "games", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CarouselComponent.prototype, "onGameSelected", void 0);
    CarouselComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'carousel',
            styleUrls: ["carousel.css"],
            template: "\n\t\t<div class=\"carousel\">\n\t\t\t<div [class.disabled]=\"startIndex == 0\" class=\"arrow glyphicon glyphicon-chevron-up\" (click)=\"showPrevious()\"></div>\n\t\t\t<ul class=\"games\">\n\t\t\t\t<li *ngFor=\"let game of games | slice:startIndex:endIndex\" (click)=\"onSelect(game)\">\n\t\t\t\t\t<game-thumbnail [game]=\"game\" [selected]=\"game === selectedGame\"></game-thumbnail>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t<div class=\"arrow glyphicon glyphicon-chevron-down\" [class.disabled]=\"endIndex >= games.length\" (click)=\"showNext()\"></div>\n\t\t</div>\n\t"
        }), 
        __metadata('design:paramtypes', [])
    ], CarouselComponent);
    return CarouselComponent;
}());
exports.CarouselComponent = CarouselComponent;
//# sourceMappingURL=carousel.component.js.map