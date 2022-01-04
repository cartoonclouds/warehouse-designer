import { IEventAggregator, EventAggregator } from 'aurelia';
import { Rack } from '../..';
import { DrawMode, HardwareDeselected, HardwareSelected } from '../../../messages/messages';
import { GridService } from '../../../service-providers/grid-service';
import { ShadowRack } from '../../hardware/rack/rack';
import { DrawingModeBase } from './drawing-mode-base';

export class _AddRackDrawingMode extends DrawingModeBase {
  public static readonly mode: string = DrawMode.ADD_RACK;
  public mode = _AddRackDrawingMode.mode;

  protected shadowRack: ShadowRack;
  protected that;

  constructor(
    canvas: fabric.Canvas,
    gridService: GridService,
    eventAggregator: EventAggregator) {
    super(canvas, gridService, eventAggregator);
  }


  public onMouseMove(options: fabric.IEvent<MouseEvent>) {
    if (!this.shadowRack) {
      this.shadowRack = new ShadowRack({
        label: `ShadowRack`,
        selectable: false,
      }, this.canvas, this.eventAggregator);

      this.canvas.add(this.shadowRack);
      this.eventAggregator.publish(new HardwareSelected(this.shadowRack));
    }

    this.shadowRack.draw(options);

    this.canvas.renderAll();
  }

  public onMouseUp(options: fabric.IEvent<MouseEvent>) {
    if (!this.shadowRack?.isIntersecting) {
      this.createRack(this.shadowRack);
    }

    this.canvas.renderAll();
  }

  public load() {
    this.racksExcept(this.shadowRack).forEach((rack: Rack) => {
      rack.selectable = false;
      rack.evented = false;
    });
  }


  public unload() {
    if (this.shadowRack) {
      this.deleteRack(this.shadowRack);
      this.shadowRack = null;
    }

    this.racks.forEach((rack: Rack) => {
      rack.selectable = true;
      rack.evented = true;
    });
  }
}

export class AddRackDrawingMode {
  private static instance: Readonly<_AddRackDrawingMode>;

  public static getInstance(
    canvas: fabric.Canvas,
    gridService: GridService,
    eventAggregator: EventAggregator
  ) {
    if (!AddRackDrawingMode.instance) {
      AddRackDrawingMode.instance = new _AddRackDrawingMode(canvas, gridService, eventAggregator);
    }

    AddRackDrawingMode.instance.load();

    return AddRackDrawingMode.instance;
  }
}