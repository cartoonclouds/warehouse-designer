import { EventAggregator, IEventAggregator, IDisposable, inject } from "aurelia";

import p5js from "p5";
import { GridService } from "./service-providers/grid-service";
import { WarehouseService } from "./service-providers/warehouse-service";
import { DrawMode, UpdateDrawMode } from './messages/messages';
import { observable } from '@aurelia/runtime';
import { DOMUtility } from './utils/dom';

@inject()
export class App {
  public static readonly InfoBarHeight = 104;


  public static p5: p5;
  protected canvas;
  protected gridServiceProvider: GridService;
  protected updateDrawModeSubscription: IDisposable;

  @observable protected drawingMode: DrawMode = DrawMode.SELECTION;

  constructor(
    protected readonly element: HTMLElement,
    protected readonly warehouseService: WarehouseService,
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) { }


  public binding() {
    this.updateDrawModeSubscription = this.eventAggregator.subscribe(UpdateDrawMode, (message: UpdateDrawMode) => {
      this.drawingMode = message.mode;

      console.log(`App > Message.UpdateDrawMode(${this.drawingMode})`);
    });
  }

  public unbinding() {
    this.warehouseService.unsubscribe();
    this.updateDrawModeSubscription.dispose();
  }

  public attached() {
    this.warehouseService.subscribe();

    App.p5 = new p5js(this.sketch, this.element.querySelector("floor"));

    this.gridServiceProvider = new GridService(App.p5, 40, 40);
  }

  public detached() {
    App.p5 = null;
    this.canvas = null;
  }


  // https://p5js.org/learn/interactivity.html
  // https://p5js.org/reference/#/p5/mouseWheel

  //p5.ellipse(p5.mouseX, p5.mouseY, 80, 80);

  public drawingModeChanged(newDrawMode: DrawMode) {
    if (!App.p5) {
      return;
    }

    if (newDrawMode === DrawMode.ADD_RACK) {
      App.p5.loop();
    } else {
      App.p5.noLoop();
    }
  }

  /**
   * Draw canvas warehouse floor.
   * 
   * @param p5 
   * @returns 
   */
  protected draw(p5) {
    return () => {
      // draw grid
      this.gridServiceProvider.drawGrid();

      // draw created hardward objects
      this.warehouseService.drawFloor(p5);

      // trigger draw on hover of warehouse floor
      this.warehouseService.warehouseHover(p5);

      // console.log('App > Draw()');
    };
  }

  /**
   * Create canvas setup callback.
   * 
   * @param p5 
   * @returns 
   */
  protected setup(p5) {
    return () => {
      // create the canvas
      this.canvas = p5.createCanvas(p5.windowWidth, (DOMUtility.boundingHeight() - App.InfoBarHeight));

      // attached on mouse-clicked event to warehouse floor
      this.canvas.mouseClicked((event) => {
        this.warehouseService.onMouseClicked(p5, event);
      });

      this.canvas.mouseMoved((event) => {
        this.warehouseService.onMouseOver(p5, event);
      })

      p5.noLoop();
    };
  }

  public onKeyPressed(p5: p5) {
    return () => {
      this.warehouseService.onKeyPressed(p5);


      console.log('App > onKeyPressed()');
    }
  }


  public onKeyRelease(p5: p5) {
    return () => {
      this.warehouseService.onKeyRelease(p5);


      console.log('App > onKeyRelease()');
    }
  }


  /**
   * Setup canvas sketch.
   */
  protected get sketch() {
    return (p5) => {
      //p5.preload = this.preload();

      p5.setup = this.setup(p5);

      p5.draw = this.draw(p5);

      p5.keyPressed = this.onKeyPressed(p5);

      p5.keyReleased = this.onKeyRelease(p5);


      // p5.windowResized = this.windowResized(p5);

      //p5.remove = this.remove();
    };
  }





  // protected windowResized(p5) {
  //   return function () {
  //     p5.resizeCanvas(this.boundingWidth, this.boundingHeight);
  //   };
  // }

  // public p5Changed(newInstance) {
  //   // this.gridServiceProvider.p5 = newInstance;
  // }
}
