import { Rack } from "../components";

export default class RackUtility {

  public static isIntersecting(canvas, rack: Rack): boolean {
    return canvas.getObjects('Rack')
      .filter((r: Rack) => rack !== r)
      .some((r: Rack) => {
        return RackUtility.intersectsRect(rack, r);
      });
  }

  public static intersectsRect(rack1: Rack, rack2: Rack) {
    const rackCoords = rack1.getCoords(true, true);

    return rack2.containsPoint(rackCoords[0].scalarSubtract(1))
      || rack2.containsPoint(rackCoords[1].scalarSubtract(1))
      || rack2.containsPoint(rackCoords[2].scalarSubtract(1))
      || rack2.containsPoint(rackCoords[3].scalarSubtract(1));

    // && !this.isTargetTransparent(_obj, mousePosition.x, mousePosition.y);

    // return rack.isContainedWithinObject(this)
    //   || rack.intersectsWithObject(this)
    //   || this.isContainedWithinObject(rack);
  }

}