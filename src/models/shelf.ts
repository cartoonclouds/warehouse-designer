import { Hardware } from ".";
import { Dimensions } from "../hardware-types";

export class Shelf extends Hardware {
  public dimensions: Dimensions;

  protected p5Structure;

  constructor(shelfDetails?: Partial<Shelf>) {
    super();

    if (shelfDetails) {
      shelfDetails = Object.assign(new Shelf(), shelfDetails);

      const { dimensions } = shelfDetails;

      this.dimensions = dimensions;
    }
  }

  public draw(p5: p5) {

  }
}