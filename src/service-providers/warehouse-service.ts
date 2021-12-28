import { EventAggregator, IEventAggregator, IDisposable, inject } from "aurelia";
import { Hardware, Rack } from "../components";
import { DrawMode, CreateRack, UpdateDrawMode, DeleteRack } from '../messages/messages';
import { observable } from '@aurelia/runtime';
import { IRack, ShadowRack } from '../components/p5-elements/rack/rack';
import { Point, isShadowRack, isRack } from '../hardware-types';
import { fabric } from 'fabric';
import StateManager from "../utils/state-manager";

@inject()
export class WarehouseService {
  @observable public warehouseCanvas: fabric.Canvas;

  protected shadowRack: ShadowRack;

  @observable protected drawingMode: DrawMode = DrawMode.SELECTION;
  protected altKeyPressed: boolean = false;

  protected updateDrawModeSubscription: IDisposable;
  protected createRackSubscription: IDisposable;
  protected deleteRackSubscription: IDisposable;
  protected stateManager: StateManager;

  constructor(
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) { }

  public subscribe() {
    this.updateDrawModeSubscription = this.eventAggregator.subscribe(UpdateDrawMode, (message: UpdateDrawMode) => {
      this.drawingMode = message.mode;

      console.log(`WarehouseService > Message.UpdateDrawMode(${this.drawingMode})`);
    });

    this.createRackSubscription = this.eventAggregator.subscribe(CreateRack, (message: CreateRack) => {
      console.log(`WarehouseService > Message.CreateRack()`);
    });

    this.deleteRackSubscription = this.eventAggregator.subscribe(DeleteRack, (message: DeleteRack) => {
      this.deleteRack(message.rack);

      console.log(`WarehouseService > Message.DeleteRack()`);
    });
  }

  public unsubscribe() {
    this.updateDrawModeSubscription.dispose();
    this.createRackSubscription.dispose();
    this.deleteRackSubscription.dispose();
  }

  public drawingModeChanged() {
    let selectable = true;

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        selectable = false;

        break;

      case DrawMode.SELECTION:
      case DrawMode.DELETE_HARDWARE:
        selectable = true;

        break;
    }

