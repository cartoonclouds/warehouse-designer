import Aurelia from "aurelia";
import { App } from "./app";
import { TitleBar, Sidebar, Floor, StatusBar } from "./components";

Aurelia.register(TitleBar, Sidebar, Floor, StatusBar).app(App).start();
