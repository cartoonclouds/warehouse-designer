
import { Hardware } from "../models/hardware";
import { Dimensions, Point } from "../hardware-types";

export enum DrawMode {
  SELECTION = "selection",
  ADD_RACK = "add-rack",
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

export class DeleteHardware {
  public hardware: Hardware;

  constructor(hardware: Hardware) {
    this.hardware = hardware;
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