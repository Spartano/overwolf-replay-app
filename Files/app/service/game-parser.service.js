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
var game_1 = require('../model/game');
var GameParserService = (function () {
    function GameParserService() {
    }
    // Not externalized, as this will be done inline later on
    GameParserService.prototype.convertLogsToXml = function (stringLogs, game, callbacks) {
        // console.log('converting')
        var data = new FormData();
        data.append('data', stringLogs);
        var _this = this;
        $.ajax({
            url: 'http://www.zerotoheroes.com/api/hearthstone/converter/replay',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            // dataType: 'xml',
            success: function (response) {
                // console.debug('received conversion response')
                game.replay = response;
                _this.extractMatchup(game);
                // console.log('converted', response
                // console.debug('extracted matchup into', game)
                for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                    var callback = callbacks_1[_i];
                    callback(game);
                }
            }
        });
    };
    GameParserService.prototype.extractMatchup = function (game) {
        var replayXml = $.parseXML(game.replay);
        // console.log('replayXML', replayXml);
        // console.debug('parsing replay', replayXml)
        var mainPlayerId = this.getMainPlayerId(replayXml);
        // console.log('main player ID', mainPlayerId);
        // console.debug('players', players)
        var gamePlayers = this.extractPlayers(replayXml, mainPlayerId);
        game.player = gamePlayers[0];
        game.opponent = gamePlayers[1];
        game.title = game.player.name + ' vs ' + game.opponent.name;
        game.result = this.extractResult(replayXml, mainPlayerId);
        console.log('parsed game', game);
    };
    GameParserService.prototype.extractPlayers = function (replayXml, mainPlayerId) {
        var gamePlayers = [];
        var players = replayXml.getElementsByTagName('Player');
        for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
            var player = players_1[_i];
            var gamePlayer = new game_1.Player();
            gamePlayer.name = player.getAttribute('name');
            gamePlayer.hero = this.extractClassCard(replayXml, player);
            gamePlayer.class = this.extractClassFromHero(gamePlayer.hero);
            // console.log('is main player', gamePlayer.name, mainPlayerId, parseInt(player.getAttribute('playerID')), gamePlayer)
            if (parseInt(player.getAttribute('playerID')) == mainPlayerId) {
                gamePlayers[0] = gamePlayer;
            }
            else {
                gamePlayers[1] = gamePlayer;
            }
        }
        return gamePlayers;
    };
    GameParserService.prototype.getMainPlayerId = function (replayXml) {
        var showEntities = replayXml.getElementsByTagName('ShowEntity');
        // console.log('there are ' + showEntities.length + ' ShowEntity elements')
        var fullEntities = replayXml.getElementsByTagName('FullEntity');
        // console.log('there are ' + fullEntities.length + ' FullEntity elements')
        for (var _i = 0, showEntities_1 = showEntities; _i < showEntities_1.length; _i++) {
            var entity = showEntities_1[_i];
            // console.log('going over', entity, parseInt(entity.getAttribute('entity')));
            if (entity.getAttribute('cardID')) {
                for (var _a = 0, fullEntities_1 = fullEntities; _a < fullEntities_1.length; _a++) {
                    var fullEntity = fullEntities_1[_a];
                    // console.log('\ttrying to match with', parseInt(fullEntity.getAttribute('id')));
                    if (parseInt(fullEntity.getAttribute('id')) == parseInt(entity.getAttribute('entity'))) {
                        // console.log('\t\tmatch')
                        // CARDTYPE is 202
                        var cardType = this.getTagValue(fullEntity, 202);
                        // console.log('\t\tcardType', cardType)
                        // ENCHANTMENT
                        if (cardType != 6) {
                            // CONTROLLER
                            var controllerId = this.getTagValue(fullEntity, 50);
                            // console.log('foundit', controllerId);
                            return controllerId;
                        }
                    }
                }
            }
        }
        // console.log('still hidden')
        return null;
    };
    GameParserService.prototype.getTagValue = function (fullEntity, type) {
        var tags = fullEntity.getElementsByTagName('Tag');
        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var tag = tags_1[_i];
            if (parseInt(tag.getAttribute('tag')) == type) {
                return parseInt(tag.getAttribute('value'));
            }
        }
        return null;
    };
    GameParserService.prototype.extractClassCard = function (replayXml, player) {
        // console.debug('building playerClass for ', player, replayXml)
        var playerId;
        var nodes = player.childNodes;
        // console.debug('\tchildNodes ', nodes)
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.nodeName == 'Tag' && node.getAttribute('tag') == '27') {
                playerId = node.getAttribute('value');
            }
        }
        // console.debug('playerId', playerId)
        var cardId;
        var entities = replayXml.getElementsByTagName('FullEntity');
        // console.debug('entities', entities.length, entities)
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.getAttribute('id') == playerId) {
                cardId = entity.getAttribute('cardID');
            }
        }
        return cardId;
    };
    GameParserService.prototype.extractClassFromHero = function (hero) {
        // console.debug('cardId', cardId)
        var playerClass = parseCardsText.getCard(hero).playerClass.toLowerCase();
        // console.debug('playerClass', playerClass)
        return playerClass;
    };
    GameParserService.prototype.extractResult = function (replayXml, mainPlayerId) {
        var tagChanges = replayXml.getElementsByTagName('TagChange');
        // console.log('found ' + tagChanges.length + ' tag changes');
        var winnerTag;
        for (var _i = 0, tagChanges_1 = tagChanges; _i < tagChanges_1.length; _i++) {
            var tagChange = tagChanges_1[_i];
            // if (tagChange.getAttribute('tag') == '17') {
            // 	console.log('considering', tagChange.getAttribute('tag'), tagChange.getAttribute('value'), tagChange);
            // }
            // PLAYSTATE and WON
            if (parseInt(tagChange.getAttribute('value')) == 4) {
                // console.log('\t==================found a winner', winnerTag);
                winnerTag = tagChange;
                break;
            }
        }
        var status = 'unknown';
        if (winnerTag) {
            if (mainPlayerId == parseInt(winnerTag.getAttribute('entity'))) {
                status = 'won';
            }
            else {
                status = 'lost';
            }
        }
        else {
            var tiedTag = void 0;
            for (var _a = 0, tagChanges_2 = tagChanges; _a < tagChanges_2.length; _a++) {
                var tagChange = tagChanges_2[_a];
                // PLAYSTATE and TIED
                if (parseInt(tagChange.getAttribute('value')) == 6) {
                    tiedTag = tagChange;
                    break;
                }
            }
            if (tiedTag) {
                status = 'tied';
            }
        }
        return status;
    };
    GameParserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], GameParserService);
    return GameParserService;
}());
exports.GameParserService = GameParserService;
//# sourceMappingURL=game-parser.service.js.map