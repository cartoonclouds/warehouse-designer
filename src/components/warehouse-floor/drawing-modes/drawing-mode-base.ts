import { EventAggregator } from "aurelia";
import { HardwareDeselected } from "../../../messages/messages";
import { GridService } from "../../../service-providers/grid-service";
import { Hardware } from "../../../models/hardware";
import { Rack } from "../../../models";
import { IRack } from "../../../models/rack";

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

  public get DOMCanvas(): HTMLCanvasElement {
    return this.canvas?.getContext().canvas;
  }

  public get CanvasContext(): CanvasRenderingContext2D {
    return this.canvas?.getContext();
  }

  public renderAll() {
    return this.canvas?.renderAll();
  }

  /**
   * Adds a rack to the list of created racks.
   * 
   * @param rackDetails 
   * @returns {Rack} The newly created rack
   */
  public createRack(rackDetails: Partial<IRack>,) {
    const newRack = new Rack({
      left: rackDetails.left,
      top: rackDetails.top
    });

    this.canvas.add(newRack);

    return newRack;
  }

  /**
   * Removes a hardware from the canvas.
   */
  public deleteHardware(hardware: Hardware) {
    this.canvas.remove(hardware as any);

    this.eventAggregator.publish(new HardwareDeselected(hardware));

    this.canvas.renderAll();
  }

}