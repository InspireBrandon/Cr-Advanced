import Konva from 'konva';
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import Vue from 'vue';

class LabelingBase {
  constructor() {

  }

  GetNextLabelNumber(VueStore) {
    let self = this;
    let retVal = 1;
    let ctrl_store = new StoreHelper();
    let allItems = ctrl_store.getAllPlanogramItems(VueStore);

    let filteredArr = allItems.filter((el) =>
      el.Type.toUpperCase() == "SHELF" ||
      el.Type.toUpperCase() == "BASE" ||
      el.Type.toUpperCase() == "PEGBAR" ||
      el.Type.toUpperCase() == "PEGBOARD" ||
      el.Type.toUpperCase() == "BASKET" ||
      el.Type.toUpperCase() == "SHAREBOX" ||
      el.Type.toUpperCase() == "PEG"
    )

    if (filteredArr.length == 0) {
      retVal = 1;
    } else {
      retVal = filteredArr.length;
    }
    console.log("[LABELING] Next Number", retVal)

    return retVal;
  }

  SetNewLabelAndPositionNumbers(VueStore) {
    let self = this;
    let ctrl_store = new StoreHelper();
    let allItems = ctrl_store.getAllPlanogramItems(VueStore);

    let parentItems = allItems;//allItems.filter((el) => (el.ParentID == null || el.ParentID == undefined));//allItems;//

    // TODO: Check the store, add a call to store helper, get the current ordering of a label and sort accordingly.
    let labelOrder = ctrl_store.getLabelConfig(VueStore);
    // then do the below work

    parentItems.sort((a, b) =>(a.Group.getAbsolutePosition().x - b.Group.getAbsolutePosition().x))
    
    let positionOverall = 0;
    parentItems.forEach(parent => {
      let allItems = ctrl_store.getAllPlanogramItems(VueStore, parent.ID);

      let filteredArr = allItems.filter((el) =>
        el.Type.toUpperCase() == "AREA" ||
        el.Type.toUpperCase() == "SHELF" ||
        el.Type.toUpperCase() == "BASE" ||
        el.Type.toUpperCase() == "PEGBAR" ||
        el.Type.toUpperCase() == "PEGBOARD" ||
        el.Type.toUpperCase() == "PALETTE" ||
        el.Type.toUpperCase() == "BASKET" ||
        el.Type.toUpperCase() == "LABELHOLDER" ||
        el.Type.toUpperCase() == "SHAREBOX" ||
        el.Type.toUpperCase() == "PEG"
      )

      if (labelOrder.toUpperCase() == "T2B") {
        filteredArr.sort((a, b) =>(a.Group.getAbsolutePosition().y - b.Group.getAbsolutePosition().y))
      } else if (labelOrder.toUpperCase() == "B2T") {
        filteredArr.sort((a, b) =>(b.Group.getAbsolutePosition().y - a.Group.getAbsolutePosition().y))
      }

      filteredArr.forEach((fixture, idx) => {
        positionOverall += 1;
        fixture.SetTextLabel(positionOverall) // IMPORTANT : All fixtures that require labeling positions must have this call in their respective classes
        fixture.SetTextLabelPosition();
      }); 
    });
  }
}

export default LabelingBase;