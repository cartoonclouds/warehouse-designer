import { Hardware, Rack } from "./components";
import { ShadowRack } from "./components/hardware/rack/rack";

export type Dimensions = {
  width: number;
  height: number;
}

export type Point = {
  x: number;
  y: number;
}

export interface Rectangle {
  topLeft: { x: number, y: number };
  topRight: { x: number, y: number };
  bottomLeft: { x: number, y: number };
  bottomRight: { x: number, y: number };
}

export function isRectangle(shape): shape is Rectangle {
  return (shape as Rectangle).topLeft && (shape as Rectangle).topRight && (shape as Rectangle).bottomLeft && (shape as Rectangle).bottomRight ? true : false;
}


export function isPoint(point): point is Point {
  return (point as Point).x && (point as Point).y ? true : false;
}

export function isRack(rack): rack is Rack {
  return (rack as Rack)?.modelName === "Rack" ? true : false;
}

export function isShadowRack(rack): rack is ShadowRack {
  return (rack as ShadowRack)?.modelName === "ShadowRack" ? true : false;
}

// export function isShelf(shelf): shelf is Shelf {
//   return (shelf as Shelf)?.modelName === "Shelf" ? true : false;
// }