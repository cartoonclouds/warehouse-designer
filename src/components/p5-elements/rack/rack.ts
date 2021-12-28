import { EventAggregator } from "aurelia";
import { fabric } from "fabric";
import { HardWareDeselected, HardWareSelected } from '../../../messages/messages';


export type IRack = Rack | fabric.IRectOptions;

class RackHardware extends fabric.Rect {
  public get modelName() {
    return this.constructor.name.trim();
  }

  public static get className() {
    return this.name.trim();
  }
};

export class Rack extends RackHardware {
  public static readonly type: string = "Rack";
  public type = Rack.type;


  public label: string;
  public code: string;
  // public shelves: Shelf[] = [];
  public edges = [];

  public selected: boolean = false;
  public warehouseCanvas: fabric.Canvas;
  protected readonly eventAggregator: EventAggregator

  constructor(rackDetails: Partial<IRack>, warehouseCanvas: fabric.Canvas) {
    super(Object.assign({
      type: Rack.type,
      width: 80,
      height: 160,
      fill: '#adb5bd',
      stroke: '#000',
      strokeWidth: 2,
      lockRotation: true,
      hasControls: false
    }, rackDetails));

    rackDetails = Object.assign({
      type: Rack.type,
      width: 80,
      height: 160,
      fill: '#adb5bd',
      stroke: '#000',
      strokeWidth: 2,
      lockRotation: true,
      hasControls: false
    }, rackDetails);

    Object.assign(this, rackDetails);

    this.warehouseCanvas = warehouseCanvas;

    this.eventAggregator = new EventAggregator();

    this.attachEvents();
  }


  protected attachEvents() {

    this.on("mouseover", (e: fabric.IEvent<MouseEvent>) => {
      this.set('strokeWidth', 2);
      //this.setOpacity(DrawingColours.WHITE, DEFAULT_OPACITY)
      //required see "When to call setCoords" github page
      this.setCoords();
      this._render(this.warehouseCanvas.getContext());

      console.log(`mouseover ${this.label}`);

    });

    this.on("mouseout", (e: fabric.IEvent<MouseEvent>) => {
      this.set('strokeWidth', 1);

      //required see "When to call setCoords" github page
      this.setCoords();
      this._render(this.warehouseCanvas.getContext());

      console.log(`mouseout ${this.label}`);

    });

    this.on("selected", (e: fabric.IEvent<MouseEvent>) => {
      if (e.target === this) {
        this.setSelectedStyles();

        this.selected = !this.selected;

        this.eventAggregator.publish(new HardWareSelected(this));

        console.log(`selected ${this.label} ? ${this.selected ? "T" : "F"}`);
      }
    });

    this.on("deselected", (e: fabric.IEvent<MouseEvent>) => {
      this.setDeselectedStyles();

      this.selected = false;

      this.eventAggregator.publish(new HardWareDeselected(this));

      console.log(`deselected ${this.label} ? ${this.selected ? "T" : "F"}`);
    });

  }

  protected setSelectedStyles() {
    this.set('fill', '#0d6efd');
    this.set('strokeWidth', 2);
  }

  protected setDeselectedStyles() {
    this.set('fill', '#adb5bd');
    this.set('strokeWidth', 1);
  }

  public _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);

    ctx.font = '14px Helvetica';
    ctx.fillStyle = '#333';
    ctx.fillText(this.label, -this.width / 2, -this.height / 2 - 10);
  }


  public initialize(options?: fabric.IObjectOptions): any {
    options || (options = {});

    super.initialize(options);

    this.set('label', this.label || '');
  };

  // public toObject() {
  //   return fabric.util.object.extend(this.callSuper('toObject'), {
  //     label: this.get('label')
  //   });
  // },
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
}
