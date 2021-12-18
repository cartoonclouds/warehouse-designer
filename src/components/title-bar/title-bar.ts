import { inject } from "aurelia";

@inject()
export class TitleBar {

    constructor(private readonly titleBarElement: HTMLElement) { }

}
