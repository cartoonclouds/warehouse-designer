
import { Hardware } from "../components/hardware/hardware";
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
  public data: any;

  constructor(mode: DrawMode, data?: any) {
    this.mode = mode;
    this.data = data;
  }
}

export class DeleteRack {
  public rack: Rack;

  constructor(rack: Rack) {
    this.rack = rack;
  }
}


export class HardwareSelected {
  public hardware: Hardware;

  constructor(hardware: Hardware) {
    this.hardware = hardware;
  }
}

export class HardwareDeselected {
  public hardware?: Hardware;

  constructor(hardware?: Hardware) {
    this.hardware = hardware;
  }
}