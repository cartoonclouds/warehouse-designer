import { EventAggregator, IEventAggregator, inject } from "aurelia";

import { GridService } from "./service-providers/grid-service";
import { WarehouseCanvas } from './utils/warehouse-canvas';
import { DrawMode, UpdateDrawMode } from './messages/messages';
import { DOMUtility } from './utils/dom';

@inject()
export class App {
  public static readonly InfoBarHeight = 104;

  protected canvas;
  protected gridService: GridService;
  protected warehouseCanvas: WarehouseCanvas

  constructor(
    protected readonly element: HTMLElement,
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) {
  }


  public unbinding() {
    this.warehouseCanvas.unsubscribe();
  }

  public attached() {
    // create fabric canvas instance
    this.warehouseCanvas = new WarehouseCanvas({
      element: "floor",
      eventAggregator: this.eventAggregator,
    }, {
      selection: false,
      width: DOMUtility.boundingWidth(),
      height: (DOMUtility.boundingHeight() - App.InfoBarHeight)
    });

    // create grid instance
    this.gridService = new GridService(this.warehouseCanvas, 40, 40);
    this.gridService.drawGrid();

    // set initial draw mode as SELECTION
    this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_RACK));
  }

  public detached() {
    this.canvas = null;
  }


  // protected windowResized(p5) {
  //   return function () {
  //     p5.resizeCanvas(this.boundingWidth, this.boundingHeight);
  //   };
  // }
}
