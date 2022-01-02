import { bindable, BindingMode, containerless, EventAggregator, IEventAggregator, inject } from "aurelia";
import { HardwareEvent } from "../hardware/rack/rack";
import { observable } from '@aurelia/runtime';

@inject()
export class DebugProperties {
  @observable @bindable model: any;

  public formattedEvents: string;
  protected eventsUpdater;

  constructor(
    protected readonly element: HTMLElement,
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) {
  }

  public modelChanged() {
    this.attached();
  }

  public attached() {
    this.eventsUpdater = setInterval(() => {
      try {
        this.formattedEvents = this.model.events.reduce((str, e: HardwareEvent) => {
          return str + `[${e.dateTime.toLocaleString()}] ${e.domEvent} ${e.message ? ' : ' + e.message : ''}\n`;
        }, '');

        const textarea = this.element.querySelector('textarea');
        textarea.scrollTop = textarea.scrollHeight;
      } catch (e) {
        clearInterval(this.eventsUpdater);
      }
    }, 1000);
  }

  public detached() {
    clearInterval(this.eventsUpdater);
  }
}
