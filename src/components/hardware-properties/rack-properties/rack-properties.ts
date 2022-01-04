import { EventAggregator, bindable, BindingMode } from 'aurelia';
import { Rack, Shelf } from '../../../models';


export class RackProperties {
  @bindable({ mode: BindingMode.twoWay }) rack: Rack;


  constructor(protected readonly element: Element, eventAggregator: EventAggregator) {

  }

  public addShelf(shelfDetails: Partial<Shelf> = {}) {
    this.rack.shelves.push(new Shelf(shelfDetails, this.rack));
  }

}
