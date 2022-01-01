import { bindable, BindingMode, containerless, EventAggregator, inject } from "aurelia";

@inject()
export class HardwareProperties {
  @bindable viewModel: any;
  @bindable model: any;

  constructor(
    protected readonly element: HTMLElement,
    protected readonly eventAggregator: EventAggregator) {
  }
}
