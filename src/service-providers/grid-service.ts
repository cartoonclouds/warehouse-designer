
import { fabric } from "fabric";
import { App } from "../app";
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
  private warehouseCanvas: fabric.Canvas;

  constructor(warehouseCanvas, gridWidthOrCount: number, gridHeightOrCount: number) {
    this.warehouseCanvas = warehouseCanvas;
    this.gridWidthOrCount = gridWidthOrCount;
    this.gridHeightOrCount = gridHeightOrCount;
  }


  // https://codepen.io/Ben_Tran/pen/YYYwNL
  public drawGrid() {
    if (!this.warehouseCanvas) {
      console.error('warehouseCanvas not set');
      return;
    }


    for (var i = 0; i < (this.warehouseCanvasEl.width / this.gridWidthOrCount); i++) {
      this.warehouseCanvas.add(new fabric.Line([i * this.gridHeightOrCount, 0, i * this.gridHeightOrCount, this.warehouseCanvasEl.height], { type: 'line', stroke: '#ccc', selectable: false }));
      this.warehouseCanvas.add(new fabric.Line([0, i * this.gridWidthOrCount, this.warehouseCanvasEl.width, i * this.gridWidthOrCount], { type: 'line', stroke: '#ccc', selectable: false }))
    }
  }

  protected get warehouseCanvasEl() {
    return this.warehouseCanvas.getContext().canvas;
  }

  protected get cellWidth() {
    return this.warehouseCanvas.width / this.gridWidthOrCount;
  }

  protected get cellHeight() {
    return this.warehouseCanvas.height / this.gridHeightOrCount;
  }

  public snapTo(location) {
    // subtract offset (to center lines)
    // divide by grid to get row/column
    // round to snap to the closest one
    var cell = Math.round(location / this.cellWidth);
    // multiply back to grid scale
    // add offset to center
    return cell * this.cellWidth;

  }
}