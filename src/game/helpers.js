import BadShip from "../entitiies/badShip";
import GoodShip from "../entitiies/goodShip";

export const isBadShipBullet = bullet => bullet.owner instanceof BadShip;

export const isGoodShipBullet = bullet => bullet.owner instanceof GoodShip;
