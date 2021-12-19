import { Shelf } from "../..";
import { Dimensions } from "../../../hardware-types";
import { Maths } from "../../../utils/math";

export class Rack {
  public name: string;
  public code: string;
  public dimensions: Dimensions;
  public shelves: Shelf[] = [];
  public edges = [];

  protected p5Structure = {
    x: Maths.random(1, 1200),
    y: Maths.random(1, 550),
    width: 80,
    height: 80
  };

  constructor(rackDetails?: Partial<Rack>) {

    if (rackDetails) {
      rackDetails = Object.assign(new Rack(), rackDetails);

      const { name, code, dimensions } = rackDetails;

      this.name = name;
      this.code = code;
      this.dimensions = dimensions;
    }

  }

  public draw(p5: p5) {
    p5.push();

    p5.ellipse(this.p5Structure.x, this.p5Structure.y, this.p5Structure.width, this.p5Structure.height);

    p5.pop();
  }
}