import { DI, EventAggregator, IEventAggregator } from "aurelia";
import { HardwareDeselected } from "../../../messages/messages";
import { Hardware } from "../../../models/hardware";
import { Rack } from "../../../models";
import { IRack } from "../../../models/rack";
import CanvasService from '../../../service-providers/canvas-service';


export abstract class DrawingModeBase {
  public canvas: fabric.Canvas;
  protected canvasService: CanvasService;

  abstract onMouseUp(options: fabric.IEvent<MouseEvent>): boolean | void;
  abstract onMouseMove(options: fabric.IEvent<MouseEvent>): boolean | void;
  abstract load(): void;
  abstract unload(): void;

  constructor(
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) { }

  public attachCanvasService(canvasService: CanvasService) {
    this.canvasService = canvasService;
  }

  public renderAll() {
    return this.canvasService.canvas?.renderAll();
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
    }, {
      canvasService: this.canvasService,
      eventAggregator: this.eventAggregator
    });

    this.canvasService.canvas.add(newRack);

    return newRack;
  }

  /**
   * Removes a hardware from the canvas.
   */
  public deleteHardware(hardware: Hardware) {
    this.canvasService.canvas.remove(hardware as any);

    this.eventAggregator.publish(new HardwareDeselected(hardware));

    this.renderAll();
  }

}