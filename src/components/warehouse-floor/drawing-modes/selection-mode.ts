import { IEventAggregator, EventAggregator } from 'aurelia';
import { DrawMode } from '../../../messages/messages';
import { GridService } from '../../../service-providers/grid-service';
import { DrawingModeBase } from './drawing-mode-base';

export class _SelectionDrawingMode extends DrawingModeBase {
  public static readonly mode: string = DrawMode.SELECTION;
  public mode = _SelectionDrawingMode.mode;

  constructor(
    canvas: fabric.Canvas,
    gridService: GridService,
    eventAggregator: EventAggregator) {
    super(canvas, gridService, eventAggregator);
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

export class SelectionDrawingMode {
  private static instance: Readonly<_SelectionDrawingMode>;

  public static getInstance(
    canvas: fabric.Canvas,
    gridService: GridService,
    eventAggregator: EventAggregator
  ) {
    if (!SelectionDrawingMode.instance) {
      SelectionDrawingMode.instance = new _SelectionDrawingMode(canvas, gridService, eventAggregator);
    }

    SelectionDrawingMode.instance.load();

    return SelectionDrawingMode.instance;
  }
}