import { inject } from "aurelia";

@inject()
export class StatusBar {

    constructor(private readonly statusBarElement: HTMLElement) { }

}
