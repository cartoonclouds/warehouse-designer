import Aurelia, { AppTask, IContainer, ITemplateCompiler } from "aurelia";
import { App } from "./app";
import * as globalComponents from "./components";

import '../src/assets/fontawesome-pro-5.2.0/js/all.js';

// au.use.standardConfiguration();
// au.use.developmentLogging();

Aurelia.register(
  <any>globalComponents,
  AppTask.beforeCreate(ITemplateCompiler, compiler => {
    compiler.debug = false;
  })
).app(App).start();

// fabric.Object.prototype.getAbsolute = function(key) {
//   if (this.group) {
//     if (key === 'top') {
//       return this.calcTransformMatrix()[5];
//     } else if (key === 'left') {
//       return this.calcTransformMatrix()[4];
//     } else if (key === 'angle') {
//       return this.angle + this.group.angle;
//     } else if (key === 'scaleX') {
//       return this.scaleX * this.group.scaleX;
//     } else if (key === 'scaleY') {
//       return this.scaleY * this.group.scaleY;
//     }
//   }
//   return this[key];
// };