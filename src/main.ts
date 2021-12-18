import Aurelia from "aurelia";
import { App } from "./app";
import { Floor } from "./components/floor/floor";

Aurelia.register(Floor).app(App).start();
