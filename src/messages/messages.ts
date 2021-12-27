import { Shelf } from "../components";
import { IRack, Rack } from "../components/p5-elements/rack/rack";
import { Dimensions, Point } from "../hardware-types";

export enum DrawMode {
  SELECTION = "selection",
  ADD_RACK = "add-rack",
  ADD_SHELF = "add-shelf",
  DELETE_HARDWARE = "delete-hardware"
}

export class UpdateDrawMode {
  public mode: DrawMode;
  
  constructor(mode: DrawMode) {
    this.mode = mode;
  }
}

export class CreateRack {
  public rackDetails: Partial<Rack>;
  
  constructor(rackDetails?: Partial<IRack>) {
    this.rackDetails = rackDetails;
  }

}