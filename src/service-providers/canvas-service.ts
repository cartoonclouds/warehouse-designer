import { IEventAggregator, EventAggregator, IDisposable, DI, singleton } from "aurelia";
import { AddHardwareDrawingMode } from '../components/warehouse-floor/drawing-modes/add-hardware-mode';
import { DeleteHardwareDrawingMode } from "../components/warehouse-floor/drawing-modes/delete-hardware-mode";
import { SelectionDrawingMode } from "../components/warehouse-floor/drawing-modes/selection-mode";
import { isRack } from "../hardware-types";
import { DrawMode, HardwareSelected, UpdateDrawMode, DeleteHardware } from "../messages/messages";
import { GridUtility } from "../utils/grid-utility";
import { observable } from '@aurelia/runtime';
import FloorSeeder from "../utils/floor-seeder";
import { Rack, Shelf } from "../models";
import { Hardware } from "../models/hardware";
import { fabric } from "fabric";

@singleton()
export default class CanvasService {

  @observable private drawingMode: DrawMode;
  private drawingModeHandler;

  private altKeyPressed: boolean = false;

  // Event subscriptions
  private messageSubscriptions: IDisposable[] = [];
  private DOMEventListeners = new Map<keyof DocumentEventMap, EventListener>();

  private _canvas: fabric.Canvas;
  public get canvas() {
    return this._canvas;
  }

  constructor(
    @IEventAggregator private readonly eventAggregator: EventAggregator,

    //DrawingModeBehaviours
    private readonly addHardwareDrawingMode: AddHardwareDrawingMode,
    private readonly deleteHardwareDrawingMode: DeleteHardwareDrawingMode,
    private readonly selectionDrawingMode: SelectionDrawingMode,
  ) { }

  public attach(element: HTMLCanvasElement | string | null, options?: fabric.ICanvasOptions) {
    this._canvas = new fabric.Canvas(element, options);

    this.addHardwareDrawingMode.attachCanvasService(this);
    this.deleteHardwareDrawingMode.attachCanvasService(this);
    this.selectionDrawingMode.attachCanvasService(this);

    this.attachEvents();
    this.attachKeyEvents();
    this.attachSubscriptions();

    this.drawingModeChanged();


    const gridUtility = new GridUtility(this.DOMCanvas.width, this.DOMCanvas.height);
    gridUtility.setXY(40, 40);
    this.canvas.add(...gridUtility.generateGrid());


    //@TODO For testing purposes
    this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));
    (new FloorSeeder(this.drawingModeHandler, this.eventAggregator)).seed();


    this.canvas.renderAll();
  }

  public static get instance() {
    const container = DI.createContainer({
      inheritParentResources: true
    });

    return container.get(CanvasService);
  }

  public get DOMCanvas(): HTMLCanvasElement {
    return this.canvas.getContext().canvas;
  }

  public get CanvasContext(): CanvasRenderingContext2D {
    return this.canvas.getContext();
  }


  public drawingModeChanged() {
    this.drawingModeHandler?.unload();

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        this.drawingModeHandler = this.addHardwareDrawingMode;
        break;

      case DrawMode.SELECTION:
        this.drawingModeHandler = this.selectionDrawingMode;

        break;

      case DrawMode.DELETE_HARDWARE:
        this.drawingModeHandler = this.deleteHardwareDrawingMode;

        break;
    }

    this.canvas.renderAll();
  }


  private attachSubscriptions() {
    this.messageSubscriptions.push(
      this.eventAggregator.subscribe(UpdateDrawMode, (message: UpdateDrawMode) => {
        this.drawingMode = message.mode;
      }),

      this.eventAggregator.subscribe(HardwareSelected, (message: HardwareSelected) => {
        this.canvas.setActiveObject(message.hardware as fabric.Object);
      }),

      this.eventAggregator.subscribe(DeleteHardware, (message: DeleteHardware) => {
        this.drawingModeHandler.deleteHardware(message.hardware);
      })
    );
  }


  public detach() {
    this.canvas.off('mouse:up');
    this.canvas.off('mouse:move');

    this.messageSubscriptions.forEach((s: IDisposable) => s.dispose());
    this.messageSubscriptions = null;

    for (let [event, listener] of this.DOMEventListeners) {
      document.removeEventListener(event, listener);
    }

    this.DOMEventListeners = null;
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



  public renderAll(withFabricObject?: fabric.Object | fabric.Object[]): fabric.Canvas {
    if (withFabricObject) {
      (Array.isArray(withFabricObject) ? withFabricObject : [withFabricObject])
        .forEach(o => o.render(this.canvas.getContext())
        );
    }

    return this.canvas.renderAll();
  }

  public setCursorType(type, cursor) {
    this.canvas[`${type}Cursor`] = cursor;
  }

  public setCursor(cursor) {
    this.canvas.setCursor(cursor);
  }

  public get width() {
    return this.canvas.width;
  }

  public get height() {
    return this.canvas.height;
  }

  public get racks() {
    return this.canvas?.getObjects(Rack.type);
  }

  public get shelves() {
    return this.canvas?.getObjects(Shelf.type);
  }

  public getAllHardware() {
    const hardwares = [];

    hardwares.push(...(this.racks || []));
    hardwares.push(...(this.shelves || []));

    return hardwares;
  }

  public getAllHardwareExcept(hardware: Hardware) {
    return this.getAllHardware().filter((h: Hardware) => h !== hardware);
  }

  public get defaultRackLabel() {
    return `Rack-${this.racks?.length + 1}`;
  }
}