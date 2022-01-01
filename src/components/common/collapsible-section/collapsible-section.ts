import { bindable, BindingMode, inject } from "aurelia";

const bootstrap = require("bootstrap");

@inject()
export class CollapsibleSection {
  @bindable({ mode: BindingMode.oneTime }) name: string;
  @bindable({ mode: BindingMode.twoWay }) visible: boolean;

  public isOpen: boolean = false;

  private bsCollapse;

  constructor(protected readonly element: HTMLElement) { }

  public binding() {
    this.isOpen = this.visible;
  }

  public attached() {
    this.bsCollapse = new bootstrap.Collapse(this.collapsible, {
      show: this.visible
    })

    this.collapsible.addEventListener("show.bs.collapse", e => {
      this.isOpen = true;
    });

    this.collapsible.addEventListener("hide.bs.collapse", e => {
      this.isOpen = false;
    });
  }

  public detached() {
    this.bsCollapse.dispose();
    this.bsCollapse = null;
  }

  public get collapsibleName() {
    return `collapse-${this.name}`;
  }

  public get collapsible() {
    return this.element.querySelector(`#${this.collapsibleName}`);
  }
}