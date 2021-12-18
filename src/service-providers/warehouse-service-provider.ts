import { observable } from "@aurelia/runtime";
import { inject } from "aurelia";
import { Rack } from "../models";

@inject()
export class WarehouseServiceProvider {
  @observable racks: Rack[] = [];

  public drawFloor(p5) {
    this.racks.forEach((rack: Rack) => {
      console.log('looping to draw');
      rack.draw(p5);
    })
  }

  public newRack(rackDetails?: Partial<Rack>) {
    console.log('adding new rack');
    const newRack = new Rack(rackDetails);
    this.racks.push(newRack);
  }
}