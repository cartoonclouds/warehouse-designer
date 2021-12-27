
import p5 from "p5";
import { Point } from "../hardware-types";

export default class MouseUtility {
  public static coords(p5: p5): Point {
    return {
      x: p5.mouseX,
      y: p5.mouseY
    }
  }
}