import { EventAggregator } from "aurelia";
import { DrawingModeBase } from "../components/warehouse-floor/drawing-modes/drawing-mode-base";
import { HardwareSelected } from "../messages/messages";

export default class FloorSeeder {
  private readonly eventAggregator: EventAggregator;
  private readonly drawingModeHandler: DrawingModeBase;

  constructor(drawingModeHandler: DrawingModeBase, eventAggregator: EventAggregator) {
    this.drawingModeHandler = drawingModeHandler;
    this.eventAggregator = eventAggregator;
  }

  public seed() {
    // seed floor
    this.drawingModeHandler.createRack({
      top: 120,
      left: 500,
    });

    const tmpRack = this.drawingModeHandler.createRack({
      top: 120,
      left: 600,
    });

    tmpRack.addShelf();

    this.drawingModeHandler.createRack({
      top: 120,
      left: 700,
    });

    this.eventAggregator.publish(new HardwareSelected(tmpRack));
  }
}