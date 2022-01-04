import { Rack } from "../components";
import { HardwareType } from "../components/hardware/hardware";
import { FabricUtility } from "./fabricjs";

export default class RackUtility {


  public static isIntersecting(canvas: fabric.Canvas, rack: Rack, type?: HardwareType): any {
    // type = type || HardwareType.SHELF;

    switch (type) {
      case HardwareType.RACK:
        return canvas.getObjects('Rack')
          .find((r: Rack) => {
            return FabricUtility.rectIntersectsRect(rack, r);
          });

      case HardwareType.SHELF:
        return canvas.getObjects('Shelf')
          .find((s: Rack) => {
            return FabricUtility.rectIntersectsRect(rack as fabric.Rect, s as fabric.Rect);
          });

      default:
        console.error(`Unknown hardware type ${type}`);
    }

    return false;
  }


}