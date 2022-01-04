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

  public get racks() {
    return this.canvas?.getObjects("Rack") || [];
  }

  public racksExcept(rack: Rack) {
    return this.racks.filter((r: Rack) => r !== rack);
  }

  public get hardwares() {
    const hardwares = [];

    hardwares.push(...(this.canvas?.getObjects("Rack") || []));
    hardwares.push(...(this.canvas?.getObjects("Shelf") || []));

    return hardwares;
  }

  public hardwareExcept(hardware: Hardware) {
    return this.hardwares.filter((h: Hardware) => h !== hardware);
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
  public deleteHardware(hardware: Hardware) {
    this.canvas.remove(hardware as any);

    this.eventAggregator.publish(new HardwareDeselected(hardware));

    this.canvas.renderAll();
  }

}