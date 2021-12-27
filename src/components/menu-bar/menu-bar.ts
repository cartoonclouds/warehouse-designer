
import { UpdateDrawMode, DrawMode } from "../../messages/messages";
import { EventAggregator, IDisposable, IEventAggregator } from "aurelia";
import { ToggleButton, ToggleButtonGroup } from '../common/toggle-button-group/toggle-button-group';

export class MenuBar {
    public buttons: ToggleButton[] = [
        new ToggleButton({
            icon: "far fa-hand-pointer",
            text: "Selection Hardware",
            selected: true,
            drawMode: DrawMode.SELECTION,
            clickAction: () => {
                this.eventAggregator.publish(new UpdateDrawMode(DrawMode.SELECTION));

                console.log(`MenuBar > ToggleButton > clickAction(${DrawMode.SELECTION})`);

                return true;
            }
        }),
        new ToggleButton({
            icon: "far fa-pallet",
            text: "Add New Rack",
            drawMode: DrawMode.ADD_RACK,
            clickAction: () => {
                this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_RACK));

                console.log(`MenuBar > ToggleButton > clickAction(${DrawMode.ADD_RACK})`);

                return true;
            }
        }),
        new ToggleButton({
            icon: "far fa-inventory",
            text: "Add New Shelf",
            drawMode: DrawMode.ADD_SHELF,
            clickAction: () => {
                this.eventAggregator.publish(new UpdateDrawMode(DrawMode.ADD_SHELF));

                console.log(`MenuBar > ToggleButton > clickAction(${DrawMode.ADD_SHELF})`);

                return true;
            }
        }),
        new ToggleButton({
            icon: "far fa-times-hexagon",
            text: "Delete Hardware",
            drawMode: DrawMode.DELETE_HARDWARE,
            clickAction: () => {
                this.eventAggregator.publish(new UpdateDrawMode(DrawMode.DELETE_HARDWARE));

                console.log(`MenuBar > ToggleButton > clickAction(${DrawMode.DELETE_HARDWARE})`);

                return true;
            }
        }),
    ];

    constructor(@IEventAggregator protected readonly eventAggregator: EventAggregator) {
        //
    }
}
