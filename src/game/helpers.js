import { BAD_SHIP_TYPE } from "../entitiies/badShip";
import { SHIP_TYPE } from "../entitiies/goodShip";

export const isBadShipBullet = (bullet) => bullet.ownerType === BAD_SHIP_TYPE;

export const isGoodShipBullet = (bullet) => bullet.ownerType === SHIP_TYPE;
