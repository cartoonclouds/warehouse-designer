import { EventAggregator, IEventAggregator, inject } from "aurelia";
import { DOMUtility } from "../../utils/dom";
import { App } from "../../app";
import CanvasService from '../../service-providers/canvas-service';

@inject()
export class WarehouseFloor {

  constructor(
    protected readonly element: HTMLElement,
    @IEventAggregator public readonly eventAggregator: EventAggregator,
    protected readonly canvasService: CanvasService,
  ) { }


  public attached() {
    this.canvasService.attach(this.element.querySelector('#warehouse-floor') as HTMLCanvasElement, {
      preserveObjectStacking: false,
      width: DOMUtility.boundingWidth(),
      height: (DOMUtility.boundingHeight() - App.InfoBarHeight),
    });
  }

  public detached() {
    this.canvasService.detach();
  }
}