
import { UpdateDrawMode, DrawMode } from "../../messages/messages";
import { EventAggregator, IEventAggregator } from "aurelia";
import { ToggleButton } from "../common/toggle-button-group/toggle-button-group";

export class MenuBar {
    public buttons: ToggleButton[] = [
        new ToggleButton({
            icon: "far fa-hand-pointer",
            initiallySelected: true,
            clickAction: () => {
                this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));

                console.log(`MenuBar > ToggleButton > clickAction(${DrawMode.SELECTION})`);

                return true;
            }
        }),
        new ToggleButton({
            icon: "far fa-pallet",
            clickAction: () => {
                this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_RACK));

                console.log(`MenuBar > ToggleButton > clickAction(${DrawMode.ADD_RACK})`);

                return true;
            }
        }),
        new ToggleButton({
            icon: "far fa-inventory",
            clickAction: () => {
                this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_SHELF));

                console.log(`MenuBar > ToggleButton > clickAction(${DrawMode.ADD_SHELF})`);

                return true;
            }
        }),
    ];

    constructor(@IEventAggregator protected readonly eventAggregator: EventAggregator) {}
}
