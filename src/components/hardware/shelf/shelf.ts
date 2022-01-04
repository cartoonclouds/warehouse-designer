import { EventAggregator } from "aurelia";
import { fabric } from "fabric";
import { HardwareDeselected, HardwareSelected } from '../../../messages/messages';
import { DOMUtility } from '../../../utils/dom';
import { observable } from '@aurelia/runtime';
import { IObjectOptions } from "fabric/fabric-impl";
import { Drawable, HardwareEvent, HardwareType, IHardware } from '../hardware';
import ShelfUtility from "../../../utils/shelf-utility";
import { Rack } from '../rack/rack';


export type IShelf = Shelf & fabric.IRectOptions;


@observable({ name: 'label', callback: 'observableUpdated' })
@observable({ name: 'code', callback: 'observableUpdated' })
@observable({ name: 'left', callback: 'observableUpdated' })
@observable({ name: 'top', callback: 'observableUpdated' })
export class Shelf extends fabric.Rect {
  public static readonly type: string = "Shelf";
  public type = Shelf.type;

  public notes: string;
  public code: string;
  public readonly rack: Rack;

  protected static DEFAULT_PROPS = {
    type: Shelf.type,
    lockRotation: true,
    hasControls: false,
    perPixelTargetFind: true,
  };


  //@TODO Autoinject
  protected eventAggregator: EventAggregator;
  protected warehouseCanvas: fabric.Canvas;

  public label: string;
  protected fabricLabel: fabric.Text;
  public get defaultLabel() {
    return `Shelf-${this.warehouseCanvas.getObjects('Shelf').length + 1} for Rack ${this.rack?.label}`;
  }


  constructor(shelfDetails: Partial<Shelf>, rack?: Rack) {
    super(Object.assign({}, Shelf.DEFAULT_PROPS, shelfDetails));

    this.rack = rack;

    this.updateLocation();

    this.label = shelfDetails.label || this.defaultLabel;
    this.notes = shelfDetails.notes;
    this.code = shelfDetails.code;

    this.attachEvents();
  }


  protected attachEvents() {
    this.on("selected", (e: fabric.IEvent<MouseEvent>) => {
      this.eventAggregator.publish(new HardwareSelected(this));


      this.events.push(new HardwareEvent({
        domEvent: "selected"
      }));
    });

    this.on("deselected", (e: fabric.IEvent<MouseEvent>) => {
      this.eventAggregator.publish(new HardwareDeselected(this));


      this.events.push(new HardwareEvent({
        domEvent: "deselected"
      }));
    });

    this.on("removed", (e: fabric.IEvent<MouseEvent>) => {
      this.warehouseCanvas.remove(this.fabricLabel);
    });
  }

  public setOptions(options: IObjectOptions): void {
    super.setOptions(options);

    //    see "When to call setCoords" github page
    this.setCoords();
  }

  public updateLocation() {
    if (!this.rack) {
      return;
    }

    this.setOptions({
      left: this.rack.left + 4,
      top: this.rack.top + 4,
    });
  }

  protected observableUpdated() {
    if (this.warehouseCanvas) {
      this.dirty = true;
      this.render(this.warehouseCanvas.getContext());
      this.warehouseCanvas.renderAll();
    }
  }

  public _render(ctx: CanvasRenderingContext2D) {
    this.updateLocation();

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

    this.fabricLabel.text = this.label;
    this.fabricLabel.left = this.left;
    this.fabricLabel.top = this.top - this.fabricLabel.calcTextHeight() - 4;
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