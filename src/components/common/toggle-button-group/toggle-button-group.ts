import { bindable, BindingMode } from "aurelia";
import { observable } from '@aurelia/runtime';
import { v4 as uuidv4 } from 'uuid';

export class ToggleButton {
  public id: string;
  public text: string;
  public icon: string;
  public iconOnly: boolean = true;
  public initiallySelected: boolean = false;
  public clickAction: (e?: MouseEvent | KeyboardEvent) => boolean | void

  constructor(params: Partial<ToggleButton>) {
    this.id = params.id ?? uuidv4();
    this.text = params.text;
    this.iconOnly = params.iconOnly ?? this.iconOnly;
    this.icon = params.icon;
    this.clickAction = params.clickAction;
  }
}


export class ToggleButtonGroup {
  @bindable({ mode: BindingMode.toView }) name: string;
  @bindable({ mode: BindingMode.toView }) ariaLabel: string;
  @bindable({ mode: BindingMode.toView }) showDivider: boolean = true;
  @bindable({ mode: BindingMode.toView }) buttonGroup: ToggleButton[];

  @observable selectedButton;

  constructor(protected readonly element: HTMLElement) {
  }

  public attached() {
    if (this.showDivider) {
      this.element.classList.add('show-divider');
    }
  }

  public binding() {
    this.selectedButton = this.buttonGroup.find(button => button.initiallySelected);
  }

  public triggerClick($event, button) {
    button.clickAction($event);

    return true;
  }
  // https://getbootstrap.com/docs/5.1/components/button-group/
  // https://aurelia.io/docs/binding/radios#introduction
  // https://docs.aurelia.io/developer-guides/forms#binding-with-radio-inputs
}