import { Rack, Shelf } from "../components";
import { HardwareType } from '../components/hardware/hardware';
import { FabricUtility } from "./fabricjs";

export default class ShelfUtility {

  public static isIntersecting(canvas: fabric.Canvas, shelf: Shelf, type?: HardwareType): any {
    // type = type || HardwareType.SHELF;

    switch (type) {
      case HardwareType.RACK:
        return canvas.getObjects('Rack')
          .find((r: Rack) => {
            return FabricUtility.rectIntersectsRect(shelf as fabric.Rect, r);
          });

      case HardwareType.SHELF:
        return canvas.getObjects('Shelf')
          .find((s: Shelf) => {
            return FabricUtility.rectIntersectsRect(shelf as fabric.Rect, s as fabric.Rect);
          });

      default:
        console.error(`Unknown hardware type ${type}`);
    }

    return false;
  }


  // && !this.isTargetTransparent(_obj, mousePosition.x, mousePosition.y);

  // return rack.isContainedWithinObject(this)
  //   || rack.intersectsWithObject(this)
  //   || this.isContainedWithinObject(rack);
  // }

}