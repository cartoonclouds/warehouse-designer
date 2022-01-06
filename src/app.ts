import { EventAggregator, IDisposable, IEventAggregator, inject } from "aurelia";

import { HardwareSelected, HardwareDeselected } from './messages/messages';
import { Hardware } from "./models/hardware";
import { IObserverLocator, ObserverLocator } from '@aurelia/runtime';

@inject()
export class App {
  public static readonly InfoBarHeight = 104;
  public static observer: ObserverLocator;

  // Event subscriptions
  protected messageSubscriptions: IDisposable[] = [];

  public selectedHardware: Hardware;

  constructor(
    protected readonly element: HTMLElement,
    protected readonly observerLocator: ObserverLocator,
    @IEventAggregator protected readonly eventAggregator: EventAggregator
  ) {
    App.observer = observerLocator;
  }

  public binding() {
    this.messageSubscriptions.push(
      this.eventAggregator.subscribe(HardwareSelected, (message: HardwareSelected) => {
        this.selectedHardware = message.hardware;
      }),
      this.eventAggregator.subscribe(HardwareDeselected, (message: HardwareDeselected) => {
        this.selectedHardware = null;
      }),
    );
  }

  public unbound() {
    this.messageSubscriptions.forEach((s: IDisposable) => s.dispose());
    this.messageSubscriptions = null;
  }




  // protected windowResized(p5) {
  //   return function () {
  //     p5.resizeCanvas(this.boundingWidth, this.boundingHeight);
  //   };
  // }
}
