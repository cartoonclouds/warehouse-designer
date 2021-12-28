import { EventAggregator, IEventAggregator, IDisposable, inject } from "aurelia";

import { GridService } from "./service-providers/grid-service";
import { WarehouseService } from "./service-providers/warehouse-service";
import { DrawMode, UpdateDrawMode, CreateRack } from './messages/messages';
import { observable } from '@aurelia/runtime';
import { DOMUtility } from './utils/dom';
import { fabric } from "fabric";

@inject()
export class App {
  public static readonly InfoBarHeight = 104;

  protected canvas;
  protected gridService: GridService;

  constructor(
    protected readonly element: HTMLElement,
    protected readonly warehouseService: WarehouseService,
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) { }


  public unbinding() {
    this.warehouseService.unsubscribe();
  }

  public attached() {
    this.warehouseService.subscribe();

    // create fabric canvas instance
    const warehouseCanvas = new fabric.Canvas("floor", {
      width: DOMUtility.boundingWidth(),
      height: (DOMUtility.boundingHeight() - App.InfoBarHeight)
    });

    // update WarehouseService's reference to p5 instance
    this.warehouseService.setWarehouseCanvas(warehouseCanvas);

    // create grid instance
    this.gridService = new GridService(warehouseCanvas, 40, 40);
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
