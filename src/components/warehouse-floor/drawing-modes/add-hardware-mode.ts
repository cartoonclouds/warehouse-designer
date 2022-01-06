import { EventAggregator, IEventAggregator, inject } from 'aurelia';
import { DrawMode, HardwareSelected } from '../../../messages/messages';
import { DrawingModeBase } from './drawing-mode-base';
import { Hardware, HardwareType, ShadowHardware } from '../../../models/hardware';
import { ShadowRack } from '../../../models';
import { IRack } from '../../../models/rack';
import CanvasService from '../../../service-providers/canvas-service';

@inject()
export class AddHardwareDrawingMode extends DrawingModeBase {
  public static readonly mode: string = DrawMode.ADD_RACK;
  public mode = AddHardwareDrawingMode.mode;

  protected shadowHardware: ShadowHardware;
  public hardwareType: HardwareType = HardwareType.RACK;

  constructor(
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) {
    super(eventAggregator);
  }


  public onMouseMove(options: fabric.IEvent<MouseEvent>) {
    if (!this.shadowHardware) {
      switch (this.hardwareType) {
        case HardwareType.RACK:
          this.shadowHardware = new ShadowRack({
            label: `ShadowRack`,
            selectable: false,
          }, super.canvasService.canvas, this.eventAggregator);
          break;
      }


      super.canvasService.canvas.add(this.shadowHardware as fabric.Object);
      this.eventAggregator.publish(new HardwareSelected(this.shadowHardware));
    }

    this.shadowHardware.draw(options);

    super.canvasService.canvas.renderAll();
  }

  public onMouseUp(options: fabric.IEvent<MouseEvent>) {
    if (!this.shadowHardware?.isIntersecting) {
      switch (this.hardwareType) {
        case HardwareType.RACK:
          this.createRack(this.shadowHardware as IRack);
          break;
      }
    }

    super.canvasService.canvas.renderAll();
  }

  public load() {
    super.canvasService.getAllHardwareExcept(this.shadowHardware).forEach((hardware: Hardware) => {
      hardware.selectable = false;
      hardware.evented = false;
    });
  }


  public unload() {
    if (this.shadowHardware) {
      this.deleteHardware(this.shadowHardware);
      this.shadowHardware = null;
    }

    super.canvasService.getAllHardwareExcept(this.shadowHardware).forEach((hardware: Hardware) => {
      hardware.selectable = true;
      hardware.evented = true;
    });
  }
}