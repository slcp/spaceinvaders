import BadShip from "../badShip";
import GoodShip from "../goodShip";

export const isBadShipBullet = bullet => bullet.owner instanceof BadShip;

export const isGoodShipBullet = bullet => bullet.owner instanceof GoodShip;
