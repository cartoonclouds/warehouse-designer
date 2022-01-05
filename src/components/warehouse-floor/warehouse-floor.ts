import { EventAggregator, IEventAggregator, IDisposable, inject } from "aurelia";
import { observable, ObserverLocator } from '@aurelia/runtime';
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
import { Hardware, HardwareType } from "../../models/hardware";
import IContainer from 'aurelia';
import { Rack } from "../../models";
import { Shelf } from '../../models/shelf';

@inject()
export class WarehouseFloor {
  protected static canvas: fabric.Canvas;
  public static eventAggregator: EventAggregator;
  public static observer: ObserverLocator;

  @observable protected drawingMode: DrawMode;
  protected drawingModeHandler;

  protected altKeyPressed: boolean = false;

  // Event subscriptions
  protected messageSubscriptions: IDisposable[] = [];
  protected DOMEventListeners = new Map<string, EventListener>();

  constructor(
    protected readonly element: HTMLElement,
    protected readonly gridService: GridService,
    @IEventAggregator public readonly eventAggregator: EventAggregator,
    protected readonly observerLocator: ObserverLocator
  ) {
    WarehouseFloor.observer = observerLocator;
    WarehouseFloor.eventAggregator = eventAggregator;
  }


  public attached() {
    WarehouseFloor.canvas = new fabric.Canvas(
      this.element.querySelector('#warehouuse-floor') as HTMLCanvasElement, {
      // selection: false,
      preserveObjectStacking: true,
      width: DOMUtility.boundingWidth(),
      height: (DOMUtility.boundingHeight() - App.InfoBarHeight)
    });

    this.gridService.canvas = WarehouseFloor.canvas;
    this.gridService.setXY(40, 40);
    this.gridService.drawGrid();

    this.attachEvents();
    this.attachKeyEvents();
    this.attachSubscriptions();


    this.drawingModeChanged();

    //@TODO For testing purposes
    this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));
    (new FloorSeeder(WarehouseFloor.canvas, this.drawingModeHandler, this.gridService, this.eventAggregator)).seed();

    WarehouseFloor.canvas.renderAll();
  }

  public drawingModeChanged() {
    if (!WarehouseFloor.canvas || !this.gridService || !this.eventAggregator) {
      return;
    }

    this.drawingModeHandler?.unload();

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        this.drawingModeHandler = AddHardwareDrawingMode.getInstance(WarehouseFloor.canvas, this.gridService, this.eventAggregator);
        break;

      case DrawMode.SELECTION:
        this.drawingModeHandler = SelectionDrawingMode.getInstance(WarehouseFloor.canvas, this.gridService, this.eventAggregator);

        break;

      case DrawMode.DELETE_HARDWARE:
        this.drawingModeHandler = DeleteHardwareDrawingMode.getInstance(WarehouseFloor.canvas, this.gridService, this.eventAggregator);

        break;
    }

    WarehouseFloor.canvas.renderAll();
  }


  protected attachSubscriptions() {
    this.messageSubscriptions.push(
      this.eventAggregator.subscribe(HardwareSelected, (message: HardwareSelected) => {
        WarehouseFloor.canvas.setActiveObject(message.hardware as fabric.Object);
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
    WarehouseFloor.canvas.off('mouse:up');
    WarehouseFloor.canvas.off('mouse:move');

    // add mouse events
    WarehouseFloor.canvas.on('mouse:up', (e) => {
      this.drawingModeHandler?.onMouseUp(e);
    });

    WarehouseFloor.canvas.on('mouse:move', (e) => {
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
    const selectedHardware = WarehouseFloor.canvas.getActiveObject();

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
    WarehouseFloor.canvas.off('mouse:up');
    WarehouseFloor.canvas.off('mouse:move');

    this.messageSubscriptions.forEach((s: IDisposable) => s.dispose());
    this.messageSubscriptions = null;

    for (let [event, listener] of this.DOMEventListeners) {
      document.removeEventListener(event, listener);
    }
    this.DOMEventListeners = null;
  }

  public static renderAll(withFabricObject?: fabric.Object | fabric.Object[]): fabric.Canvas {
    if (withFabricObject) {
      (Array.isArray(withFabricObject) ? withFabricObject : [withFabricObject])
        .forEach(o => o.render(WarehouseFloor.canvas.getContext())
        );
    }

    return WarehouseFloor.canvas.renderAll();
  }
  public static setMoveCursor(cursor) {
    WarehouseFloor.canvas.moveCursor = cursor;
  }
  public static setCursor(cursor) {
    WarehouseFloor.canvas.setCursor(cursor);
  }
  public static get width() {
    return WarehouseFloor.canvas.width;
  }
  public static get height() {
    return WarehouseFloor.canvas.height;
  }
  public static get racks() {
    return WarehouseFloor.canvas.getObjects(Rack.type);
  }
  public static get shelves() {
    return WarehouseFloor.canvas.getObjects(Shelf.type);
  }
  public static getAllHardware() {
    const hardwares = [];

    hardwares.push(...(WarehouseFloor.racks || []));
    hardwares.push(...(WarehouseFloor.shelves || []));

    return hardwares;
  }
  public static getAllHardwareExcept(hardware: Hardware) {
    return WarehouseFloor.getAllHardware().filter((h: Hardware) => h !== hardware);
  }
}