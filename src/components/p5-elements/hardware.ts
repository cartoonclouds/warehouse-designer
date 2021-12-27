import { Point } from "../../hardware-types";
import { DrawMode } from "../../messages/messages";

export interface IInteractable {
  onMouseClicked(p5: p5, drawingMode: DrawMode): void;
  onMouseOver(p5: p5, drawingMode: DrawMode): void;
}
export abstract class Hardware {
  public abstract name: string;
  protected abstract selected: boolean;

  public abstract draw(p5: p5, drawingMode: DrawMode): void;
  public abstract intersects(otherHardware: Hardware): boolean;
  public abstract contains(p: Point);

  public get modelName() {
    return this.constructor.name.trim().toLowerCase();
  }

  public static get className() {
    return this.name.trim().toLowerCase();
  }

  // ellipsis
  // let d = dist(this.x, this.y, otherHardware.x, otherHardware.y);
  // return d < this.r + otherHardware.r;
}