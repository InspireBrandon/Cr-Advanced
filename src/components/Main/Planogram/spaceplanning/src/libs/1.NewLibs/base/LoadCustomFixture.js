import Konva from 'konva';
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import GondolaNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/GondolaBase.js";
import TextHeaderNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/TextHeaderBase.js";
import PaletteNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PaletteBase.js";
import ShelfNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ShelfBase.js";
import BaseNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BaseShelf.js";
import PegboardNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegboardBase.js";
import PegBarNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegBarBase.js";
import ProductGroupNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ProductBase.js";
import BasketNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BasketBase.js";
import ShareboxNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ShareboxBase.js";
import PegNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegBase.js";
import PlanogramNamer from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramNamer.js";
import axios from 'axios';
import StageWarehouseMiddleware from '@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/stage-warehouse-middleware.js';
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";
import AreaNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/AreaBase.js";
import LabelHolderNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/LabelHolderBase.js";
import CalculationHandler from "@/components/Main/Planogram/spaceplanning/src/libs/CalculationLib/calculationHandler.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";

class LoadCustomFixture {
    constructor(VueStore, stage, MasterLayer, PxlRatio) {
        this.VueStore = VueStore;
        this.MasterLayer = MasterLayer;
        this.PxlRatio = PxlRatio;
        this.Stage = stage;
        this.Data = null;
    }

    addCustomFixture(data) {
        let self = this;
        self.Data = data;
        self.getNewIDPlanoData();
        self.addRootItems();
    }

    getNewIDPlanoData() {
        let self = this;

        self.Data.forEach(element => {
            if (element.Type == "GONDOLA") {
                let newID = self.guid();
                self.getNewPlanoItemsByParent(self.Data, element.Data.ID, newID)
                element.Data.ID = newID;
            }
        });
    }

    getNewPlanoItemsByParent(planodata, oldParentID, newParentID) {
        let self = this;

        self.Data.forEach(element => {
            if (element.Data.ParentID == oldParentID) {
                let newID = self.guid();
                self.getNewPlanoItemsByParent(planodata, element.Data.ID, newID);
                element.Data.ParentID = newParentID;
                element.Data.ID = newID;
            }
        });
    }

    addRootItems() {
        let self = this;

        let gondolaArr = self.Data.filter((el) => el.Type == "GONDOLA");
        gondolaArr.sort((a, b) => a.RelativePosition.x - b.RelativePosition.x);

        gondolaArr.forEach(CurrentItem => {
            // start with gondola
            // go into recursive function foreach gondola
            self.loadItemRecursive(self.Data, CurrentItem, null, self.Stage, self.MasterLayer, self.PxlRatio, self.VueStore);
            // console.warn('[LOAD SAVE] ROOT ITEM COMPLETE', CurrentItem.Type, new Date());
        })

        // call product renderings
        self.loadRenderingsPostLoad(self.VueStore);
        // end
        self.Stage.draw();
    }

    PositionToBottom(gondolaItem) {
        let self = this;
        // console.log("POSY", gondolaItem, self.Stage.getHeight())
        let stageHeight = self.Stage.getHeight() //* self.Stage.scaleY();
        let gondolaHeight = gondolaItem.Data.Data.height * self.PxlRatio;

        return stageHeight - gondolaHeight;
    }

