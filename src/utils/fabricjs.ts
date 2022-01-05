import { Hardware } from "../models/hardware";

export default class FabricJSUtil {
  public readonly OBJECT_EVENTS = [
    "added",
    "removed",
    "selected",
    "deselected",
    "modified",
    "moved",
    "scaled",
    "rotated",
    "skewed",
    "rotating",
    "scaling",
    "moving",
    "skewing",
    "mousedown",
    "mouseup",
    "mouseover",
    "mouseout",
    "mousewheel",
    "mousedblclick",
    "dragover",
    "dragenter",
    "dragleave",
    "drop"
  ];

  //Props to change via interaction and need to be emitted for prop.sync usage
  public readonly EMIT_PROPS = [
    "angle",
    "height",
    "left",
    "originX",
    "originY",
    "scaleX",
    "scaleY",
    "skewX",
    "skewY",
    "top",
    "width"
  ];

  //Props that require a render once changed
  public readonly REQUIRE_RENDER = [
    "angle",
    "height",
    "left",
    "originX",
    "originY",
    "scaleX",
    "scaleY",
    "skewX",
    "skewY",
    "top",
    "width",
    "visible"
  ];

}
