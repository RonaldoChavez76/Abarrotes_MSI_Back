"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GamesController {
    index(req, resp) {
        resp.send('Games');
    }
}
const gamesController = new GamesController();
exports.default = gamesController;
