import Aurelia from "aurelia";
import { App } from "./app";
import * as globalComponents from "./components";

import '../src/assets/fontawesome-pro-5.2.0/js/all.js';

Aurelia.register(<any>globalComponents).app(App).start();
