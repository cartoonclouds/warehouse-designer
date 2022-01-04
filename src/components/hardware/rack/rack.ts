import { EventAggregator } from "aurelia";
import { fabric } from "fabric";
import { HardwareDeselected, HardwareSelected } from '../../../messages/messages';
import { DOMUtility } from '../../../utils/dom';
import { observable } from '@aurelia/runtime';
import { IObjectOptions } from "fabric/fabric-impl";
import { HardwareEvent, IHardware } from "../hardware";
import RackUtility from "../../../utils/rack-utility";


export type IRack = Rack | fabric.IRectOptions;


@observable({ name: 'label', callback: 'observableUpdated' })
@observable({ name: 'code', callback: 'observableUpdated' })
@observable({ name: 'left', callback: 'observableUpdated' })
@observable({ name: 'top', callback: 'observableUpdated' })
export class Rack extends fabric.Rect implements IHardware {
  public static readonly type: string = "Rack";
  public type = Rack.type;

  public notes: string;
  public code: string;
  public shelves: [] = [];
  public edges = [];

  protected initialPosition: { top: number, left: number };
  protected static DEFAULT_PROPS = {
    type: Rack.type,
    width: 80,
    height: 160,
    fill: '#eee',
    stroke: '#000',
    strokeWidth: 2,
    lockRotation: true,
    hasControls: false,
    perPixelTargetFind: true
  };


  //@TODO Autoinject
  protected eventAggregator: EventAggregator;
  protected warehouseCanvas: fabric.Canvas;

  public label: string;
  protected fabricLabel: fabric.Text;
  public get defaultLabel() {
    return `Rack-${this.warehouseCanvas.getObjects('Rack').length + 1}`;
  }


  constructor(rackDetails: Partial<IRack>, warehouseCanvas: fabric.Canvas, eventAggregator: EventAggregator) {
    super(Object.assign(Rack.DEFAULT_PROPS, rackDetails));

    this.warehouseCanvas = warehouseCanvas;
    this.eventAggregator = eventAggregator;

    this.label = this.defaultLabel;
    this.notes = this.notes;
    this.code = this.code;

    this.attachEvents();
  }


  protected attachEvents() {
    this.on("mouseup", (e: fabric.IEvent<MouseEvent>) => {
      if (this.isIntersecting && this.initialPosition) {
        this.top = this.initialPosition.top;
        this.left = this.initialPosition.left;
      }
      this.setCoords();

      this.render(this.warehouseCanvas.getContext());


      this.events.push(new HardwareEvent({
        domEvent: "mouseup"
      }))
    });

    this.on("mouseover", (e: fabric.IEvent<MouseEvent>) => {
      this.setMouseOverStyles();

      this.render(this.warehouseCanvas.getContext());


      this.events.push(new HardwareEvent({
        domEvent: "mouseover"
      }));
    });

    this.on("mouseout", (e: fabric.IEvent<MouseEvent>) => {
      this.setMouseOutStyles();

      this.render(this.warehouseCanvas.getContext());


      this.events.push(new HardwareEvent({
        domEvent: "mouseout"
      }));
    });

    this.on("selected", (e: fabric.IEvent<MouseEvent>) => {
      this.setSelectedStyles();

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
      this.setDeselectedStyles();

      this.eventAggregator.publish(new HardwareDeselected(this));


      this.events.push(new HardwareEvent({
        domEvent: "deselected"
      }));
    });

    this.on("moving", (e: fabric.IEvent<MouseEvent>) => {
      const mousePosition = e.pointer;

      if (this.isIntersecting) {
        this.warehouseCanvas.moveCursor = DOMUtility.Cursors.NOT_ALLOWED;
      } else {
        this.warehouseCanvas.moveCursor = DOMUtility.Cursors.MOVE;
      }

      this.warehouseCanvas.setCursor(this.moveCursor);

      this.left = this.constrainX(this.snapX(mousePosition.x - (this.width / 2)));
      this.top = this.constrainY(this.snapY(mousePosition.y - (this.height / 2)));


      this.events.push(new HardwareEvent({
        domEvent: "moving",
        message: `left: ${this.left} / top: ${this.top}`
      }));
    });

    this.on("removed", (e: fabric.IEvent<MouseEvent>) => {
      this.warehouseCanvas.remove(this.fabricLabel);
    });
  }

  /**
   * Determines if this hardware is intersecting with another.
   */
  public get isIntersecting(): boolean {
    return RackUtility.isIntersecting(this.warehouseCanvas, this);
  }

  public setOptions(options: IObjectOptions): void {
    super.setOptions(options);

    //    see "When to call setCoords" github page
    this.setCoords();
  }

  protected setMouseOverStyles() {
    this.setOptions({
      strokeWidth: 2,
      strokeDashArray: [10, 10]
    });
  }

  protected setMouseOutStyles() {
    this.setOptions({
      strokeWidth: 1,
      strokeDashArray: undefined
    });
  }

  protected setSelectedStyles() {
    this.setOptions({
      fill: '#adb5bd'
    });
  }

  protected setDeselectedStyles() {
    this.setOptions({
      fill: '#eee'
    });
  }


  public snapX(xPoint) {
    return Math.round(xPoint / 40) * 40;
  }

  public snapY(yPoint) {
    return Math.round(yPoint / 40) * 40;
  }


  public constrainX(leftPoint) {
    let constrainedX = Math.max(0, leftPoint);

    constrainedX = Math.min(constrainedX, this.warehouseCanvas.width - 80)

    return constrainedX;
  }

  public constrainY(topPoint) {
    let constrainedY = Math.max(0, topPoint);

    constrainedY = Math.min(constrainedY, this.warehouseCanvas.height - 160);

    return constrainedY;
  }

  protected observableUpdated(prop) {
    if (this.warehouseCanvas) {
      this.dirty = true;
      this.render(this.warehouseCanvas.getContext());
      this.warehouseCanvas.renderAll();
    }
  }

  public _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);

    this.renderLabel(ctx);
  }

  protected renderLabel(ctx: CanvasRenderingContext2D) {
    if (!this.fabricLabel) {
      this.fabricLabel = new fabric.Text(this.label, {
        fontFamily: 'Helvetica',
        strokeWidth: 0,
        stroke: '#333',
        fontSize: 14
      });

      this.warehouseCanvas.add(this.fabricLabel);
    }

    this.fabricLabel.left = this.left;
    this.fabricLabel.top = this.top - 20;
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
export class ShadowRack extends Rack {
  public static readonly type: string = "ShadowRack";
  public type = ShadowRack.type;

  constructor(rackDetails: Partial<IRack>, warehouseCanvas: fabric.Canvas, eventAggregator: EventAggregator) {
    super(Object.assign({}, rackDetails, {
      type: ShadowRack.type,
      evented: false
    }), warehouseCanvas, eventAggregator);
  }


  public draw(options: fabric.IEvent<MouseEvent>) {
    this.setSelectedStyles();
    const mousePosition = options.pointer;

    this.left = this.constrainX(this.snapX(mousePosition.x - (this.width / 2)));
    this.top = this.constrainY(this.snapY(mousePosition.y - (this.height / 2)));


    this.bringToFront();

    // Cannot create rack on top on another
    if (this.isIntersecting) {
      this.warehouseCanvas.setCursor(DOMUtility.Cursors.NOT_ALLOWED);
    } else {
      this.warehouseCanvas.setCursor(DOMUtility.Cursors.DEFAULT);
    }

    this.setCoords();
  }

}
