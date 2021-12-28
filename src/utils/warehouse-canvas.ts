import { EventAggregator, IEventAggregator, IDisposable, inject } from "aurelia";
import { Rack } from "../components";
import { DrawMode, CreateRack, UpdateDrawMode, DeleteRack } from '../messages/messages';
import { observable } from '@aurelia/runtime';
import { IRack, ShadowRack } from '../components/p5-elements/rack/rack';
import { isRack, isShadowRack } from '../hardware-types';
import { fabric } from 'fabric';
import StateManager from "./state-manager";
import { ICanvasOptions } from "fabric/fabric-impl";

interface IWarehouseCanvas {
  element: HTMLCanvasElement | string | null,
  eventAggregator: EventAggregator,
}

export class WarehouseCanvas extends fabric.Canvas {
  protected shadowRack: ShadowRack;
  protected eventAggregator: EventAggregator;

  @observable protected selectedHardware: Rack;
  @observable protected drawingMode: DrawMode = DrawMode.SELECTION;
  protected altKeyPressed: boolean = false;

  // Event subscriptions
  protected updateDrawModeSubscription: IDisposable;
  protected createRackSubscription: IDisposable;
  protected deleteRackSubscription: IDisposable;
  protected stateManager: StateManager;


  constructor(
    warehouseOptions: IWarehouseCanvas,
    fabricOptions?: ICanvasOptions
  ) {
    super(warehouseOptions.element, fabricOptions);

    this.eventAggregator = warehouseOptions.eventAggregator;

    this.subscribe();
    this.attachEvents();
  }

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

  public attachEvents() {
    // add mouse events
    this.on('mouse:up', this.onMouseUp.bind(this));

    this.on('mouse:move', this.onMouseMove.bind(this));

    // add key events
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this.onKeyDown(e);
    });

    document.addEventListener('keyup', (e: KeyboardEvent) => {
      this.onKeyUp(e);
    });
    // this.stateManager = new StateManager(this);
  }


  public onMouseMove(options: fabric.IEvent<MouseEvent>) {
    // this.setCursor(this.defaultCursor);

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        // this.setCursor(this.moveCursor);

        this.drawShadowRack(options);

        break;

      case DrawMode.SELECTION:
      case DrawMode.DELETE_HARDWARE:
        // this.setCursor(this.hoverCursor);

        if (this.shadowRack) {
          this.deleteRack(this.shadowRack);
          this.shadowRack = null;
        }

        break;

      default:
        console.error(`Unhandled WarehouseService.onMouseOver() drawing mode ${this.drawingMode}`);
    }

    this.renderAll();
  }


  public onMouseUp(options: fabric.IEvent<MouseEvent>) {
    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:

        const shadowRackIntersects = this.getObjects('Rack').some((r: Rack) => {
          return this.shadowRack.intersectsRect(r);
        });

        if (!shadowRackIntersects && this.shadowRack) {
          this.createRack(this.shadowRack);
        }

        break;

      case DrawMode.SELECTION:
        this.selectedHardware = options.target as any;
        break;

      case DrawMode.DELETE_HARDWARE:
        this.deleteRack(options.target as Rack);

        break;

      default:
        console.error(`Unhandled WarehouseService.onMouseOver() drawing mode ${this.drawingMode}`);
    }

    this.renderAll();
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
    }, this);

    this.add(newRack);

    this.drawingModeChanged();

    console.log(`Rack count #${this.racks.length}`, this.racks);

    console.log(`WarehouseService > addRack(${newRack.label})`);
  }


  public deleteRack(deleteRack: Rack) {
    console.log(`WarehouseService > deleteRack(${deleteRack.label})`);

    this.remove(deleteRack);
  }

  protected drawShadowRack(options: fabric.IEvent<MouseEvent>) {
    const mousePosition = this.getPointer(options.e);

    if (!this.shadowRack) {
      this.shadowRack = new ShadowRack({
        label: `ShadowRack`
      }, this);

      this.add(this.shadowRack);
    }


    let constrainedX = mousePosition.x;
    constrainedX = Math.max(0, constrainedX - (this.shadowRack.width / 2));
    constrainedX = Math.min(constrainedX, this.DOMCanvas.width - this.shadowRack.width)

    let constrainedY = mousePosition.y;
    constrainedY = Math.max(0, constrainedY - (this.shadowRack.height / 2));
    constrainedY = Math.min(constrainedY, this.DOMCanvas.height - this.shadowRack.height)

    // if (Math.round((mousePosition.x - 20) / 40) % 4 == 0 && Math.round((mousePosition.y - 20) / 40) % 4 == 0) {
    this.shadowRack.set({
      left: constrainedX,
      top: constrainedY
    });
    // }


    this.shadowRack.bringToFront();

    const shadowRackIntersects = this.getObjects('Rack').some((r: Rack) => {
      return this.shadowRack.intersectsRect(r);
    });

    if (shadowRackIntersects) {
      //cannot create rack on top on another
      this.setCursor(this.notAllowedCursor);
    } else {
      this.setCursor(this.defaultCursor);
    }

    this.shadowRack.setCoords();
  }


  public get racks() {
    return this?.getObjects("Rack") || [];
  }


  public selectedHardwareChanged() {
    //draw options
  }


  public drawingModeChanged() {
    let selection = false;

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        selection = false;
        this.selectedHardware = null;

        break;

      case DrawMode.SELECTION:
        selection = true;

        break;

      case DrawMode.DELETE_HARDWARE:
        selection = true;
        this.selectedHardware = null;

        break;
    }

    this.racks.forEach((rack: Rack) => {
      rack.selectable = selection;
    });
  }

  public get DOMCanvas(): HTMLCanvasElement {
    return this.getContext().canvas;
  }

  public get CanvasContext(): CanvasRenderingContext2D {
    return this.getContext();
  }


  public onKeyDown(keyboardEvent: KeyboardEvent) {
    switch (keyboardEvent.code) {
      case "Delete":
        if (isRack(keyboardEvent.target)) {
          this.deleteRack(keyboardEvent.target);
        }
        break;

      case "AltLeft":
      case "AltRight":
        this.altKeyPressed = true;

        break;
    }

    console.log(`WarehouseService > onKeyDown(${keyboardEvent.code})`);
  }

  public onKeyUp(keyboardEvent: KeyboardEvent) {
    if (!this.altKeyPressed) return;

    switch (keyboardEvent.code) {

      case "KeyR":

        this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_RACK));

        break;

      case "KeyH":

        this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_SHELF));

        break;

      case "KeyS":

        this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));

        break;
    }

    this.altKeyPressed = false;


    console.log(`WarehouseService > onKeyUp(${keyboardEvent.code})`);
  }


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

}