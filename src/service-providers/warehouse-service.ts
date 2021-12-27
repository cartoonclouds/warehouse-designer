import { EventAggregator, IEventAggregator, IDisposable, inject } from "aurelia";
import { Hardware, Rack } from "../components";
import { DrawMode, CreateRack, UpdateDrawMode, DeleteRack } from '../messages/messages';
import { observable } from '@aurelia/runtime';
import { ShadowRack } from "../components/p5-elements/rack/rack";
import { Point } from "../hardware-types";
import MouseUtility from "../utils/mouse-service";

@inject()
export class WarehouseService {
  private racks: Rack[] = [];
  private shadowHardware: Hardware;

  @observable public drawingMode: DrawMode = DrawMode.SELECTION;

  protected updateDrawModeSubscription: IDisposable;
  protected createRackSubscription: IDisposable;
  protected deleteRackSubscription: IDisposable;

  constructor(
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) {
  }

  public subscribe() {
    this.updateDrawModeSubscription = this.eventAggregator.subscribe(UpdateDrawMode, (message: UpdateDrawMode) => {
      this.drawingMode = message.mode;

      console.log(`WarehouseService > Message.UpdateDrawMode(${this.drawingMode})`);
    });


    this.createRackSubscription = this.eventAggregator.subscribe(CreateRack, (message: CreateRack) => {
      this.createRack(message.rackDetails);

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

  /**
   * Draws the created hardward.
   * 
   * @param p5 
   * @param drawingMode 
   */
  public drawFloor(p5: p5) {
    this.racks.forEach((rack: Rack) => {
      rack.draw(p5, this.drawingMode);
    })
  }


  /**
   * Triggers hover callback on any hardward.
   * 
   * @param p5 
   * @param drawingMode 
   */
  public warehouseHover(p5: p5) {
    // console.log(`WarehouseService > warehouseHover(${this.drawingMode})`);

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        if (!this.shadowHardware) {
          this.shadowHardware = new ShadowRack(this.racks.length + 1);
        }

        this.shadowHardware.draw(p5, this.drawingMode);

        break;

      case DrawMode.SELECTION:
      case DrawMode.DELETE_HARDWARE:
        break;

      default:
        console.error(`Unhandled WarehouseService.warehouseHover() drawing mode ${this.drawingMode}`);
    }
  }


  /**
   * Triggers the mouse click event on created hardware.
   * @param p5 
   * @param drawingMode 
   */
  public onMouseClicked(p5: p5, event) {
    console.log(`WarehouseService > onMouseClicked(${this.drawingMode})`);

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        const newRackPoint = { x: p5.mouseX, y: p5.mouseY };
        //@TODO get default sizing from settings
        const newRackDimensions = {
          width: 80,
          height: 80
        };

        this.eventAggregator.publish(new CreateRack({ name: `Rack-${this.racks.length + 1}`, point: newRackPoint, dimensions: newRackDimensions }));

        break;

      case DrawMode.SELECTION:
        this.racks.forEach((rack: Rack) => {
          rack.onMouseClicked(p5, this.drawingMode);
        });

        break;

      case DrawMode.DELETE_HARDWARE:
        const rackIdx = this.findHardwardIndexAt(MouseUtility.coords(p5));

        this.eventAggregator.publish(new DeleteRack(rackIdx));

        break;

      default:
        console.error(`Unhandled WarehouseService.onMouseClicked() drawing mode ${this.drawingMode}`);
    }

    p5.redraw();
  }



  /**
   * Triggers the mouse over event on created hardware.
   * @param p5 
   * @param drawingMode 
   */
  public onMouseOver(p5: p5, event) {
    // console.log(`WarehouseService > onMouseOver(${this.drawingMode})`);

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        break;

      case DrawMode.SELECTION:
      case DrawMode.DELETE_HARDWARE:
        this.racks.forEach((rack: Rack) => {
          rack.onMouseOver(p5, this.drawingMode);
        });

        break;

      default:
        console.error(`Unhandled WarehouseService.onMouseOver() drawing mode ${this.drawingMode}`);
    }

    p5.draw();
  }


  protected selectKeyPressed: boolean = false;
  public onKeyPressed(p5: p5) {

    this.selectKeyPressed = this.selectKeyPressed || p5.key == "Shift";


    console.log(`WarehouseService > onKeyPressed(${p5.key})`);
  }

  public onKeyRelease(p5: p5) {

    if (!this.selectKeyPressed) {
      return;
    }

    switch (p5.key) {
      case "R":
      case "r":

        this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_RACK));

        break;

      case "H":
      case "h":

        this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_SHELF));

        break;

      case "S":
      case 's':

        this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));

        break;

      case "D":
      case 'd':

        this.eventAggregator.publish(new UpdateDrawMode(DrawMode.DELETE_HARDWARE));

        break;
    }

    this.selectKeyPressed = false;


    console.log(`WarehouseService > onKeyRelease(${p5.key})`);
  }


  public findHardwardIndexAt(point: Point) {
    return this.racks.findIndex((rack: Rack) => {
      return rack.contains(point);
    });
  }

  /**
   * Adds a rack to the list of created racks.
   * @param rackDetails 
   */
  public createRack(rackDetails?: Partial<Rack>) {
    const newRack = new Rack(rackDetails);

    this.racks.push(newRack);
    this.shadowHardware = null;

    console.log(`WarehouseService > addRack(${newRack.name})`);
  }


  public deleteRack(rackIdx: number) {
    if (rackIdx < 0) { return; }

    this.racks.splice(rackIdx, 1);

    console.log(`WarehouseService > deleteRack(${rackIdx})`);
  }
}