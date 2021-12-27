import { DOMUtility } from "../utils/dom";

export enum GridDrawingStyle {
  CELL_WIDTH,
  CELL_COUNT
}

export class GridService {
  private readonly gridWidthOrCount: number;
  private readonly gridHeightOrCount: number;

  private drawingStyle: GridDrawingStyle = GridDrawingStyle.CELL_WIDTH;
  private grayScaleGridLineColor: number = 190;
  private p5: p5;

  constructor(p5: p5, gridWidthOrCount: number, gridHeightOrCount: number) {
    this.p5 = p5;
    this.gridWidthOrCount = gridWidthOrCount;
    this.gridHeightOrCount = gridHeightOrCount;
  }


  public drawGrid() {
    if (!this.p5) {
      console.error('p5 instance not set');
      return;
    }

    const canvasGrid = this.p5.createGraphics(DOMUtility.boundingWidth(), (DOMUtility.boundingHeight() - 100));

    canvasGrid.background("220");

    for (let x = 0; x < canvasGrid.width; x += this.gridWidthOrCount) {
      for (let y = 0; y < canvasGrid.height; y += this.gridHeightOrCount) {
        canvasGrid.stroke("#ededed");
        canvasGrid.strokeWeight(1);
        canvasGrid.line(x, 0, x, canvasGrid.height);
        canvasGrid.line(0, y, canvasGrid.width, y);
      }
    }

    this.p5.image(canvasGrid, 0, 0);
  }
}