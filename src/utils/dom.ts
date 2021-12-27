
export class DOMUtility {
  public static boundingHeight(): number {
    return window.innerHeight;
    return (document.querySelector("sidebar") as HTMLElement)?.offsetHeight;
  }

  public static boundingWidth(): number {
    return window.innerWidth;
  }
}