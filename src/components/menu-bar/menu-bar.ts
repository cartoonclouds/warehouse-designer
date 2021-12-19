import { inject } from "aurelia";
import { WarehouseServiceProvider } from "../../service-providers/warehouse-service-provider";

export class MenuBar {
    constructor(
    ) { }

    public addRack() {
        WarehouseServiceProvider.addRack();
    }
}
