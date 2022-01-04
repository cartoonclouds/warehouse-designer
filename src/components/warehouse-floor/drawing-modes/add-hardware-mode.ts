import { EventAggregator } from 'aurelia';
import { Rack } from '../..';
import { DrawMode, HardwareSelected } from '../../../messages/messages';
import { GridService } from '../../../service-providers/grid-service';
import { IRack, ShadowRack } from '../../hardware/rack/rack';
import { DrawingModeBase } from './drawing-mode-base';
import { Hardware, HardwareType, ShadowHardware } from '../../hardware/hardware';
import { IShelf } from '../../hardware/shelf/shelf';

export class _AddHardwareDrawingMode extends DrawingModeBase {
  public static readonly mode: string = DrawMode.ADD_RACK;
  public mode = _AddHardwareDrawingMode.mode;

  protected shadowHardware: ShadowHardware;
  public hardwareType: HardwareType;

  constructor(
    canvas: fabric.Canvas,
    gridService: GridService,
    eventAggregator: EventAggregator) {
    super(canvas, gridService, eventAggregator);
  }


  public onMouseMove(options: fabric.IEvent<MouseEvent>) {
    if (!this.shadowHardware) {
      switch (this.hardwareType) {
        case HardwareType.RACK:
          this.shadowHardware = new ShadowRack({
            label: `ShadowRack`,
            selectable: false,
          }, this.canvas, this.eventAggregator);
          break;
      }


      this.canvas.add(this.shadowHardware as fabric.Object);
      this.eventAggregator.publish(new HardwareSelected(this.shadowHardware));
    }

    this.shadowHardware.draw(options);

    this.canvas.renderAll();
  }

  public onMouseUp(options: fabric.IEvent<MouseEvent>) {
    if (!this.shadowHardware?.isIntersecting) {
      switch (this.hardwareType) {
        case HardwareType.RACK:
          this.createRack(this.shadowHardware as IRack);
          break;
      }
    }

    this.canvas.renderAll();
  }

  public load() {
    this.hardwareExcept(this.shadowHardware).forEach((hardware: Hardware) => {
      hardware.selectable = false;
      hardware.evented = false;
    });
  }


  public unload() {
    if (this.shadowHardware) {
      this.deleteHardware(this.shadowHardware);
      this.shadowHardware = null;
    }

    this.hardwareExcept(this.shadowHardware).forEach((hardware: Hardware) => {
      hardware.selectable = true;
      hardware.evented = true;
    });
  }
}

export class AddHardwareDrawingMode {
  private static instance: Readonly<_AddHardwareDrawingMode>;

  public static getInstance(
    canvas: fabric.Canvas,
    gridService: GridService,
    eventAggregator: EventAggregator
  ) {
    if (!AddHardwareDrawingMode.instance) {
      AddHardwareDrawingMode.instance = new _AddHardwareDrawingMode(canvas, gridService, eventAggregator);
    }

    AddHardwareDrawingMode.instance.load();

    return AddHardwareDrawingMode.instance;
  }
}