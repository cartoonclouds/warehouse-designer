import { IObjectOptions } from "fabric/fabric-impl";
import { IRack, IShadowRack } from "./rack";
import { IShelf } from "./shelf";

export class HardwareEvent {
  dateTime: Date;
  domEvent: string;
  message: string;

  constructor(params) {
    this.dateTime = new Date();
    this.domEvent = params.domEvent;
    this.message = params.message;
  }
};

export enum HardwareType {
  RACK,
  SHELF
};

export interface Drawable {
  draw(options: fabric.IEvent<MouseEvent>);
};

export type Hardware = IRack | IShelf;
export type ShadowHardware = IShadowRack;

export interface IHardware {
  modelName: string;
  isIntersecting: fabric.Object;
  setOptions(options: IObjectOptions): void;
  _render(ctx: CanvasRenderingContext2D): void;
  initialize(options?: fabric.IObjectOptions): any;
  toObject(): any;


  // ellipsis
  // let d = dist(this.x, this.y, otherHardware.x, otherHardware.y);
  // return d < this.r + otherHardware.r;
};