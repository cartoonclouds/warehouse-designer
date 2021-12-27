import { Shelf, Hardware } from "../..";
import { Dimensions, isRack, isShelf, Point, Rectangle } from '../../../hardware-types';
import GeographyUtility from "../../../utils/geography";
import MathUtility from "../../../utils/maths";
import { RectangleUtility } from "../../../utils/shapes";
import { DrawMode, CreateRack } from '../../../messages/messages';
import p5 from "p5";
import { EventAggregator } from "aurelia";
import MouseUtility from "../../../utils/mouse-service";
import { App } from "../../../app";
import { DOMUtility } from "../../../utils/dom";
import { IInteractable } from "../hardware";

export interface IRack {
  type: string;

  name: string;
  code?: string;
  dimensions: Dimensions;
  point: Point;
  cornerRadius?: number;
  shelves?: Shelf[];
}

export class Rack extends Hardware implements IRack, IInteractable {
  public static type = "Rack";

  public type = Rack.type;
  public name: string;
  public code: string;
  public dimensions: Dimensions;
  public point: Point;
  public cornerRadius: number = 6;
  public shelves: Shelf[] = [];
  public edges = [];

  protected p5: p5;
  protected selected: boolean = false;
  protected mouseOver: boolean = false;

  constructor(rackDetails?: Partial<Rack>) {
    super();

    if (rackDetails) {
      rackDetails = Object.assign(new Rack(), rackDetails);

      const { name, code, dimensions, point } = rackDetails;

      this.name = name;
      this.code = code;
      this.dimensions = dimensions;
      this.point = point;
    }

  }


  /** EVENT HANDLING FUNCTIONS */
  /*************************** */

  public draw(p5: p5, drawingMode: DrawMode) {
    p5.push();
    p5.rectMode(p5.CENTER);


    if (this.selected) {
      p5.fill(255, 0, 0)
    } else {
      p5.noFill();
    }


    if (this.mouseOver) {
      p5.strokeWeight(3);

      p5.cursor(p5.HAND);

      console.log(`Rack > onMouseOver(${this.name})`);
    } else {
      p5.strokeWeight(1);

      p5.cursor(p5.ARROW);
    }


    p5.rect(this.p5Structure.x, this.p5Structure.y, this.p5Structure.width, this.p5Structure.height, this.cornerRadius);

    p5.pop();
    // console.log(`Rack > draw()`);
  }

  public onMouseClicked(p5: p5, drawingMode: DrawMode) {

    const cursorContains = this.contains(MouseUtility.coords(p5));

    if (cursorContains) {
      this.selected = !this.selected;


      console.log(`Rack > onMouseClicked(${this.name}) > Selected(${this.selected ? "T" : "F"})`);
    } else {
      this.selected = false;
    }


    this.draw(p5, drawingMode);
  }

  public onMouseOver(p5: p5, drawingMode: DrawMode) {

    const cursorContains = this.contains(MouseUtility.coords(p5));

    this.mouseOver = cursorContains;

    if (cursorContains) {
      console.log(`Rack > onMouseOver(${this.name}) > MouseOver(${this.mouseOver ? "T" : "F"})`);
    }

    this.draw(p5, drawingMode);
  }





  /** UTIILITY FUNCTIONS */
  /********************* */

  /**
   * Returns a new object in a form required to draw the p5 shape.
   */
  public get p5Structure() {
    return Object.assign({}, this.point, this.dimensions);
  };


  /**
   * Determins if another hardward intersects with this Rack.
   */
  public intersects(hardware: Hardware): boolean {
    if (isRack(hardware) || isShelf(hardware)) {
      return GeographyUtility.rectangleIntersectsRectangle(this.asRectangle, hardware.asRectangle);
    } else {
      new Error(`No typescript user-defined guard is${hardware.modelName} or intersection handler`);
    }
  }

  /**
   * Determines if a point is contained within this Rack.
   */
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


export class ShadowRack extends Rack {
  public static type = "ShadowRack";

  public type = ShadowRack.type;
  public name: string = "ShadowRack-";

  constructor(rackCount: number) {
    //@TODO get default sizing from settings
    super({
      name: `ShadowRack-${rackCount}`,
      dimensions: {
        width: 80,
        height: 80
      }
    });

  }

  public draw(p5: p5, drawingMode: DrawMode) {
    p5.push();
    p5.rectMode(p5.CENTER);

    const p5Structure = Object.assign({}, {
      x: p5.mouseX,
      y: p5.mouseY
    }, this.dimensions);

    p5.rect(p5Structure.x, p5Structure.y, p5Structure.width, p5Structure.height, this.cornerRadius, this.cornerRadius, this.cornerRadius, this.cornerRadius);

    p5.pop();
  }

}
