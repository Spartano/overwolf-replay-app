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
var HeroAvatarComponent = (function () {
    function HeroAvatarComponent() {
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], HeroAvatarComponent.prototype, "hero", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], HeroAvatarComponent.prototype, "won", void 0);
    HeroAvatarComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'hero-avatar',
            styleUrls: ['hero-avatar.css'],
            template: "\n\t\t<div class=\"hero-avatar\">\n\t\t\t<img class=\"win-img\" src=\"app/component/game-thumbnail/images/victory.png\" *ngIf=\"won\">\n\t\t\t<div class=\"avatar\">\n\t\t\t\t<img class=\"portrait\" src=\"https://s3.amazonaws.com/com.zerotoheroes/plugins/hearthstone/cardart/256x/{{hero}}.jpg\">\n\t\t\t\t<img class=\"frame\" src=\"app/component/game-thumbnail/images/hero_frame.png\">\n\t\t\t</div>\n\t\t</div>\n\t"
        }), 
        __metadata('design:paramtypes', [])
    ], HeroAvatarComponent);
    return HeroAvatarComponent;
}());
exports.HeroAvatarComponent = HeroAvatarComponent;
//# sourceMappingURL=hero-avatar.component.js.map