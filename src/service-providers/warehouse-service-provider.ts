
import { Rack } from "../components";

export class WarehouseServiceProvider {
  private static racks: Rack[] = [];

  public drawFloor(p5) {
    WarehouseServiceProvider.racks.forEach((rack: Rack) => {
      rack.draw(p5);
    })
  }

  public static addRack(rackDetails?: Partial<Rack>) {
    const addRack = new Rack(rackDetails);
    WarehouseServiceProvider.racks.push(addRack);
  }
}