import EventAggregator, { bindable, BindingMode } from 'aurelia';
import { Shelf } from '../../../models';

export class ShelfProperties {
  @bindable({ mode: BindingMode.twoWay }) shelf: Shelf;

  constructor(protected readonly element: HTMLElement, protected readonly eventAggregator: EventAggregator) {

  }
}