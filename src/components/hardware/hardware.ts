import { Point } from "../../hardware-types";
import { DrawMode } from "../../messages/messages";

export abstract class Hardware {
  public get modelName() {
    return this.constructor.name.trim();
  }

  public static get className() {
    return this.name.trim();
  }

  // ellipsis
  // let d = dist(this.x, this.y, otherHardware.x, otherHardware.y);
  // return d < this.r + otherHardware.r;
}