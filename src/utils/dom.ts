
export class DOMUtility {
  public static boundingHeight(): number {
    return window.innerHeight;
    return (document.querySelector("sidebar") as HTMLElement)?.offsetHeight;
  }

  public static boundingWidth(): number {
    return window.innerWidth;
  }

  public static readonly Cursors = Object.freeze({
    ALIAS: "alias",
    ALL_SCROLL: "all-scroll",
    AUTO: "auto",
    CELL: "cell",
    COL_RESIZE: "col-resize",
    Context_Menu: "context-menu",
    COPY: "copy",
    CROSSHAIR: "crosshair",
    DEFAULT: "default",
    E_RESIZE: "e-resize",
    EW_RESIZE: "ew-resize",
    GRAB: "grab",
    GRABBING: "grabbing",
    HELP: "help",
    MOVE: "move",
    N_RESIZE: "n-resize",
    NE_RESIZE: "ne-resize",
    NESW_RESIZE: "nesw-resize",
    NO_DROP: "no-drop",
    NONE: "none",
    NOT_ALLOWED: "not-allowed",
    NS_RESIZE: "ns-resize",
    NW_RESIZE: "nw-resize",
    NWSE_RESIZE: "nwse-resize",
    POINTER: "pointer",
    PROGRESS: "progress",
    ROW_RESIZE: "row-resize",
    S_RESIZE: "s-resize",
    SE_RESIZE: "se-resize",
    SW_RESIZE: "sw-resize",
    TEST: "text",
    VERTICAL_TEXT: "vertical-text",
    W_RESIZE: "w-resize",
    WAIT: "wait",
    ZOOM_IN: "zoom-in",
    ZOOM_OUT: "zoom-out",
  });
}