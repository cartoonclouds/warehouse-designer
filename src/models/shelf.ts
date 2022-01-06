import { fabric } from "fabric";
import { observable } from '@aurelia/runtime';
import { Rack } from ".";
import { HardwareEvent } from "./hardware";


export type IShelf = Shelf;

export class Shelf extends fabric.Object {
  public static readonly type: string = "Shelf";
  public type = Shelf.type;

  public notes: string;
  public code: string;
  public rack: Rack;


  public fabricLabel: fabric.Text;
  public label: string;
  public get defaultLabel() {
    return `Shelf-${1} for Rack ${this.rack?.label}`;
  }

  constructor(shelfDetails: Partial<Shelf>, rack: Rack) {
    super({
      type: Shelf.type,
      left: rack.centerX,
      top: rack.centerY,
      originX: 'center',
      originY: 'center'
    });

    this.rack = rack;

    this.label = shelfDetails.label || this.defaultLabel;
    this.notes = shelfDetails.notes;
    this.code = shelfDetails.code;
  }

  public get count() {
    return 0;
  }

  protected generateLabel() {
    if (!this.fabricLabel) {
      this.fabricLabel = new fabric.Text(`Shelves Count ${this.count}`, {
        top: 0,
        left: 0,
        fontFamily: 'Helvetica',
        strokeWidth: 0,
        stroke: '#333',
        fontSize: 14,
        selectable: false,
        evented: false,
        hasControls: false,
      });
    }

    return this.fabricLabel;
  }


  public initialize(options?: fabric.IObjectOptions): any {
    options || (options = {});

    super.initialize(options);

    this.label = this.label || '';
  };


  public toObject() {
    return fabric.util.object.extend(super.toObject(), {
      label: this.label,
      code: this.code
    });
  }

  public get modelName() {
    return this.constructor.name.trim();
  }


  @observable public events: HardwareEvent[] = [];
}


// export class Shelves extends fabric.Group {
//   public static readonly type: string = "Shelves";
//   public type = Shelves.type;

//   protected rack: Rack;
//   protected shelves: Shelf[] = [];

//   protected static DEFAULT_SHELF_PROPS = {
//     type: Shelves.type,
//     fill: 'red',
//     subTargetCheck: true,
//     hasControls: false,
//     selectable: false,
//     evented: false,
//     perPixelTargetFind: true
//   };


//   public constructor(rack: Rack) {
//     super([], {
//       type: Shelves.type
//     });

    // this.rack = rack;

    // this.addWithUpdate(this.generateLabel());

    // this.setOptions(Object.assign({}, Shelves.DEFAULT_SHELF_PROPS, {
    //   left: rack.left,
    //   top: rack.top,
    //   width: rack.width,
    //   height: rack.height
    // }));

    // this.attachObservers();

    // const shelfImage = new fabric.IText('\f1ea HELLO HELLO HELLO HELLO', {
    //   top: 0,
    //   left: 0, //Take the block's position
    //   // fill: 'white',
    //   fontSize: 60,
    //   // fontFamily: 'Font Awesome 5 Free',
    //   fontFamily: 'FontAwesome',
    //   selectable: false
    // });
    //   fabric.loadSVGFromURL("http://fabricjs.com/assets/1.svg",function(objects,options) {

    //     var loadedObjects = new fabric.Group(group);

    //     loadedObjects.set({
    //             left: 100,
    //             top: 100,
    //             width:175,
    //             height:175
    //     });

    //     canvas.add(loadedObjects);
    //     canvas.renderAll();

    // },function(item, object) {
    //         object.set('id',item.getAttribute('id'));
    //         group.push(object);
    // });

  // }


  // protected attachObservers() {
  //   WarehouseFloor.observer
  //     .getArrayObserver(this._objects)
  //     .subscribe({
  //       handleCollectionChange: (newVale) => {
  //         this.label.text = `Shelves Count ${this.count}`;
  //       }
  //     });
  // }



  // public addShelf(shelfDetails: Partial<Shelf> = {}) {
  //   this.addWithUpdate(new Shelf(shelfDetails, this.rack));
  // }


  // [Symbol.iterator]() {
  //   // Use a new index for each iterator. This makes multiple
  //   // iterations over the iterable safe for non-trivial cases,
  //   // such as use of break or nested looping over the same iterable.
  //   let index = 0;
  //   let shelves = this.getObjects(Shelf.type);

  //   return {
  //     next: () => {
  //       if (index < shelves.length) {
  //         return { value: shelves[index++], done: false }
  //       } else {
  //         return { done: true }
  //       }
  //     }
  //   }
  // }
// }
