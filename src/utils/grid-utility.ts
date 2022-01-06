import { fabric } from "fabric";

export enum GridDrawingStyle {
  CELL_WIDTH,
  CELL_COUNT
}

export class GridUtility {
  private canvasWidth: number;
  private canvasHeight: number;

  private gridWidthOrCount: number;
  private gridHeightOrCount: number;

  private drawingStyle: GridDrawingStyle = GridDrawingStyle.CELL_WIDTH;
  private grayScaleGridLineColor: number = 190;
  private canvas: fabric.Canvas;


  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }


  public setXY(gridWidthOrCount: number, gridHeightOrCount: number) {
    this.gridWidthOrCount = gridWidthOrCount;
    this.gridHeightOrCount = gridHeightOrCount;
  }


  // https://codepen.io/Ben_Tran/pen/YYYwNL
  public generateGrid(): fabric.Object[] {
    const gridObjects = [];

    for (var i = 0; i < (this.canvasWidth / this.gridWidthOrCount); i++) {
      gridObjects.push(new fabric.Line([i * this.gridHeightOrCount, 0, i * this.gridHeightOrCount, this.canvasHeight], this.properties));
      gridObjects.push(new fabric.Line([0, i * this.gridWidthOrCount, this.canvasWidth, i * this.gridWidthOrCount], this.properties))
    }

    return gridObjects;
  }

  protected get properties() {
    return {
      type: 'line',
      stroke: '#ccc',
      selectable: false,
      evented: false
    };
  }

  protected get cellWidth() {
    return this.canvasWidth / this.gridWidthOrCount;
  }

  protected get cellHeight() {
    return this.canvasHeight / this.gridHeightOrCount;
  }


}