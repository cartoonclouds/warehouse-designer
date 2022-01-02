import Aurelia, { DI, EventAggregator, IAurelia, IEventAggregator } from "aurelia";
import { fabric } from "fabric";
import { HardwareDeselected, HardwareSelected } from '../../../messages/messages';
import FabricJSUtil from '../../../utils/fabricjs';
import { DOMUtility } from '../../../utils/dom';
import { observable } from '@aurelia/runtime';
import { IObjectOptions } from "fabric/fabric-impl";


export type IRack = Rack | fabric.IRectOptions;

export class HardwareEvent {
  dateTime: Date;
  domEvent: string;
  message: string;

  constructor(params) {
    this.dateTime = new Date();
    this.domEvent = params.domEvent;
    this.message = params.message;
  }
}
class RackHardware extends fabric.Rect {
  public get modelName() {
    return this.constructor.name.trim();
  }

  public static get className() {
    return this.name.trim();
  }

  @observable public events: HardwareEvent[] = [];

};

@observable({ name: 'label', callback: 'observableUpdated' })
@observable({ name: 'code', callback: 'observableUpdated' })
export class Rack extends RackHardware {
  public static readonly type: string = "Rack";

  public type = Rack.type;
  public label: string;
  public notes: string;
  public code: string;

  public shelves: [] = [];
  public edges = [];

  protected initialPosition: { top: number, left: number };


  //@TODO Autoinject
  public eventAggregator: EventAggregator;
  public warehouseCanvas: fabric.Canvas;


  constructor(rackDetails: Partial<IRack>, warehouseCanvas: fabric.Canvas) {
    super(Object.assign({
      type: Rack.type,
      width: 80,
      height: 160,
      fill: '#adb5bd',
      stroke: '#000',
      strokeWidth: 2,
      lockRotation: true,
      hasControls: false,
      perPixelTargetFind: true
    }, rackDetails));

    this.warehouseCanvas = warehouseCanvas;

    rackDetails = Object.assign({
      label: this.defaultLabel,
      type: Rack.type,
      width: 80,
      height: 160,
      fill: '#adb5bd',
      stroke: '#000',
      strokeWidth: 2,
      lockRotation: true,
      hasControls: false,
      perPixelTargetFind: true
    }, rackDetails);

    Object.assign(this, rackDetails);


    this.attachEvents();
  }

  public get defaultLabel() {
    return `Rack-${this.warehouseCanvas.getObjects('Rack').length + 1}`;
  }


  protected attachEvents() {

    this.on("mouseup", (e: fabric.IEvent<MouseEvent>) => {
      if (this.isIntersecting && this.initialPosition) {
        this.top = this.initialPosition.top;
        this.left = this.initialPosition.left;
      }
      this.setCoords();

      this._render(this.warehouseCanvas.getContext());


      this.events.push(new HardwareEvent({
        domEvent: "mouseup"
      }))
    });

    this.on("mouseover", (e: fabric.IEvent<MouseEvent>) => {
      this.setMouseOverStyles();

      this._render(this.warehouseCanvas.getContext());


      this.events.push(new HardwareEvent({
        domEvent: "mouseover"
      }));
    });

    this.on("mouseout", (e: fabric.IEvent<MouseEvent>) => {
      this.setMouseOutStyles();

      this._render(this.warehouseCanvas.getContext());

      this.events.push(new HardwareEvent({
        domEvent: "mouseup"
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
      if (this.isIntersecting) {
        this.warehouseCanvas.moveCursor = DOMUtility.Cursors.NOT_ALLOWED;
      } else {
        this.warehouseCanvas.moveCursor = DOMUtility.Cursors.MOVE;
      }

      this.warehouseCanvas.setCursor(this.moveCursor);


      this.events.push(new HardwareEvent({
        domEvent: "moving"
      }));
    });
  }

  public get isIntersecting(): boolean {
    return this.warehouseCanvas.getObjects('Rack')
      .filter((r: Rack) => this !== r)
      .some((r: Rack) => {
        return this.intersectsRect(r);
      });
  }

  public intersectsRect(rack: Rack) {
    const rackCoords = this.getCoords(true, true);

    return rack.containsPoint(rackCoords[0].scalarSubtract(1))
      || rack.containsPoint(rackCoords[1].scalarSubtract(1))
      || rack.containsPoint(rackCoords[2].scalarSubtract(1))
      || rack.containsPoint(rackCoords[3].scalarSubtract(1));

    // && !this.isTargetTransparent(_obj, mousePosition.x, mousePosition.y);

    return rack.isContainedWithinObject(this)
      || rack.intersectsWithObject(this)
      || this.isContainedWithinObject(rack);
  }

  public setOptions(options: IObjectOptions): void {
    super.setOptions(options);

    //required see "When to call setCoords" github page
    this.setCoords();
  }


  protected setMouseOverStyles() {
    this.setOptions({
      strokeWidth: 2,
      // borderDashArray: [10, 10]
    });
  }

  protected setMouseOutStyles() {
    this.setOptions({
      strokeWidth: 1,
      borderDashArray: undefined
    });
  }

  protected setSelectedStyles() {
    this.setOptions({
      strokeWidth: 2,
      fill: '#0d6efd'
    });
  }

  protected setDeselectedStyles() {
    this.setOptions({
      strokeWidth: 1,
      fill: '#adb5bd'
    });
  }

  protected observableUpdated() {
    if (this.warehouseCanvas) {
      this.dirty = true;
      this._render(this.warehouseCanvas.getContext());
      this.warehouseCanvas.renderAll();
    }
  }

  public _render(ctx: CanvasRenderingContext2D) {
    this.dirty = true;
    super._render(ctx);

    this.renderLabel(ctx);
  }

  protected renderLabel(ctx: CanvasRenderingContext2D) {
    ctx.font = '14px Helvetica';
    ctx.fillStyle = '#333';
    ctx.fillText(this.label, -this.width / 2, -this.height / 2 - 10);
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
}
export class ShadowRack extends Rack {
  public static readonly type: string = "ShadowRack";
  public type = ShadowRack.type;

  constructor(rackDetails: Partial<Rack>, warehouseCanvas: fabric.Canvas) {
    super(Object.assign({}, rackDetails, {
      type: ShadowRack.type,
      evented: false
    }), warehouseCanvas);
  }


  public draw(options: fabric.IEvent<MouseEvent>) {
    const mousePosition = options.pointer;

    this.left = this.constrainX(mousePosition.x);
    this.top = this.constrainY(mousePosition.y);


    this.bringToFront();

    const shadowRackIntersects = this.warehouseCanvas.getObjects('Rack').some((r: Rack) => {
      return this.intersectsRect(r);
    });

    if (shadowRackIntersects) {
      //cannot create rack on top on another
      this.warehouseCanvas.setCursor(DOMUtility.Cursors.NOT_ALLOWED);
    } else {
      this.warehouseCanvas.setCursor(DOMUtility.Cursors.DEFAULT);
    }

    this.setCoords();
  }

  public constrainX(xPoint) {
    let constrainedX = Math.max(0, xPoint - (this.width / 2));

    constrainedX = Math.min(constrainedX, this.warehouseCanvas.width - this.width)

    constrainedX = Math.round(constrainedX / 40) * 40;

    return constrainedX;
  }

  public constrainY(yPoint) {
    let constrainedY = Math.max(0, yPoint - (this.height / 2));

    constrainedY = Math.min(constrainedY, this.warehouseCanvas.height - this.height);

    constrainedY = Math.round(constrainedY / 40) * 40;

    return constrainedY;
  }
}
