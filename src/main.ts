import Aurelia from "aurelia";
import { App } from "./app";
import { MenuBar, Floor, StatusBar, Rack } from "./components";

Aurelia.register(MenuBar, Floor, StatusBar, Rack).app(App).start();
