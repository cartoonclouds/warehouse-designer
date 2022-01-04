import { EventAggregator } from "aurelia";
import { Rack } from "../..";
import { HardwareDeselected } from "../../../messages/messages";
import { GridService } from "../../../service-providers/grid-service";
import { Hardware } from "../../hardware/hardware";
import { IRack } from "../../hardware/rack/rack";

export abstract class DrawingModeBase {
  protected readonly canvas: fabric.Canvas;
  protected readonly gridService: GridService;
  protected readonly eventAggregator: EventAggregator;

  abstract onMouseUp(options: fabric.IEvent<MouseEvent>): boolean | void;
  abstract onMouseMove(options: fabric.IEvent<MouseEvent>): boolean | void;
  abstract load(): void;
  abstract unload(): void;

  constructor(canvas: fabric.Canvas, gridService: GridService, eventAggregator: EventAggregator) {
    this.canvas = canvas;
    this.gridService = gridService;
    this.eventAggregator = eventAggregator;
  }

  public get racks() {
    return this.canvas?.getObjects("Rack") || [];
  }

  public racksExcept(rack: Rack) {
    return this.racks.filter((r: Rack) => r !== rack);
  }

  public get DOMCanvas(): HTMLCanvasElement {
    return this.canvas?.getContext().canvas;
  }

  public get CanvasContext(): CanvasRenderingContext2D {
    return this.canvas?.getContext();
  }


  /**
   * Adds a rack to the list of created racks.
   * 
   * @param rackDetails 
   * @returns {Rack} The newly created rack
   */
  public createRack(rackDetails: Partial<IRack>,) {
    const newRack = new Rack({
      type: Rack.type,
      left: rackDetails.left,
      top: rackDetails.top
    }, this.canvas, this.eventAggregator);

    this.canvas.add(newRack);

    return newRack;
  }

  /**
   * Removes a hardware from the canvas.
   */
  public deleteRack(hardware: Hardware) {
    this.canvas.remove(hardware as fabric.Object);

    this.eventAggregator.publish(new HardwareDeselected(hardware));

    this.canvas.renderAll();
  }

}