    this.racks.forEach((targ) => {
      targ.selectable = selectable;
    });
  }

  public setWarehouseCanvas(warehouseCanvas) {
    this.warehouseCanvas = warehouseCanvas;

    this.warehouseCanvas.on('mouse:down', (options) => {
      this.onMouseDown(options);
    });

    this.warehouseCanvas.on('mouse:move', (options) => {
      this.onMouseMove(options);
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (isRack(e.target)) {
        switch (e.code) {
          case "Delete":
            this.deleteRack(e.target);
            break;
        }
      }
    });

    this.stateManager = new StateManager(this.warehouseCanvas);
  }

  public onMouseMove(options: fabric.IEvent<MouseEvent>) {
    this.warehouseCanvas.setCursor(this.warehouseCanvas.defaultCursor);

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        this.warehouseCanvas.setCursor(this.warehouseCanvas.moveCursor);

        this.drawShadowRack(options);

        break;

      case DrawMode.SELECTION:
      case DrawMode.DELETE_HARDWARE:
        this.warehouseCanvas.setCursor(this.warehouseCanvas.hoverCursor);

        if (this.shadowRack) {
          this.deleteRack(this.shadowRack);
          this.shadowRack = null;
        }

        break;

      default:
        console.error(`Unhandled WarehouseService.onMouseOver() drawing mode ${this.drawingMode}`);
    }

    this.warehouseCanvas.requestRenderAll();
  }


  public onMouseDown(options: fabric.IEvent<MouseEvent>) {
    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        console.log(options.currentSubTargets);
        if (options.target && options.subTargets.length && this.shadowRack.intersectsWithObject(options.subTargets[0])) {
          //cannot create rack on top on another
          this.shadowRack.bringToFront();

          console.log(`Intersectiong object`, options.subTargets[0]);
        }

        this.createRack(this.shadowRack);

        break;

      case DrawMode.SELECTION:
        break;

      case DrawMode.DELETE_HARDWARE:
        this.deleteRack(options.target as Rack);

        break;

      default:
        console.error(`Unhandled WarehouseService.onMouseOver() drawing mode ${this.drawingMode}`);
    }

    this.warehouseCanvas.requestRenderAll();
  }

  protected get warehouseCanvasEl() {
    return this.warehouseCanvas.getContext().canvas;
  }

  public get racks() {
    return this.warehouseCanvas?.getObjects("Rack") || [];
  }

  /**
   * Adds a rack to the list of created racks.
   * @param rackDetails 
   */
  public createRack(rackDetails?: Partial<IRack>) {
    const newRack = new Rack({
      label: `Rack-${this.racks.length + 1}`,
      type: Rack.type,
      left: rackDetails.left,
      top: rackDetails.top
    }, this.warehouseCanvas);

    this.warehouseCanvas.add(newRack);

    // this.drawingModeChanged();

    console.log(`Rack count #${this.racks.length}`, this.racks);

    console.log(`WarehouseService > addRack(${newRack.label})`);
  }


  public deleteRack(deleteRack: Rack) {
    console.log(`WarehouseService > deleteRack(${deleteRack.label})`);

    this.warehouseCanvas.remove(deleteRack);
  }

  protected drawShadowRack(options: fabric.IEvent<MouseEvent>) {
    const mousePosition = this.warehouseCanvas.getPointer(options.e);

    if (!this.shadowRack) {
      this.shadowRack = new ShadowRack({
        label: `ShadowRack`
      }, this.warehouseCanvas);

      this.warehouseCanvas.add(this.shadowRack);
    }

    let constrainedX = Math.max(0, mousePosition.x - (this.shadowRack.width / 2));
    constrainedX = Math.min(constrainedX, this.warehouseCanvasEl.width - this.shadowRack.width)

    let constrainedY = Math.max(0, mousePosition.y - (this.shadowRack.height / 2));
    constrainedY = Math.min(constrainedY, this.warehouseCanvasEl.height - this.shadowRack.height)

    this.shadowRack.set('left', constrainedX);
    this.shadowRack.set('top', constrainedY);

    this.shadowRack.bringToFront();

    // if (options.target && this.shadowRack.intersectsWithObject(options.target, false, true)) {
    //   //cannot create rack on top on another
    //   this.warehouseCanvas.setCursor(this.warehouseCanvas.notAllowedCursor);
    // } else {
    //   this.warehouseCanvas.setCursor(this.warehouseCanvas.defaultCursor);
    // }

    this.shadowRack.setCoords();
  }

  // public onKeyPressed() {
  //   this.altKeyPressed = this.altKeyPressed || WarehouseService.p5.key == "Alt";


  //   console.log(`WarehouseService > onKeyPressed(${WarehouseService.p5.key})`);
  // }

  // public onKeyRelease() {

  //   if (!this.altKeyPressed) {
  //     return;
  //   }

  //   switch (WarehouseService.p5.key) {
  //     case "R":
  //     case "r":

  //       this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_RACK));

  //       break;

  //     case "H":
  //     case "h":

  //       this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_SHELF));

  //       break;

  //     case "S":
  //     case 's':

  //       this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));

  //       break;

  //     case "D":
  //     case 'd':

  //       this.eventAggregator.publish(new UpdateDrawMode(DrawMode.DELETE_HARDWARE));

  //       break;
  //   }

  //   this.altKeyPressed = false;


  //   console.log(`WarehouseService > onKeyRelease(${WarehouseService.p5.key})`);
  // }

  // protected get mouseCoords() {
  //   return MouseUtility.coords(WarehouseService.p5);
  // }


  // public checkShadowHardwardIntersecting() {
  //   this.shadowRack.isIntersected = false;

  //   this.racks.forEach((rack: Rack) => {
  //     rack.isIntersected = false;

  //     if (rack.intersects(this.shadowRack)) {
  //       let isIntersecting = this.shadowRack.intersects(rack);

  //       this.shadowRack.isIntersected = isIntersecting;
  //       rack.isIntersected = isIntersecting;

  //       if (isIntersecting) {
  //         console.log(`${this.shadowRack.label} intersects with ${rack.label}`)
  //       }
  //     }
  //   });

  // }


  // public getHardwareAtCursor() {
  //   for (const rack of this.racks) {
  //     if (rack.contains(this.mouseCoords)) {
  //       return rack;
  //     }
  //   }
  //   return null;
  // }

}