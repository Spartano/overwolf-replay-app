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
var game_1 = require('../../model/game');
var GameReplayComponent = (function () {
    function GameReplayComponent(elementRef) {
        this.elementRef = elementRef;
        // 80%
        this.aspectRatio = 0.86;
    }
    GameReplayComponent.prototype.ngOnInit = function () {
        // console.log('Initializing manastorm');
        var manastormOptions = {
            hideButtomLog: true,
            hideSideLog: true
        };
        manastorm.initPlayer(manastormOptions);
    };
    GameReplayComponent.prototype.reload = function (replay) {
        var _this = this;
        manastorm.reload(replay);
        setTimeout(function () {
            // console.log('player height is ', this.elementRef.nativeElement.clientHeight, this.elementRef);
            _this.width = _this.elementRef.nativeElement.clientHeight * _this.aspectRatio;
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', game_1.Game)
    ], GameReplayComponent.prototype, "game", void 0);
    GameReplayComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'game-replay',
            styleUrls: ["game-replay.css"],
            encapsulation: core_1.ViewEncapsulation.None,
            template: "\n\t\t<div class=\"hearthstone\" id=\"container\" [class.hidden]=\"!game\" [style.width]=\"width + 'px'\">\n\t\t\t<div class=\"manastorm main-container\">\n\t\t\t\t<div class=\"external-player-container\">\n\t\t\t\t\t<div id=\"dummy\"></div>\n\t\t\t\t\t<div id=\"externalPlayer\" class=\"external-player\">\n\t\t\t\t\t\tWaiting waiting\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t"
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], GameReplayComponent);
    return GameReplayComponent;
}());
exports.GameReplayComponent = GameReplayComponent;
//# sourceMappingURL=game-replay.component.js.map