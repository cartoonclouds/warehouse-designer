
import { Dimensions } from "../../../hardware-types";

export class Shelf {
  public dimensions: Dimensions;

  protected p5Structure;

  constructor(shelfDetails?: Partial<Shelf>) {

    if (shelfDetails) {
      shelfDetails = Object.assign(new Shelf(), shelfDetails);

      const { dimensions } = shelfDetails;

      this.dimensions = dimensions;
    }
  }

  public draw(p5: p5) {
    p5.push();

    p5.pop();
  }
}