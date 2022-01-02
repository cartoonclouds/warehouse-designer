import { EventAggregator, IDisposable, IEventAggregator, inject } from "aurelia";

import { GridService } from "./service-providers/grid-service";
import { WarehouseCanvas } from './utils/warehouse-canvas';
import { DrawMode, UpdateDrawMode, HardwareSelected, HardwareDeselected } from './messages/messages';
import { DOMUtility } from './utils/dom';
import { Rack } from "./components";
import { observable } from '@aurelia/runtime';

@inject()
export class App {
  public static readonly InfoBarHeight = 104;

  protected canvas;
  protected gridService: GridService;
  protected warehouseCanvas: WarehouseCanvas

  protected hardwareDeselectedSubscription: IDisposable;
  protected hardwareSelectedSubscription: IDisposable;

  @observable public selectedHardware: Rack;

  constructor(
    protected readonly element: HTMLElement,
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) {
  }

  public get selected() {
    return {
      viewModel: this.selectedHardware,
      model: Rack
    }
  }


  public unbinding() {
    this.warehouseCanvas.unsubscribe();
    this.hardwareSelectedSubscription.dispose();
    this.hardwareDeselectedSubscription.dispose();
  }


  public attached() {
    this.hardwareSelectedSubscription = this.eventAggregator.subscribe(HardwareSelected, (message: HardwareSelected) => {
      this.selectedHardware = message.rack;

      console.log(`App > HardwareSelected`, this.selectedHardware);
    });


    this.hardwareDeselectedSubscription = this.eventAggregator.subscribe(HardwareDeselected, (message: HardwareDeselected) => {
      this.selectedHardware = null;
    });


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
    this.warehouseCanvas.setGridService(this.gridService);
    this.gridService.drawGrid();

    // set initial draw mode as SELECTION
    // this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_RACK));
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
