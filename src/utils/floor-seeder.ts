import { EventAggregator } from "aurelia";
import { DrawingModeBase } from "../components/warehouse-floor/drawing-modes/drawing-mode-base";
import { UpdateDrawMode, DrawMode, HardwareSelected } from "../messages/messages";
import { GridService } from "../service-providers/grid-service";

export default class FloorSeeder {
  protected readonly canvas: fabric.Canvas;
  protected readonly gridService: GridService;
  protected readonly eventAggregator: EventAggregator;
  public drawingModeHandler: DrawingModeBase;

  constructor(canvas: fabric.Canvas, drawingModeHandler: DrawingModeBase, gridService: GridService, eventAggregator: EventAggregator) {
    this.canvas = canvas;
    this.drawingModeHandler = drawingModeHandler;
    this.gridService = gridService;
    this.eventAggregator = eventAggregator;
  }

  public seed() {
    //seed floor
    this.drawingModeHandler.createRack({
      top: 120,
      left: 500,
    });

    const tmpRack = this.drawingModeHandler.createRack({
      top: 120,
      left: 600,
    });

    this.drawingModeHandler.createRack({
      top: 120,
      left: 700,
    });
    
    this.eventAggregator.publish(new HardwareSelected(tmpRack));
  }
}