    loadItemRecursive(MasterData, CurrentItem, ParentID, Stage, MasterLayer, PxlRatio, VueStore) {
        // recursive function will create all children of gondola
        // console.log('[LOAD SAVE] Load item recursive', CurrentItem.Type, new Date());
        let self = this;

        // create the current item
        let ctrl_item = null;
        switch (CurrentItem.Type.toUpperCase()) {
            case "GONDOLA": {

                // TODO: Get next gondola position
                let ctrl_store = new StoreHelper();
                let newPos = {
                    x: 0,
                    y: self.PositionToBottom(CurrentItem)
                };
                let existingGondolas = ctrl_store.getAllPlanogramItemsByType(VueStore, "GONDOLA");

                let sortedArr = existingGondolas.sort((a, b) => a.Group.getX() - b.Group.getX());

                // console.log("EX", existingGondolas, "SORTED", sortedArr, newPos, CurrentItem)

                // ((gondola.Group.getHeight() * self.Stage.scaleY()) - ((self.Data.height * self.Ratio) * self.Stage.scaleY()))

                if (sortedArr != undefined && sortedArr.length > 0) {
                    let currentGondola = sortedArr[sortedArr.length - 1];
                    newPos = {
                        x: currentGondola.Group.getAbsolutePosition().x + (currentGondola.TotalWidth * self.Stage.scaleX()),
                        y: self.PositionToBottom(CurrentItem)
                    }
                }

                let transform = Stage.getAbsoluteTransform().copy();
                // to detect relative position we need to invert transform
                transform.invert();
                // now we find relative point
                let itemPos = transform.point(newPos);

                let ctrl_item = new GondolaNew(
                    VueStore,
                    Stage,
                    MasterLayer,
                    CurrentItem.Data.Data,
                    PxlRatio,
                    "GONDOLA",
                    ParentID
                )

                if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                    ctrl_item.Position = CurrentItem.Position;
                }

                // set json data values to the object
                ctrl_item.ID = CurrentItem.Data.ID;


                // TODO: Take a look at thi agian if it gets slow
                ctrl_item.Initialise(itemPos, true);
            }
            break;
        case "AREA": {
            let ctrl_item = new AreaNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "AREA",
                ParentID
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
        }
        break;
        case "TEXTHEADER": {
            let ctrl_item = new TextHeaderNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "TEXTHEADER",
                CurrentItem.Scale,
                CurrentItem.Data.Text
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
        }
        break;
        case "PALETTE": {
            let ctrl_item = new PaletteNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "PALETTE",
                ParentID
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
        }
        break;
        case "SHELF": {
            console.log("CHECKING SHELF")

            let ctrl_item = new ShelfNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "SHELF",
                ParentID
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }


            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;
            ctrl_item.Config = CurrentItem.Data.Config;
            if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
                ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
            }

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
            ctrl_item.ApplyZIndexing();
        }
        break;
        case "BASE": {
            console.log("LOAD RECURSIVE", CurrentItem)

            let ctrl_item = new BaseNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "BASE",
                ParentID
            )

            console.log("BASE", ctrl_item)

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;
            ctrl_item.Config = CurrentItem.Data.Config;
            if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
                ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
            }

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
            ctrl_item.ApplyZIndexing();
        }
        break;
        case "BASKET": {
            let ctrl_item = new BasketNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "BASKET",
                ParentID
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;
            ctrl_item.Config = CurrentItem.Data.Config;
            if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
                ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
            }

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
            ctrl_item.ApplyZIndexing();
        }
        break;
        case "SHAREBOX": {
            let ctrl_item = new ShareboxNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "SHAREBOX",
                ParentID
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;
            ctrl_item.Config = CurrentItem.Data.Config;
            if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
                ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
            }

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
            ctrl_item.ApplyZIndexing();
        }
        break;
        case "PEG": {
            let ctrl_item = new PegNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "PEG",
                ParentID
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;
            ctrl_item.Config = CurrentItem.Data.Config;
            if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
                ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
            }

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
            ctrl_item.ApplyZIndexing();
        }
        break;
        case "PEGBAR": {
            let ctrl_item = new PegBarNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "PEGBAR",
                ParentID
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;
            ctrl_item.Config = CurrentItem.Data.Config;
            if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
                ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
            }

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
            ctrl_item.ApplyZIndexing();
        }
        break;
        case "LABELHOLDER": {
            let ctrl_item = new LabelHolderNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "LABELHOLDER",
                ParentID
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;
            ctrl_item.Config = CurrentItem.Data.Config;
            if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
                ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
            }

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
            ctrl_item.ApplyZIndexing();
        }
        break;
        case "PEGBOARD": {
            let ctrl_item = new PegboardNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "PEGBOARD",
                ParentID
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            // set json data values to the object
            ctrl_item.ID = CurrentItem.Data.ID;
            ctrl_item.Config = CurrentItem.Data.Config;

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);
            ctrl_item.ApplyZIndexing();
        }
        break;
        case "PRODUCT": {
            let ctrl_item = new ProductGroupNew(
                VueStore,
                Stage,
                MasterLayer,
                CurrentItem.Data.Data,
                PxlRatio,
                "PRODUCT",
                ParentID
            )

            if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
                ctrl_item.Position = CurrentItem.Position;
            }

            //#region Set the same configs
            ctrl_item.ID = CurrentItem.Data.ID;
            ctrl_item.StackIndex = CurrentItem.Data.StackIndex;
            ctrl_item.Orientation_Width = CurrentItem.Data.Orientation.Width;
            ctrl_item.Orientation_Height = CurrentItem.Data.Orientation.Height;
            ctrl_item.Orientation_Depth = CurrentItem.Data.Orientation.Depth;

            ctrl_item.image_orientation_width = CurrentItem.Data.ImageOrientation.Width;
            ctrl_item.image_orientation_height = CurrentItem.Data.ImageOrientation.Height;

            // caps
            ctrl_item.Cap_Orientation_Width = CurrentItem.Data.Caps.Orientation.Width;
            ctrl_item.Cap_Orientation_Height = CurrentItem.Data.Caps.Orientation.Height;
            ctrl_item.Cap_Orientation_Depth = CurrentItem.Data.Caps.Orientation.Depth;
            ctrl_item.Caps_Count = CurrentItem.Data.Caps.Caps_Count;
            ctrl_item.Caps_Face = CurrentItem.Data.Caps.Caps_Face;
            ctrl_item.caps_image_orientation_width = CurrentItem.Data.Caps.ImageOrientation.Width;
            ctrl_item.caps_image_orientation_height = CurrentItem.Data.Caps.ImageOrientation.Height;
            ctrl_item.Caps_Enabled = CurrentItem.Data.Caps.Caps_Enabled;
            ctrl_item.Cap_Rotation = CurrentItem.Data.Caps.Rotation;
            // orientation and facings
            ctrl_item.Rotation = CurrentItem.Data.Orientation.Rotation;
            ctrl_item.LastFace = CurrentItem.Data.Orientation.LastFace;

            ctrl_item.TotalWidth = CurrentItem.Data.TotalWidth;
            ctrl_item.TotalHeight = CurrentItem.Data.TotalHeight;

            ctrl_item.Facings_X = CurrentItem.Data.Facings.x;
            ctrl_item.Facings_Y = CurrentItem.Data.Facings.y;
            ctrl_item.Facings_Z = CurrentItem.Data.Facings.z;
            ctrl_item.Facings_Z_Max = CurrentItem.Data.Facings.z_Max;

            ctrl_item.RandomColor = CurrentItem.Data.RandomColor;
            ctrl_item.PegboardHoleAssigned = CurrentItem.Data.PegboardHoleAssigned;
            ctrl_item.PegboardHoleAssignedID = CurrentItem.Data.PegboardHoleAssignedID;
            //#endregion

            ctrl_item.Initialise(CurrentItem.RelativePosition, false);

        }
        break;
        }

        if (ctrl_item != null) {
            ctrl_item.Group.setX(CurrentItem.RelativePosition.x);
            ctrl_item.Group.setY(CurrentItem.RelativePosition.y);
        }

        if (CurrentItem.Type == "PEG") {
            let itemArr = MasterData.filter((el) => el.Data.ParentID == CurrentItem.Data.ID);
            itemArr.sort((a, b) => a.RelativePosition.y - b.RelativePosition.y);

            // check if there are children and call recursive
            if (itemArr != undefined && itemArr != null) {
                // get all children of the current item, call recursive function
                if (itemArr.length > 0) {
                    itemArr.forEach(child => {
                        self.loadItemRecursive(MasterData, child, child.Data.ParentID, Stage, MasterLayer, PxlRatio, VueStore);
                    });
                }
            }
        } else {
            let itemArr = MasterData.filter((el) => el.Data.ParentID == CurrentItem.Data.ID);
            itemArr.sort((a, b) => a.RelativePosition.x - b.RelativePosition.x);

            // check if there are children and call recursive
            if (itemArr != undefined && itemArr != null) {
                // get all children of the current item, call recursive function
                if (itemArr.length > 0) {
                    itemArr.forEach(child => {
                        self.loadItemRecursive(MasterData, child, child.Data.ParentID, Stage, MasterLayer, PxlRatio, VueStore);
                    });
                }
            }
        }
    }

    loadRenderingsPostLoad(VueStore) {
        let self = this;
        let ctrl_store = new StoreHelper();
        let allItems = ctrl_store.getAllPlanogramItems(VueStore);
        let allItemsFiltered = allItems.filter((el) => el.Type == "SHELF" || el.Type == "BASE" || el.Type == "BASKET");

        let lastItem = null;
        allItemsFiltered.forEach(fixture => {
            lastItem = fixture;
            fixture.AddProductRenderings();
        });

        if (lastItem != null) {
            lastItem.ApplyZIndexing();
            lastItem.Layer.draw();
        }
    }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return (
            s4() +
            s4() +
            "-" +
            s4() +
            "-" +
            s4() +
            "-" +
            s4() +
            "-" +
            s4() +
            s4() +
            s4()
        );
    }
}

export default LoadCustomFixture;