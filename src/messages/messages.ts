
import { Rack } from "../components/p5-elements/rack/rack";
import { Dimensions, Point } from "../hardware-types";

export enum DrawMode {
  SELECTION = "selection",
  ADD_RACK = "add-rack",
  ADD_SHELF = "add-shelf",
  DELETE_HARDWARE = "delete-hardware",

  REDO = "redo",
  UNDO = "undo"
}

export class UpdateDrawMode {
  public mode: DrawMode;

  constructor(mode: DrawMode) {
    this.mode = mode;
  }
}

export class CreateRack {
  public rackDetails: Partial<Rack>;

  constructor(rackDetails?: Partial<Rack>) {
    this.rackDetails = rackDetails;
  }

}


export class DeleteRack {
  public rack: Rack;

  constructor(rack: Rack) {
    this.rack = rack;
  }
}


export class HardWareSelected {
  public rack: Rack;

  constructor(rack: Rack) {
    this.rack = rack;
  }
}

export class HardWareDeselected {
  public rack: Rack;

  constructor(rack: Rack) {
    this.rack = rack;
  }
}