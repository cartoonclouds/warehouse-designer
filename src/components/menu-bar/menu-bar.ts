
import { UpdateDrawMode, DrawMode } from "../../messages/messages";
import { EventAggregator, IEventAggregator } from "aurelia";
import { ToggleButton } from '../common/toggle-button-group/toggle-button-group';

export class MenuBar {
    public hardwareActions: ToggleButton[] = [
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


    public historyActions: ToggleButton[] = [
        new ToggleButton({
            icon: "fas fa-undo",
            text: "Undo",
            drawMode: DrawMode.UNDO,
            clickAction: () => {

                this.eventAggregator.publish(new UpdateDrawMode(DrawMode.UNDO));

                console.log(`MenuBar > historyActions > UNDO`);

                return true;
            }
        }),
        new ToggleButton({
            icon: "fas fa-redo",
            text: "Redo",
            drawMode: DrawMode.REDO,
            clickAction: () => {

                this.eventAggregator.publish(new UpdateDrawMode(DrawMode.REDO));


                console.log(`MenuBar > historyActions > REDO`);

                return true;
            }
        }),
    ];

    public get buttonGroups() {
        return [
            {
                label: "Hardware control button group",
                buttons: this.hardwareActions
            },
            {
                label: "Canvas history control button group",
                buttons: this.historyActions
            }
        ]
    }

    constructor(@IEventAggregator protected readonly eventAggregator: EventAggregator) {
        //
    }
}
