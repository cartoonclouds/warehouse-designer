import { EventAggregator } from "aurelia";
import { fabric } from "fabric";
import { observable } from '@aurelia/runtime';
import { IObjectOptions } from "fabric/fabric-impl";
import { Shelf } from ".";
import { IHardware, WarehouseFloor } from "../components";
import { HardwareEvent, Drawable } from "./hardware";
import { HardwareSelected, HardwareDeselected } from "../messages/messages";
import { DOMUtility } from "../utils/dom";
import { Shelves } from "./shelf";


export type IRack = Rack & fabric.IGroupOptions;
export type IShadowRack = ShadowRack & fabric.IRectOptions;


export class Rack extends fabric.Group implements IHardware {
  public static readonly type: string = "Rack";
  public type = Rack.type;

  public notes: string;
  public code: string;
  public shelves: Shelves;
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
    hasBorders: false,
    selectable: true,
    evented: true,
    perPixelTargetFind: true,
  };


  protected rack: fabric.Rect;

  @observable public label: string;
  protected fabricLabel: fabric.Text;
  public get defaultLabel() {
    return `Rack-${WarehouseFloor.racks.length + 1}`;
  }


  constructor(rackDetails: Partial<IRack>) {
    super([], {
      type: Rack.type
    });

    this.rack = new fabric.Rect(Object.assign({}, rackDetails, Rack.DEFAULT_RACK_PROPS));

    this.label = rackDetails.label || this.defaultLabel;
    this.notes = rackDetails.notes;
    this.code = rackDetails.code;

    this.addWithUpdate(this.fabricLabel);
    this.addWithUpdate(this.rack);

    this.setOptions(Object.assign({}, Rack.DEFAULT_GROUP_PROPS, {
      left: rackDetails.left,
      top: rackDetails.top,
    }));

    this.attachEvents();
  }


  protected attachEvents() {
    this.rack.on("mouseup", (e: fabric.IEvent<MouseEvent>) => {
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

    this.rack.on("mouseover", (e: fabric.IEvent<MouseEvent>) => {
      this.setRackOptions({
        strokeWidth: 2,
        strokeDashArray: [10, 10]
      });


      this.events.push(new HardwareEvent({
        domEvent: "mouseover"
      }));
    });

    this.rack.on("mouseout", (e: fabric.IEvent<MouseEvent>) => {
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

      WarehouseFloor.eventAggregator.publish(new HardwareSelected(this));


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

      WarehouseFloor.eventAggregator.publish(new HardwareDeselected(this));


      this.events.push(new HardwareEvent({
        domEvent: "deselected"
      }));
    });

    this.on("moving", (e: fabric.IEvent<MouseEvent>) => {
      const mousePosition = e.pointer;

      if (this.isIntersecting) {
        WarehouseFloor.setMoveCursor(DOMUtility.Cursors.NOT_ALLOWED);
      } else {
        WarehouseFloor.setMoveCursor(DOMUtility.Cursors.MOVE);
      }

      WarehouseFloor.setCursor(this.moveCursor);

      this.left = this.constrainX(this.snapX(mousePosition.x - (this.width / 2)));
      this.top = this.constrainY(this.snapY(mousePosition.y - (this.height / 2)));
      this.setCoords();



      WarehouseFloor.renderAll(this.rack);



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

    for (let hardware of WarehouseFloor.getAllHardwareExcept(this)) {
      if (hardware.intersectsWithObject(this)) {
        intersectigHardware = hardware;
        break;
      }
    }

    return intersectigHardware;
  }

  public setRackOptions(options: IObjectOptions): void {
    this.rack.setOptions(options);

    // see "When to call setCoords" github page
    this.rack.setCoords();
    this.rack.set('dirty', true);
    WarehouseFloor.renderAll(this.rack);
  }

  public addShelf(shelfDetails: Partial<Shelf> = {}) {
    if (!this.shelves) {
      this.shelves = new Shelves(this);

      this.addWithUpdate(this.shelves);
    }


    this.shelves.addShelf(shelfDetails);

    // this.setCoords();
    // this.setObjectsCoords();

    // this.shelves.setCoords();
    // this.shelves.setObjectsCoords();

    WarehouseFloor.renderAll();
  }

  public _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);

    this.bringToFront();
  }


  public labelChanged(label) {
    if (!this.fabricLabel) {
      this.fabricLabel = new fabric.Text(this.label, {
        left: this.left,
        fontFamily: 'Helvetica',
        strokeWidth: 0,
        stroke: '#333',
        fontSize: 14,
        selectable: false,
        evented: false,
        hasControls: false,
      });

      this.fabricLabel.top = this.top - this.fabricLabel.calcTextHeight() - 4;
    }

    this.fabricLabel.text = this.label;

    WarehouseFloor.renderAll(this.fabricLabel);
  }


  public snapX(xPoint) {
    return Math.round(xPoint / 40) * 40;
  }

  public snapY(yPoint) {
    return Math.round(yPoint / 40) * 40;
  }

  public constrainX(leftPoint) {
    let constrainedX = Math.max(0, leftPoint);

    constrainedX = Math.min(constrainedX, WarehouseFloor.width - 80)

    return constrainedX;
  }

  public constrainY(topPoint) {
    let constrainedY = Math.max(0, topPoint);

    constrainedY = Math.min(constrainedY, WarehouseFloor.height - 160);

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

    this.rack.off("mouseup");
  }


  public draw(options: fabric.IEvent<MouseEvent>) {
    const mousePosition = options.pointer;

    this.left = this.constrainX(this.snapX(mousePosition.x - (this.width / 2)));
    this.top = this.constrainY(this.snapY(mousePosition.y - (this.height / 2)));
    this.setCoords();


    this.bringToFront();

    // Cannot create rack on top on another
    if (this.isIntersecting) {
      WarehouseFloor.setCursor(DOMUtility.Cursors.NOT_ALLOWED);
    } else {
      WarehouseFloor.setCursor(DOMUtility.Cursors.DEFAULT);
    }

  }

}
