import { bindable, BindingMode, EventAggregator, IDisposable, IEventAggregator, inject } from 'aurelia';
import { observable } from '@aurelia/runtime';
import { v4 as uuidv4 } from 'uuid';
import { DrawMode, UpdateDrawMode } from '../../../messages/messages';

export class MenuButton {
  public id: string;
  public text: string;
  public icon: string;
  public iconOnly: boolean = true;
  public clickAction: (e?: MouseEvent | KeyboardEvent) => boolean | void;
  public drawMode?: DrawMode;

  constructor(params: Partial<MenuButton>) {
    this.id = params.id ?? uuidv4();
    this.drawMode = params.drawMode;
    this.text = params.text;
    this.iconOnly = params.iconOnly ?? this.iconOnly;
    this.icon = params.icon;
    this.clickAction = params.clickAction;
  }
}

@inject()
export class ButtonGroup {
  @bindable({ mode: BindingMode.toView }) name: string;
  @bindable({ mode: BindingMode.toView }) ariaLabel: string;
  @bindable({ mode: BindingMode.toView }) showDivider: boolean = true;
  @bindable({ mode: BindingMode.twoWay }) buttonGroup: MenuButton[];

  @observable selectedButton;
  protected updateDrawModeSubscription: IDisposable;


  constructor(protected readonly element: HTMLElement) {
  }

  public unbinding() {
    this.updateDrawModeSubscription.dispose();
  }

  public attached() {
    if (this.showDivider) {
      this.element.classList.add('show-divider');
    }
  }

  public triggerMouseDown(event, button) {
    const element = event.toElement as HTMLButtonElement;

    // element.classList.remove("btn-outline-secondary");
    // element.classList.add("btn-outline-primary");
  }

  public triggerMouseUp(event, button) {
    console.log(event);

    const element = event.target as HTMLButtonElement;

    // element.classList.remove("btn-outline-primary");
    // element.classList.add("btn-outline-secondary");
  }


  public triggerClick(event, button) {
    button.clickAction(event);

    return true;
  }
  // https://getbootstrap.com/docs/5.1/components/button-group/
  // https://aurelia.io/docs/binding/radios#introduction
  // https://docs.aurelia.io/developer-guides/forms#binding-with-radio-inputs
}