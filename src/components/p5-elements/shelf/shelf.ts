
import { Dimensions, isRack, isShelf, Point, Rectangle } from "../../../hardware-types";
import MathUtility from "../../../utils/maths";
import { Hardware } from "../hardware";
import { RectangleUtility } from "../../../utils/shapes";
import GeographyUtility from "../../../utils/geography";
import { DrawMode } from '../../../messages/messages';

export class Shelf extends Hardware {
  public name: string;
  public code: string;
  public dimensions: Dimensions;
  public point: Point;

  protected selected: boolean = false;

  constructor(shelfDetails?: Partial<Shelf>) {
    super();

    //@TODO get default sizing
    this.dimensions = {
      width: 80,
      height: 80
    };

    this.point = {
      x: MathUtility.random(1, 1200),
      y: MathUtility.random(1, 550),
    };

    if (shelfDetails) {
      shelfDetails = Object.assign(new Shelf(), shelfDetails);

      const { name, code, dimensions, point } = shelfDetails;

      this.name = name;
      this.code = code;
      this.dimensions = dimensions;
      this.point = point;
    }
  }

  private get p5Structure() {
    return Object.assign({}, this.point, this.dimensions);
  };


  public draw(p5: p5, drawingMode: DrawMode) {
    p5.push();

    p5.pop();
  }

  public intersects(hardware): boolean {
    if (isRack(hardware) || isShelf(hardware)) {
      return GeographyUtility.rectangleIntersectsRectangle(this.asRectangle, hardware.asRectangle);
    } else {
      new Error(`No typescript user-defined guard is${hardware.modelName}`);
    }
  }

  public contains(p: Point) {
    return GeographyUtility.contains(this.polygonPoints, p);
  }

  /**
   * Returns the four points as an object of type Rectangle.
   */
  public get asRectangle(): Rectangle {
    return RectangleUtility.asRectangle(this.point, this.dimensions);
  }

  /**
   * Returns the four points of a rack running counter-clockwise.
   */
  public get polygonPoints(): Point[] {
    return RectangleUtility.getPolygonPoints(this.point, this.dimensions);
  }

}