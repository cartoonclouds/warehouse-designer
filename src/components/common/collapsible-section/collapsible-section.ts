import { bindable, BindingMode, inject } from "aurelia";

const bootstrap = require("bootstrap");

@inject()
export class CollapsibleSection {
  public static collapsibleSectionCount = 0;

  @bindable({ mode: BindingMode.oneTime }) name: string;
  @bindable({ mode: BindingMode.twoWay }) visible: boolean = true;

  private bsCollapse;

  constructor(protected readonly element: HTMLElement) {
    CollapsibleSection.collapsibleSectionCount++;
  }

  public attached() {
    this.bsCollapse = new bootstrap.Collapse(this.collapsible, {
      show: this.visible
    })

    this.collapsible.addEventListener("shown.bs.collapse", e => {
      this.visible = true;
    });

    this.collapsible.addEventListener("hidden.bs.collapse", e => {
      this.visible = false;
    });
  }

  public detached() {
    this.bsCollapse.dispose();
    this.bsCollapse = null;
  }

  public get collapsibleName() {
    return `collapse-${this.name}-${CollapsibleSection.collapsibleSectionCount}`;
  }

  public get collapsible() {
    return this.element.querySelector(`#${this.collapsibleName}`);
  }
}