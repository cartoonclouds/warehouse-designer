import { IObjectOptions } from "fabric/fabric-impl";
import { IRack } from "./rack/rack";

export class HardwareEvent {
  dateTime: Date;
  domEvent: string;
  message: string;

  constructor(params) {
    this.dateTime = new Date();
    this.domEvent = params.domEvent;
    this.message = params.message;
  }
}

export type Hardware = IRack;

export interface IHardware {
  modelName: string;
  isIntersecting: boolean;
  setOptions(options: IObjectOptions): void;
  _render(ctx: CanvasRenderingContext2D): void;
  initialize(options?: fabric.IObjectOptions): any;
  toObject(): any;


  // ellipsis
  // let d = dist(this.x, this.y, otherHardware.x, otherHardware.y);
  // return d < this.r + otherHardware.r;
}