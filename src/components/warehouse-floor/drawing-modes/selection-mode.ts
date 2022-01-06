import { IEventAggregator, EventAggregator, inject } from 'aurelia';
import { DrawMode } from '../../../messages/messages';
import CanvasService from '../../../service-providers/canvas-service';
import { DrawingModeBase } from './drawing-mode-base';

@inject()
export class SelectionDrawingMode extends DrawingModeBase {
  public static readonly mode: string = DrawMode.SELECTION;
  public mode = SelectionDrawingMode.mode;

  constructor(
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) {
    super(eventAggregator);
  }


  public onMouseMove(options: fabric.IEvent<MouseEvent>) {

  }


  public onMouseUp(options: fabric.IEvent<MouseEvent>) {

  }


  public load() {

  }

  public unload() {

  }
}