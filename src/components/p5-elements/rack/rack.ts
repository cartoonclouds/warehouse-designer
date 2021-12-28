import { EventAggregator } from "aurelia";
import { fabric } from "fabric";
import { HardWareDeselected, HardWareSelected } from '../../../messages/messages';
import FabricJSUtil from '../../../utils/fabricjs';


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
      hasControls: false,
      hoverCursor: 'pointer',
      perPixelTargetFind: true
    }, rackDetails));

    rackDetails = Object.assign({
      type: Rack.type,
      width: 80,
      height: 160,
      fill: '#adb5bd',
      stroke: '#000',
      strokeWidth: 2,
      lockRotation: true,
      hasControls: false,
      hoverCursor: 'pointer',
      perPixelTargetFind: true
    }, rackDetails);

    Object.assign(this, rackDetails);

    this.warehouseCanvas = warehouseCanvas;

    this.eventAggregator = new EventAggregator();

    this.attachEvents();
  }


  protected attachEvents() {

    this.on("mouseover", (e: fabric.IEvent<MouseEvent>) => {
      this.setMouseOverStyles();

      this.render(this.warehouseCanvas.getContext());

      console.log(`mouseover ${this.label}`);

    });

    this.on("mouseout", (e: fabric.IEvent<MouseEvent>) => {
      this.setMouseOutStyles();

      this.render(this.warehouseCanvas.getContext());

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

  public intersectsRect(rack: Rack) {
    const shadowRackCoords = this.getCoords();

    return rack.containsPoint(shadowRackCoords[0].scalarSubtract(1))
      || rack.containsPoint(shadowRackCoords[1].scalarSubtract(1))
      || rack.containsPoint(shadowRackCoords[2].scalarSubtract(1))
      || rack.containsPoint(shadowRackCoords[3].scalarSubtract(1));

    // && !this.isTargetTransparent(_obj, mousePosition.x, mousePosition.y);

    return rack.isContainedWithinObject(this)
      || rack.intersectsWithObject(this)
      || this.isContainedWithinObject(rack);
  }


  protected setMouseOverStyles() {
    this.setOptions({
      strokeWidth: 2,
      // borderDashArray: [10, 10]
    });

    //this.setOptionsOpacity(DrawingColours.WHITE, DEFAULT_OPACITY)
    //required see "When to call setCoords" github page
    this.setCoords();
  }

  protected setMouseOutStyles() {
    this.setOptions({
      strokeWidth: 1,
      borderDashArray: undefined
    });

    //required see "When to call setCoords" github page
    this.setCoords();
  }

  protected setSelectedStyles() {
    this.setOptions({
      strokeWidth: 2,
      fill: '#0d6efd'
    });

    this.setCoords();
  }

  protected setDeselectedStyles() {
    this.setOptions({
      strokeWidth: 1,
      fill: '#adb5bd'
    });

    this.setCoords();
  }

  public _render(ctx: CanvasRenderingContext2D) {
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

    this.set('label', this.label || '');
  };


  public toObject() {
    return fabric.util.object.extend(super.toObject(), {
      label: this.get('label')
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
}
