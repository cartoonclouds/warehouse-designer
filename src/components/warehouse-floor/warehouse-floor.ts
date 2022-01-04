import { EventAggregator, IEventAggregator, IDisposable, inject } from "aurelia";
import { observable } from '@aurelia/runtime';
import { fabric } from 'fabric';
import { isRack } from "../../hardware-types";
import { DrawMode, HardwareSelected, UpdateDrawMode, DeleteHardware } from '../../messages/messages';
import { GridService } from "../../service-providers/grid-service";
import { DOMUtility } from "../../utils/dom";
import { App } from "../../app";
import { SelectionDrawingMode } from './drawing-modes/selection-mode';
import { AddHardwareDrawingMode, _AddHardwareDrawingMode } from "./drawing-modes/add-hardware-mode";
import { DeleteHardwareDrawingMode } from "./drawing-modes/delete-hardware-mode";
import FloorSeeder from "../../utils/floor-seeder";
import { HardwareType } from "../../models/hardware";

@inject()
export class WarehouseFloor {
  protected canvas: fabric.Canvas;

  @observable protected drawingMode: DrawMode;
  protected drawingModeHandler;

  protected altKeyPressed: boolean = false;

  // Event subscriptions
  protected messageSubscriptions: IDisposable[] = [];
  protected DOMEventListeners = new Map<string, EventListener>();

  constructor(
    protected readonly element: HTMLElement,
    protected readonly gridService: GridService,
    @IEventAggregator protected readonly eventAggregator: EventAggregator) { }


  public attached() {
    this.canvas = new fabric.Canvas(
      this.element.querySelector('#warehouuse-floor') as HTMLCanvasElement, {
      selection: false,
      width: DOMUtility.boundingWidth(),
      height: (DOMUtility.boundingHeight() - App.InfoBarHeight)
    });

    this.gridService.canvas = this.canvas;
    this.gridService.setXY(40, 40);
    this.gridService.drawGrid();

    this.attachEvents();
    this.attachKeyEvents();
    this.attachSubscriptions();


    this.drawingModeChanged();

    //@TODO For testing purposes
    this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));
    (new FloorSeeder(this.canvas, this.drawingModeHandler, this.gridService, this.eventAggregator)).seed();

  }

  public drawingModeChanged() {
    if (!this.canvas || !this.gridService || !this.eventAggregator) {
      return;
    }

    this.drawingModeHandler?.unload();

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        this.drawingModeHandler = AddHardwareDrawingMode.getInstance(this.canvas, this.gridService, this.eventAggregator);
        break;

      case DrawMode.SELECTION:
        this.drawingModeHandler = SelectionDrawingMode.getInstance(this.canvas, this.gridService, this.eventAggregator);

        break;

      case DrawMode.DELETE_HARDWARE:
        this.drawingModeHandler = DeleteHardwareDrawingMode.getInstance(this.canvas, this.gridService, this.eventAggregator);

        break;
    }

    this.canvas.renderAll();
  }


  protected attachSubscriptions() {
    this.messageSubscriptions.push(
      this.eventAggregator.subscribe(HardwareSelected, (message: HardwareSelected) => {
        this.canvas.setActiveObject(message.hardware as fabric.Object);
      }),
      this.eventAggregator.subscribe(UpdateDrawMode, (message: UpdateDrawMode) => {
        this.drawingMode = message.mode;
      }),
      this.eventAggregator.subscribe(DeleteHardware, (message: DeleteHardware) => {
        this.drawingModeHandler.deleteHardware(message.hardware);
      })
    );
  }



  public attachEvents() {
    this.canvas.off('mouse:up');
    this.canvas.off('mouse:move');

    // add mouse events
    this.canvas.on('mouse:up', (e) => {
      this.drawingModeHandler?.onMouseUp(e);
    });

    this.canvas.on('mouse:move', (e) => {
      this.drawingModeHandler?.onMouseMove(e);
    });
  }


  public attachKeyEvents() {
    // add key events
    const onKeyDownEventListener = (e: KeyboardEvent) => {
      this.onKeyDown(e);
    };
    this.DOMEventListeners.set('keydown', onKeyDownEventListener);
    document.addEventListener('keydown', onKeyDownEventListener);

    const onKeyUpEventListener = (e: KeyboardEvent) => {
      this.onKeyUp(e);
    };
    this.DOMEventListeners.set('keyup', onKeyUpEventListener);
    document.addEventListener('keyup', onKeyUpEventListener);
  }

  public onKeyDown(keyboardEvent: KeyboardEvent) {
    const selectedHardware = this.canvas.getActiveObject();

    switch (keyboardEvent.code) {
      case "Delete":
        if (isRack(selectedHardware)) {
          this.drawingModeHandler.DeleteHardware(selectedHardware);
        }
        break;

      case "AltLeft":
      case "AltRight":
        this.altKeyPressed = true;

        break;
    }
  }

  public onKeyUp(keyboardEvent: KeyboardEvent) {
    if (!this.altKeyPressed) return;

    switch (keyboardEvent.code) {

      case "KeyR":
        this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_RACK));
        break;

      case "KeyS":
        this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));
        break;
    }

    this.altKeyPressed = false;
  }

  public detached() {
    this.canvas.off('mouse:up');
    this.canvas.off('mouse:move');

    this.messageSubscriptions.forEach((s: IDisposable) => s.dispose());
    this.messageSubscriptions = null;

    for (let [event, listener] of this.DOMEventListeners) {
      document.removeEventListener(event, listener);
    }
    this.DOMEventListeners = null;
  }

}