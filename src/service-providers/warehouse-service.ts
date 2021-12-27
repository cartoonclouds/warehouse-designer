import { EventAggregator, IEventAggregator, IDisposable, inject } from "aurelia";
import { Hardware, Rack } from "../components";
import { DrawMode, CreateRack, UpdateDrawMode } from '../messages/messages';
import { observable } from '@aurelia/runtime';
import { ShadowRack } from "../components/p5-elements/rack/rack";

@inject()
export class WarehouseService {
  private racks: Rack[] = [];
  private shadowHardware: Hardware;

  @observable public drawingMode: DrawMode = DrawMode.SELECTION;

  protected updateDrawModeSubscription: IDisposable;
  protected createRackSubscription: IDisposable;

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
      this.addRack(message.rackDetails);

      console.log(`WarehouseService > Message.CreateRack()`);
    });
  }

  public unsubscribe() {
    this.updateDrawModeSubscription.dispose();
    this.createRackSubscription.dispose();
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
  public onMouseClicked(p5: p5) {
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

        this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));

        break;

      case DrawMode.SELECTION:
        this.racks.forEach((rack: Rack) => {
          rack.onMouseClicked(p5, this.drawingMode);
        });

        break;

      default:
        console.error(`Unhandled WarehouseService.onMouseClicked() drawing mode ${this.drawingMode}`);
    }
  }



  /**
   * Triggers the mouse over event on created hardware.
   * @param p5 
   * @param drawingMode 
   */
  public onMouseOver(p5: p5) {
    // console.log(`WarehouseService > onMouseOver(${this.drawingMode})`);

    switch (this.drawingMode) {
      case DrawMode.ADD_RACK:
        break;

      case DrawMode.SELECTION:
        this.racks.forEach((rack: Rack) => {
          rack.onMouseOver(p5, this.drawingMode);
        });

        break;

      default:
        console.error(`Unhandled WarehouseService.onMouseOver() drawing mode ${this.drawingMode}`);
    }
  }



  /**
   * Adds a rack to the list of created racks.
   * @param rackDetails 
   */
  public addRack(rackDetails?: Partial<Rack>) {
    const newRack = new Rack(rackDetails);

    this.racks.push(newRack);
    this.shadowHardware = null;

    console.log(`WarehouseService > addRack(${newRack.name})`);
  }

}