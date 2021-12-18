import { Hardware, Shelf } from ".";
import { Dimensions } from "../hardware-types";

export class Rack extends Hardware {
  public name: string;
  public code: string;
  public dimensions: Dimensions;
  public shelves: Shelf[] = [];

  protected p5Structure = {
    x: 10 * Math.random(),
    y: 100 * Math.random(),
    width: 60 * Math.random(),
    height: 40 * Math.random()
  };

  // levels
  constructor(rackDetails?: Partial<Rack>) {
    super();

    if (rackDetails) {
      rackDetails = Object.assign(new Rack(), rackDetails);

      const { name, code, dimensions } = rackDetails;

      this.name = name;
      this.code = code;
      this.dimensions = dimensions;
    }

  }

  public draw(p5: p5) {
    console.log('drawing new rack');
    p5.background(255, 0, 0);
    p5.ellipse(this.p5Structure.x, this.p5Structure.y, this.p5Structure.width, this.p5Structure.height);
  }
}