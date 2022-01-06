import { EventAggregator } from "aurelia";
import { fabric } from "fabric";
import { observable } from '@aurelia/runtime';
import { IObjectOptions } from "fabric/fabric-impl";
import { Shelf } from ".";
import { HardwareEvent, Drawable, IHardware } from "./hardware";
import { HardwareSelected, HardwareDeselected } from "../messages/messages";
import { DOMUtility } from "../utils/dom";
import CanvasService from "../service-providers/canvas-service";
import { App } from "../app";

export type IRack = Rack & fabric.IGroupOptions;
export type IShadowRack = ShadowRack & fabric.IRectOptions;

const RACK_PADDING = 8;

export class Rack extends fabric.Group implements IHardware {
  public static readonly type: string = "Rack";
  public type = Rack.type;

  public canvasService: CanvasService;
  public eventAggregator: EventAggregator;

  public notes: string;
  public code: string;
  public shelves: Shelf[] = [];
  public edges = new fabric.Group();

  protected initialPosition: { top: number, left: number };
  protected static DEFAULT_RACK_PROPS = {
    top: 0,
    left: 0,
    width: 80,
    height: 160,
    // fill: 'transparent',
    fill: '#eee',
    stroke: '#000',
    strokeWidth: 1,
    hasControls: true,
    selectable: true,
    evented: true,
    perPixelTargetFind: true,
  };

  protected static DEFAULT_GROUP_PROPS = {
    type: Rack.type,
    subTargetCheck: true,
    hasControls: false,
    hasBorders: true,
    selectable: true,
    evented: true,
    perPixelTargetFind: true,
    //@TODO For testing
    borderColor: 'red',
  };


  @observable public label: string;
  protected fabricLabel: fabric.Text;
  protected fabricShelfLabel: fabric.Text;

  protected fabricRack: fabric.Rect;

  constructor(rackDetails: Partial<IRack>, services?: {
    canvasService: CanvasService,
    eventAggregator: EventAggregator
  }) {
    super([], {
      type: Rack.type
    });

    this.fabricRack = new fabric.Rect(Object.assign({}, rackDetails, Rack.DEFAULT_RACK_PROPS));
    this.addWithUpdate(this.fabricRack);

    this.label = rackDetails.label || services?.canvasService?.defaultRackLabel;
    this.notes = rackDetails.notes;
    this.code = rackDetails.code;


    this.setOptions(Object.assign({}, Rack.DEFAULT_GROUP_PROPS, {
      left: rackDetails.left,
      top: rackDetails.top,
    }));

    this.attachEvents();


    this.canvasService = services.canvasService;
    this.eventAggregator = services.eventAggregator;


    App.observer.getArrayObserver(this.shelves)
      .subscribe({
        handleCollectionChange: () => {
          this.shelvesChanged();
        }
      });
  }


  protected attachEvents() {
    this.fabricRack.on("mouseup", (e: fabric.IEvent<MouseEvent>) => {
      if (this.isIntersecting && this.initialPosition) {
        this.top = this.initialPosition.top;
        this.left = this.initialPosition.left;

        this.setCoords();
      } else {
        this.initialPosition = {
          left: this.left,
          top: this.top
        };
      }


      this.events.push(new HardwareEvent({
        domEvent: "mouseup"
      }))
    });

    this.fabricRack.on("mouseover", (e: fabric.IEvent<MouseEvent>) => {
      this.setRackOptions({
        strokeWidth: 2,
        strokeDashArray: [10, 10]
      });


      this.events.push(new HardwareEvent({
        domEvent: "mouseover"
      }));
    });

    this.fabricRack.on("mouseout", (e: fabric.IEvent<MouseEvent>) => {
      this.setRackOptions({
        strokeWidth: 1,
        strokeDashArray: undefined
      });


      this.events.push(new HardwareEvent({
        domEvent: "mouseout"
      }));
    });

    this.on("selected", (e: fabric.IEvent<MouseEvent>) => {
      this.setRackOptions({
        // fill: 'transparent',
        strokeWidth: 2,
        fill: '#adb5bd'
      });

      this.initialPosition = {
        left: this.left,
        top: this.top
      };

      this.eventAggregator.publish(new HardwareSelected(this));


      this.events.push(new HardwareEvent({
        domEvent: "selected"
      }));
    });

    this.on("deselected", (e: fabric.IEvent<MouseEvent>) => {
      this.setRackOptions({
        // fill: 'transparent',
        strokeWidth: 1,
        fill: '#eee'
      });

      this.eventAggregator.publish(new HardwareDeselected(this));


      this.events.push(new HardwareEvent({
        domEvent: "deselected"
      }));
    });

    this.on("moving", (e: fabric.IEvent<MouseEvent>) => {
      const mousePosition = e.pointer;

      if (this.isIntersecting) {
        this.canvasService.setCursorType('move', DOMUtility.Cursors.NOT_ALLOWED);
      } else {
        this.canvasService.setCursorType('move', DOMUtility.Cursors.MOVE);
      }

      this.canvasService.setCursor(this.moveCursor);

      this.left = this.constrainX(this.snapX(mousePosition.x - (this.width / 2)));
      this.top = this.constrainY(this.snapY(mousePosition.y - (this.height / 2)));
      this.setCoords();


      this.canvasService.renderAll(this.fabricRack);



      this.events.push(new HardwareEvent({
        domEvent: "moving",
        message: `left: ${this.left} / top: ${this.top}`
      }));
    });

  }


