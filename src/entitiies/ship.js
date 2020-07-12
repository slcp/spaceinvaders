import Moveable from "./moveable";
import moveObject from "../functional/moveObject";

class Ship extends Moveable {
    constructor(game, settings, eventBus) {
        super(settings);
        this.game = game;
        this.eventBus = eventBus;
        this.bullet = "";
        this.bulletInPlay = false;
        this.width = 80;
        this.height = 80;
    }

    fireBullet() {
        if (!this.bulletInPlay || this.settings.continuousFire) {
            let bullet = this.game.createBullet(this);
            // This does not exactly identify bullet exit point
            moveObject(
                {
                    object: bullet,
                    deltaX: Math.floor(...this.shapes.map((shape) => shape.x)),
                    deltaY: Math.floor(...this.shapes.map((shape) => shape.y))
                }
            );
            this.game.drawObject(bullet);
        }
    }
}

export default Ship;
