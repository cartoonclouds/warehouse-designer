import { IEventAggregator, EventAggregator } from 'aurelia';
import { Rack } from '../..';
import { DrawMode, HardwareDeselected } from '../../../messages/messages';
import { GridService } from '../../../service-providers/grid-service';
import { DrawingModeBase } from './drawing-mode-base';

class _DeleteHardwareDrawingMode extends DrawingModeBase {
  public static readonly mode: string = DrawMode.DELETE_HARDWARE;
  public mode = _DeleteHardwareDrawingMode.mode;

  constructor(
    canvas: fabric.Canvas,
    gridService: GridService,
    eventAggregator: EventAggregator) {
    super(canvas, gridService, eventAggregator);
  }



  public onMouseMove(options: fabric.IEvent<MouseEvent>) {


  }


  public onMouseUp(options: fabric.IEvent<MouseEvent>) {
    this.deleteHardware(options.target as Rack);
  }


  public load() {

  }

  public unload() {

  }
}

export class DeleteHardwareDrawingMode {
  private static instance: Readonly<_DeleteHardwareDrawingMode>;

  public static getInstance(
    canvas: fabric.Canvas,
    gridService: GridService,
    eventAggregator: EventAggregator
  ) {
    if (!DeleteHardwareDrawingMode.instance) {
      DeleteHardwareDrawingMode.instance = new _DeleteHardwareDrawingMode(canvas, gridService, eventAggregator);
    }

    DeleteHardwareDrawingMode.instance.load();

    return DeleteHardwareDrawingMode.instance;
  }
}