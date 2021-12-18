import p5 from "p5";

export class Floor {
  constructor(private readonly floorElement: HTMLElement) {}

  public attached() {
    new p5(this.sketch, this.floorElement);
  }

  private get sketch() {
    return function (p5) {
      p5.setup = this.setup(p5);
      p5.draw = this.draw(p5);
    };
  }W

  public setup(p5) {
    return function (p5) {
      p5.createCanvas(400, 400);
    };
  }

  public draw(p5) {
    p5.background(220);
    if (p5.mouseIsPressed) {
      p5.fill(0);
    } else {
      p5.fill(255);
    }
    p5.ellipse(p5.mouseX, p5.mouseY, 80, 80);
  }
}
