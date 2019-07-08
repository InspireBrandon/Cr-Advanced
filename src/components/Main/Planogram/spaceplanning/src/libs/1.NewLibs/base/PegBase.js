import Konva from 'konva';
import GeneralPositionHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GeneralPosition.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";
import CloneBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/CloneBase.js";

class PegBase extends PlanogramItemBase {
    constructor(vueStore, stage, layer, data, ratio, type, parentID) {
        super(vueStore, stage, layer, data, ratio, type, parentID)

        // these are now our customer variables to this class
        this.ParentID = parentID;
        this.ParentTreeRedraw = new ParentTreeRedraw();
        this.Area = null;
    }

    Initialise(dropPos, positionElementRequired = true) {
        let self = this;
        // add it to the store immediately
        self.AddToStore();

        self.BuildBase(dropPos);
        self.SetBaseDraggable(true);

        // set width heights
        self.SetObjectDimensions();

        self.Build(dropPos, positionElementRequired);
    }

    SetObjectDimensions() {
        let self = this;

        self.Width = self.Data.width * self.Ratio;
        self.Height = self.Data.height * self.Ratio;
        self.TotalWidth = self.Width;
        self.TotalHeight = self.Height;

        self.Group.setWidth(self.TotalWidth)
        self.Group.setHeight(self.TotalHeight)
    }

    Build(dropPos, positionElementRequired = true) {
        let self = this;
        // TODO: add the extended method calls here

        self.AddPeg();

        if (positionElementRequired == true) {
            self.PositionElement();
        }

        //self.ApplyZIndexing();

        self.Layer.draw();
    }

    PositionElement(intersects = null) {
        let self = this;

        let ctrl_position = new GeneralPositionHelper();
        let ctrl_store = new StoreHelper();

        if (ctrl_store.getCloneItem(self.VueStore) == self.ID) {
            let ctrl_clone = new CloneBase("PEGBAR");
            ctrl_clone.Clone(self.VueStore, self.Stage, self, null, null);
            ctrl_store.setCloneItem(self.VueStore, null);
            return;
        }

        if (intersects != null && intersects != undefined && intersects.intersects == true) {
            if (intersects.ID != self.ParentID && intersects.ID != self.ID) {

                // adust the previous parent after a move
                let prevParent = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
                if (prevParent != null && prevParent != null) {
                    prevParent.PositionElement();
                }

                ctrl_position.PositionToParent(self.VueStore, null, self.ParentID) // IMPORTANT!

                self.ParentID = intersects.ID;
                // move this item to the new group
                let gondolaItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
                self.MoveToParentGroup(gondolaItem);
            }
        } else {
            self.Group.setY(self.LastPositionRelative.y)
            self.Group.setX(self.LastPositionRelative.x)
        }

        self.PositionPegbar();
    }

    PositionPegbar() {
        let self = this;

        // adjust label values + fixture positions
        // let ctrl_label = new LabelHelper();
        // ctrl_label.SetNewLabelAndPositionNumbers(self.VueStore);

        self.LastPositionRelative = self.Group.position();
        self.LastPositionAbsolute = self.Group.getAbsolutePosition();

        self.Layer.draw();
    }

    ChangeDimensions(eventData) {
        let self = this;
        // let ctrl_store = new StoreHelper();

        let lastData = self.Data;
        let newData = eventData.data;

        let deltaChangeObj = self.AdjustMasterGroupPositionAfterDimensionChange(lastData, newData)
        self.AdjustElementPosition(deltaChangeObj.deltaX, deltaChangeObj.deltaY);

        self.Data = newData;
        self.SetObjectDimensions();
        self.Area.fill(self.Data.color);
        self.Area.setWidth(self.TotalWidth); // sample
        self.Area.setHeight(self.TotalHeight); // sample
        self.Group.setWidth(self.TotalWidth);
        self.Group.setHeight(self.TotalHeight);
        self.LoadImage(self.Area, self.Data.image);

        // call position element
        self.PositionElement();

        // self.ApplyZIndexing();
    }

    AddPeg() {
        let self = this;
    
        self.Area = new Konva.Image({
          x: 0,
          y: 0,
          width: self.Data.width * self.Ratio,
          height: self.Data.height * self.Ratio,
          fill: self.Data.color,
          transformsEnabled: 'position'
        })
    
        self.LoadImage(self.Area, self.Data.image);
    
        self.Group.add(self.Area);
      }
}

export default PegBase;