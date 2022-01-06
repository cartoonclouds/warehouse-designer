import { IEventAggregator, EventAggregator, inject } from 'aurelia';
import { DrawMode } from '../../../messages/messages';
import { Hardware } from '../../../models/hardware';
import CanvasService from '../../../service-providers/canvas-service';
import { DrawingModeBase } from './drawing-mode-base';

@inject()
export class DeleteHardwareDrawingMode extends DrawingModeBase {
  public static readonly mode: string = DrawMode.DELETE_HARDWARE;
  public mode = DeleteHardwareDrawingMode.mode;

  constructor(
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) {
    super(eventAggregator);
  }



  public onMouseMove(options: fabric.IEvent<MouseEvent>) {


  }


  public onMouseUp(options: fabric.IEvent<MouseEvent>) {
    this.deleteHardware(options.target as Hardware);
  }


  public load() {

  }

  public unload() {

  }
}
