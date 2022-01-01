
import { Rack } from "../components/hardware/rack/rack";
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


export class DeleteRack {
  public rack: Rack;

  constructor(rack: Rack) {
    this.rack = rack;
  }
}


export class HardwareSelected {
  public rack: Rack;

  constructor(rack: Rack) {
    this.rack = rack;
  }
}

export class HardwareDeselected {
  public rack?: Rack;

  constructor(rack?: Rack) {
    this.rack = rack;
  }
}