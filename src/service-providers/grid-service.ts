
import { fabric } from "fabric";
import { App } from "../app";
import { DOMUtility } from "../utils/dom";

export enum GridDrawingStyle {
  CELL_WIDTH,
  CELL_COUNT
}

export class GridService {
  private gridWidthOrCount: number;
  private gridHeightOrCount: number;

  private drawingStyle: GridDrawingStyle = GridDrawingStyle.CELL_WIDTH;
  private grayScaleGridLineColor: number = 190;
  public canvas: fabric.Canvas;

  public setXY(gridWidthOrCount: number, gridHeightOrCount: number) {
    this.gridWidthOrCount = gridWidthOrCount;
    this.gridHeightOrCount = gridHeightOrCount;
  }


  // https://codepen.io/Ben_Tran/pen/YYYwNL
  public drawGrid() {
    if (!this.canvas) {
      console.error('canvas not set');
      return;
    }

    for (var i = 0; i < (this.DOMCanvas.width / this.gridWidthOrCount); i++) {
      this.canvas.add(new fabric.Line([i * this.gridHeightOrCount, 0, i * this.gridHeightOrCount, this.DOMCanvas.height], this.properties));
      this.canvas.add(new fabric.Line([0, i * this.gridWidthOrCount, this.DOMCanvas.width, i * this.gridWidthOrCount], this.properties))
    }

    this.canvas.renderAll();
  }

  protected get properties() {
    return {
      type: 'line',
      stroke: '#ccc',
      selectable: false
    };
  }

  protected get DOMCanvas() {
    return this.canvas.getContext().canvas;
  }

  protected get cellWidth() {
    return this.canvas.width / this.gridWidthOrCount;
  }

  protected get cellHeight() {
    return this.canvas.height / this.gridHeightOrCount;
  }

  public snapXTo(xPoint) {

    // return Math.round(leftXPoint / this.cellWidth) % this.cellWidth == 0 ? LeftPoint : xPoint;


    // subtract offset (to center lines)
    // divide by grid to get row/column
    // round to snap to the closest one
    var cell = Math.round((xPoint - 20) / this.cellWidth);
    // multiply back to grid scale
    // add offset to center
    return (cell * this.cellWidth) + 20;

  }

  public snapYTo(yPoiny) {
    // subtract offset (to center lines)
    // divide by grid to get row/column
    // round to snap to the closest one
    var cell = Math.round((yPoiny - 20) / this.cellHeight);
    // multiply back to grid scale
    // add offset to center
    return cell * this.cellHeight + 20;

  }

}