import { Point, Dimensions, Rectangle } from '../hardware-types';

export class RectangleUtility implements Rectangle {
  private point: Point;
  private dimensions: Dimensions;

  constructor(point: Point, dimensions: Dimensions) {
    this.point = point;
    this.dimensions = dimensions;
  }

  /**
   * Returns the four points as an object of type Rectangle.
   */
  public static asRectangle(point: Point, dimensions: Dimensions): Rectangle {
    return (new RectangleUtility(point, dimensions)).asRectangleType;
  }

  /**
   * Returns the four points of a rack running counter-clockwise.
   */
  public static getPolygonPoints(point: Point, dimensions: Dimensions): Point[] {
    return (new RectangleUtility(point, dimensions)).polygonPoints;
  }

  /**
   * X/Y coordinate points on the rectangle: top/left, top/right, bottom/right, bottom/left.
   * 
   */
  public get polygonPoints(): Point[] {
    return [
      { x: this.topLeft.x, y: this.topLeft.y },
      { x: this.topRight.x, y: this.topRight.y },
      { x: this.bottomRight.x, y: this.bottomRight.y },
      { x: this.bottomLeft.x, y: this.bottomLeft.y },
    ]
  }

  public get asRectangleType(): Rectangle {
    return {
      topLeft: this.topLeft,
      topRight: this.topRight,
      bottomLeft: this.bottomLeft,
      bottomRight: this.bottomRight
    }
  }

  public get topLeft(): Point {
    return {
      x: this.point.x - (this.dimensions.width / 2),
      y: this.point.y - (this.dimensions.height / 2)
    };
  }

  public get topRight(): Point {
    return {
      x: this.point.x + (this.dimensions.width / 2),
      y: this.point.y
    };
  }

  public get bottomLeft(): Point {
    return {
      x: this.point.x,
      y: this.point.y + (this.dimensions.height / 2)
    };
  }

  public get bottomRight(): Point {
    return {
      x: this.point.x + (this.dimensions.width / 2),
      y: this.point.y + (this.dimensions.height / 2)
    };
  }
}