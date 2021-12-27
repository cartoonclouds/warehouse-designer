import { bindable, BindingMode, EventAggregator, IDisposable, IEventAggregator, inject } from 'aurelia';
import { observable } from '@aurelia/runtime';
import { v4 as uuidv4 } from 'uuid';
import { DrawMode, UpdateDrawMode } from '../../../messages/messages';

export class ToggleButton {
  public id: string;
  public text: string;
  public icon: string;
  public iconOnly: boolean = true;
  public selected: boolean = false;
  public clickAction: (e?: MouseEvent | KeyboardEvent) => boolean | void;
  public drawMode: DrawMode;

  constructor(params: Partial<ToggleButton>) {
    this.id = params.id ?? uuidv4();
    this.drawMode = params.drawMode;
    this.text = params.text;
    this.iconOnly = params.iconOnly ?? this.iconOnly;
    this.icon = params.icon;
    this.clickAction = params.clickAction;
    this.selected = params.selected;
  }
}

@inject()
export class ToggleButtonGroup {
  @bindable({ mode: BindingMode.toView }) name: string;
  @bindable({ mode: BindingMode.toView }) ariaLabel: string;
  @bindable({ mode: BindingMode.toView }) showDivider: boolean = true;
  @bindable({ mode: BindingMode.twoWay }) buttonGroup: ToggleButton[];

  @observable selectedButton;
  protected updateDrawModeSubscription: IDisposable;


  constructor(protected readonly element: HTMLElement, @IEventAggregator protected readonly eventAggregator: EventAggregator) {
    this.updateDrawModeSubscription = this.eventAggregator.subscribe(UpdateDrawMode, (message: UpdateDrawMode) => {
      const actionButton = this.findButton(message.mode);

      if (actionButton) {
        this.selectedButton = actionButton;
      }


      console.log(`ToggleButtonGroup > Message.UpdateDrawMode(${message.mode})`);
    });
  }

  public unbinding() {
    this.updateDrawModeSubscription.dispose();
  }

  public attached() {
    if (this.showDivider) {
      this.element.classList.add('show-divider');
    }

    this.selectedButton = this.buttonGroup.find(button => button.selected);

    console.log(this.selectedButton);
  }

  public selectedButtonChanged(newSelectedButton) {
    this.buttonGroup.forEach((button) => {
      button.selected = newSelectedButton == button;
    });
  }

  public findButton(drawMode: DrawMode) {
    for (const button of this.buttonGroup) {
      if (button.drawMode == drawMode) {
        return button;
      }
    }

    return null;
  }

  public triggerClick($event, button) {
    this.selectedButton = button;

    button.clickAction($event);

    return true;
  }
  // https://getbootstrap.com/docs/5.1/components/button-group/
  // https://aurelia.io/docs/binding/radios#introduction
  // https://docs.aurelia.io/developer-guides/forms#binding-with-radio-inputs
}