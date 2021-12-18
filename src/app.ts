import { inject } from "aurelia";
import p5js from "p5";
import { WarehouseServiceProvider } from "./service-providers/warehouse-service-provider";

@inject()
export class App {
  private p5: p5;
  private canvas;

  constructor(private readonly element: HTMLElement, private readonly warehouseServiceProvider: WarehouseServiceProvider) { }

  public attached() {
    this.p5 = new p5js(this.sketch, this.element.querySelector('floor'));
  }

  public detached() {
    this.p5 = null;
    this.canvas = null;
  }

  private get boundingHeight(): number {
    return (document.querySelector('sidebar') as HTMLElement).offsetHeight;
  }

  private get boundingWidth(): number {
    return window.innerWidth;
  }

  public initDraw(p5) {
    p5.background(220);
    if (p5.mouseIsPressed) {
      p5.fill(0);
    } else {
      p5.fill(255); 10
    }

    p5.ellipse(p5.mouseX, p5.mouseY, 80, 80);
  }


  private get sketch() {
    const instance = this;

    return (p5) => {
      //preload()
      p5.setup = function () {
        // instance.canvas = p5.createCanvas(instance.boundingWidth, instance.boundingHeight);
        instance.canvas = p5.createCanvas(1200, 550);
      }

      p5.draw = function () {
        instance.initDraw(p5);
        instance.warehouseServiceProvider.drawFloor(p5);
      };

      p5.windowResized = function () {
        p5.resizeCanvas(instance.boundingWidth, instance.boundingHeight);
      }
      //remove()
    };
  }
}
