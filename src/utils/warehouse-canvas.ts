import { EventAggregator, IEventAggregator, IDisposable, inject } from "aurelia";
import { Rack } from "../components";
import { DrawMode, UpdateDrawMode, DeleteRack, HardwareDeselected, HardwareSelected } from '../messages/messages';
import { observable } from '@aurelia/runtime';
import { IRack, ShadowRack } from '../components/hardware/rack/rack';
import { isRack, isShadowRack } from '../hardware-types';
import { fabric } from 'fabric';
import StateManager from "./state-manager";
import { ICanvasOptions } from "fabric/fabric-impl";
import { GridService } from "../service-providers/grid-service";
import { DOMUtility } from "./dom";

interface IWarehouseCanvas {
  element: HTMLCanvasElement | string | null,
  eventAggregator: EventAggregator,
}

export class WarehouseCanvas extends fabric.Canvas {
  protected shadowRack: ShadowRack;
  protected eventAggregator: EventAggregator;
  protected gridService: GridService;

  @observable protected drawingMode: DrawMode = DrawMode.SELECTION;
  protected altKeyPressed: boolean = false;

  // Event subscriptions
  protected messageSubscriptions: IDisposable[] = [];
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
    this.messageSubscriptions.push(this.eventAggregator.subscribe(HardwareSelected, (message: HardwareSelected) => {
      this.setActiveObject(message.rack);

      console.log(`WarehouseService > Message.HardwareSelected(${this.drawingMode})`);
    }));

    this.messageSubscriptions.push(this.eventAggregator.subscribe(UpdateDrawMode, (message: UpdateDrawMode) => {
      this.drawingMode = message.mode;

      console.log(`WarehouseService > Message.UpdateDrawMode(${this.drawingMode})`);
    }));

    this.messageSubscriptions.push(this.eventAggregator.subscribe(DeleteRack, (message: DeleteRack) => {
      this.deleteRack(message.rack);

      console.log(`WarehouseService > Message.DeleteRack()`);
    }));


    //seed floor
    this.createRack({
      top: 120,
      left: 500,
    });

    const tmpRack = this.createRack({
      top: 120,
      left: 600,
    });

    this.createRack({
      top: 120,
      left: 700,
    });
    this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));
    this.eventAggregator.publish(new HardwareSelected(tmpRack));
  }

  public unsubscribe() {
    this.messageSubscriptions.forEach((s: IDisposable) => s.dispose());
    this.messageSubscriptions = null;
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

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:

        if (!this.shadowRack) {
          this.shadowRack = new ShadowRack({
            label: `ShadowRack`
          }, this);

          this.add(this.shadowRack);
        }

        this.shadowRack.draw(options);

        break;

      case DrawMode.SELECTION:
      case DrawMode.DELETE_HARDWARE:
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

        if (!this.shadowRack?.isIntersecting) {
          this.createRack(this.shadowRack);
        }

        break;

      case DrawMode.SELECTION:
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
      type: Rack.type,
      left: rackDetails.left,
      top: rackDetails.top
    }, this);

    newRack.eventAggregator = this.eventAggregator;

    this.add(newRack);

    this.drawingModeChanged();

    console.log(`Rack count #${this.racks.length}`, this.racks);

    console.log(`WarehouseService > addRack(${newRack.label})`);

    return newRack;
  }


  public deleteRack(deleteRack: Rack) {
    console.log(`WarehouseService > deleteRack(${deleteRack.label})`);

    this.remove(deleteRack);
  }

  public get racks() {
    return this?.getObjects("Rack") || [];
  }


  public drawingModeChanged() {
    // disable interactions if adding racks
    let isSelectable = false;

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        isSelectable = false;
        this.eventAggregator.publish(new HardwareDeselected());

        break;

      case DrawMode.SELECTION:
        isSelectable = true;

        break;

      case DrawMode.DELETE_HARDWARE:
        isSelectable = true;
        this.eventAggregator.publish(new HardwareDeselected());

        break;
    }

    this.racks.forEach((rack: Rack) => {
      rack.selectable = isSelectable;
    });
  }

  public get DOMCanvas(): HTMLCanvasElement {
    return this.getContext().canvas;
  }

  public get CanvasContext(): CanvasRenderingContext2D {
    return this.getContext();
  }


  public onKeyDown(keyboardEvent: KeyboardEvent) {
    const selectedHardware = this.getActiveObject();

    switch (keyboardEvent.code) {
      case "Delete":
        if (isRack(selectedHardware)) {
          console.log('is rack and deleting');
          this.deleteRack(selectedHardware);
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

  public setGridService(gridService: GridService) {
    this.gridService = gridService;
  }

}