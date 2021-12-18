import { inject } from "aurelia";
import { WarehouseServiceProvider } from "../../service-providers/warehouse-service-provider";

@inject()
export class Sidebar {
    constructor(
        private readonly sidebarElement: HTMLElement,
        private readonly warehouseServiceProvider: WarehouseServiceProvider
    ) { }

    public addRack() {
        this.warehouseServiceProvider.newRack();
    }
}