  /**
   * Determines if this hardware is intersecting with another.
   */
  public get isIntersecting(): fabric.Object {
    let intersectigHardware: fabric.Object;

    for (let hardware of this.canvasService.getAllHardwareExcept(this)) {
      if (hardware.intersectsWithObject(this)) {
        intersectigHardware = hardware;
        break;
      }
    }

    return intersectigHardware;
  }

  public setRackOptions(options: IObjectOptions): void {
    this.fabricRack.setOptions(options);

    // see "When to call setCoords" github page
    this.fabricRack.setCoords();
    this.fabricRack.set('dirty', true);

    this.canvasService.renderAll(this.fabricRack);
  }

  public addShelf(shelfDetails: Partial<Shelf> = {}) {

    this.shelves.push(new Shelf(shelfDetails, this));

    // this.setCoords();
    // this.setObjectsCoords();
    // this.forEachObject(o => o.setCoords());

    this.canvasService.renderAll([this.fabricShelfLabel, ...this.shelves]);
  }

  public _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);

    this.fabricRack.render(ctx);
    this.fabricLabel.render(ctx);
    this.fabricShelfLabel.render(ctx);

    this.bringToFront();
  }

  public shelvesChanged() {
    const shelfCountText = `${this.shelves.length}`;

    if (!this.fabricShelfLabel) {
      this.fabricShelfLabel = new fabric.Text(shelfCountText, {
        top: this.top + RACK_PADDING,
        left: this.left,
        fontFamily: 'Helvetica',
        strokeWidth: 0,
        fill: 'red',
        fontSize: 24,
        selectable: false,
        evented: false,
        hasControls: false,
      });

      this.fabricShelfLabel.left = (this.left + this.width) - this.fabricShelfLabel.width - RACK_PADDING;
      this.setCoords();

      this.addWithUpdate(this.fabricShelfLabel);
    }


    this.fabricLabel.bringToFront();
    this.fabricShelfLabel.text = shelfCountText;
    this.fabricShelfLabel.set('dirty', true);
  }

  public labelChanged() {
    if (!this.fabricLabel) {
      this.fabricLabel = new fabric.Text(this.label, {
        left: this.left + RACK_PADDING,
        fontFamily: 'Helvetica',
        strokeWidth: 0,
        stroke: '#333',
        fontSize: 14,
        selectable: false,
        evented: false,
        hasControls: false,
      });

      this.addWithUpdate(this.fabricLabel);
    }

    this.fabricLabel.top = this.oCoords.bl.y - (this.height / 2) - this.fabricLabel.calcTextHeight() - (RACK_PADDING / 2);
    this.setCoords();

    this.fabricLabel.bringToFront();
    this.fabricLabel.text = this.label;
    this.fabricLabel.set('dirty', true);
  }


  public snapX(xPoint) {
    return Math.round(xPoint / 40) * 40;
  }

  public snapY(yPoint) {
    return Math.round(yPoint / 40) * 40;
  }

  public constrainX(leftPoint) {
    let constrainedX = Math.max(0, leftPoint);

    constrainedX = Math.min(constrainedX, this.canvasService.width - 80)

    return constrainedX;
  }

  public constrainY(topPoint) {
    let constrainedY = Math.max(0, topPoint);

    constrainedY = Math.min(constrainedY, this.canvasService.height - 160);

    return constrainedY;
  }


  public initialize(options?: fabric.IObjectOptions): any {
    options || (options = {});

    super.initialize(options);

    this.label = this.label || '';
  };


  public toObject() {
    return fabric.util.object.extend(super.toObject(), {
      label: this.label,
      code: this.code
    });
  }

  public get modelName() {
    return this.constructor.name.trim();
  }

  public get centerX() {
    return this.left + (this.width / 2);
  }
  public get centerY() {
    return this.top + (this.height / 2);
  }

  @observable public events: HardwareEvent[] = [];

}

export class ShadowRack extends Rack implements Drawable {
  public static readonly type: string = "ShadowRack";
  public type = ShadowRack.type;

  constructor(rackDetails: Partial<IRack>, warehouseCanvas: fabric.Canvas, eventAggregator: EventAggregator) {
    super(Object.assign({}, rackDetails, {
      type: ShadowRack.type,
      evented: false
    }));

    this.fabricRack.off("mouseup");
  }


  public draw(options: fabric.IEvent<MouseEvent>) {
    const mousePosition = options.pointer;

    this.left = this.constrainX(this.snapX(mousePosition.x - (this.width / 2)));
    this.top = this.constrainY(this.snapY(mousePosition.y - (this.height / 2)));
    this.setCoords();


    this.bringToFront();

    // Cannot create rack on top on another
    if (this.isIntersecting) {
      this.canvasService.setCursor(DOMUtility.Cursors.NOT_ALLOWED);
    } else {
      this.canvasService.setCursor(DOMUtility.Cursors.DEFAULT);
    }

  }

}