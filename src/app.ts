import { inject } from "aurelia";
import p5js from "p5";
import { WarehouseServiceProvider } from "./service-providers/warehouse-service-provider";

@inject()
export class App {
  private p5: p5;
  private canvas: HTMLCanvasElement;
  private readonly grayScaleGridLineColor: number = 190;
  private readonly gridCellWidth: number = 40;
  private readonly gridCellHeight: number = 40;

  constructor(
    private readonly element: HTMLElement,
    private readonly warehouseServiceProvider: WarehouseServiceProvider
  ) { }

  public attached() {
    this.p5 = new p5js(this.sketch, this.element.querySelector("floor"));
  }

  public detached() {
    this.p5 = null;
    this.canvas = null;
  }

  private draw(p5) {
    return () => {
      p5.background(220);

      this.drawGrid();

      if (p5.mouseIsPressed) {
        p5.fill(0);
      } else {
        p5.fill(255);
        10;
      }

      p5.ellipse(p5.mouseX, p5.mouseY, 80, 80);

      this.warehouseServiceProvider.drawFloor(p5);
    };
  }

  private setup(p5) {
    return () => {
      this.canvas = p5.createCanvas(this.boundingWidth, (this.boundingHeight - 100));
    };
  }

  private windowResized(p5) {
    return function () {
      p5.resizeCanvas(this.boundingWidth, this.boundingHeight);
    };
  }

  private drawGrid() {
    this.p5.push();

    for (let x = 0; x < this.p5.width; x += this.gridCellWidth) {
      for (let y = 0; y < this.p5.height; y += this.gridCellHeight) {
        this.p5.stroke(this.grayScaleGridLineColor);
        this.p5.strokeWeight(1);
        this.p5.line(x, 0, x, this.p5.height);
        this.p5.line(0, y, this.p5.width, y);
      }
    }

    this.p5.pop();
  }

  private get sketch() {
    return (p5) => {
      //p5.preload = this.preload();

      p5.setup = this.setup(p5);

      p5.draw = this.draw(p5);

      p5.windowResized = this.windowResized(p5);

      //p5.remove = this.remove();
    };
  }

  private get boundingHeight(): number {
    return window.innerHeight;
    return (document.querySelector("sidebar") as HTMLElement).offsetHeight;
  }

  private get boundingWidth(): number {
    return window.innerWidth;
  }
}
