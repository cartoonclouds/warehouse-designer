
import { Dimensions, Point, Rectangle } from '../../../hardware-types';
import { RectangleUtility } from "../../../utils/shapes";
import { DrawMode } from '../../../messages/messages';

// extends Hardware
export class Shelf {
  public name: string;
  public code: string;
  public dimensions: Dimensions;
  public point: Point;

  protected selected: boolean = false;

  constructor() {
    // super();
    /*
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
          shelfDetails = Object.assign(new Shelf(p5), shelfDetails);
    (
          const { name, code, dimensions, point } = shelfDetails;
    
          this.name = name;
          this.code = code;
          this.dimensions = dimensions;
          this.point = point;
        }
    
        this.p5 = p5;*/
  }
  /*
    private get p5Structure() {
      return Object.assign({}, this.point, this.dimensions);
    };
  */

  public draw(drawingMode: DrawMode) {
    // this.p5.push();

    // this.p5.pop();
  }

  public intersects(hardware): boolean {
    return false;
    // if (isRack(hardware) || isShelf(hardware)) {
    //   return GeographyUtility.rectangleIntersectsRectangle(this.asRectangle, hardware.asRectangle);
    // } else {
    //   new Error(`No typescript user-defined guard is${hardware.modelName}`);
    // }
  }

  public contains(p: Point) {
    // return GeographyUtility.contains(this.polygonPoints, p);
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