import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";

class RedrawParentChildTree {
  constructor() {

  }

  /**
   * Redraw all direct children without hitting recursive loop
   * @param {*} VueStore 
   * @param {*} parentID 
   */
  RedrawParentDirectChildren(VueStore, parentID, force = false) {
    let self = this;

    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(VueStore, parentID);

    if (force == false) {
      if (parentItem.Type.toUpperCase() == "PALETTE" || parentItem.Type.toUpperCase() == "PEGBOARD") { // exclude redraw of all the items on pegboards and palettes.
        return;
      }
    }

    let directChildren = ctrl_store.getAllPlanogramItems(VueStore, parentID);
    directChildren.sort((a, b) => a.Group.getX() - b.Group.getX());

    if (directChildren != null && directChildren.length > 0) {
      directChildren.forEach(child => {
        child.Update();
      });
    }
  }

  /**
   * Reposition all direct child elements
   */

  PositionDirectChildren(VueStore, parentID, force = false) {
    let self = this;

    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(VueStore, parentID);

    if (force == false) {
      if (parentItem.Type.toUpperCase() == "PALETTE" || parentItem.Type.toUpperCase() == "PEGBOARD") { // exclude redraw of all the items on pegboards and palettes.
        return;
      }
    }

    let directChildren = ctrl_store.getAllPlanogramItems(VueStore, parentID);
    directChildren.sort((a, b) => a.Group.getX() - b.Group.getX());

    if (directChildren != null && directChildren.length > 0) {
      directChildren.forEach(child => {
        child.PositionElement();
      });
    }
  }

  /**
   * Position and redraw
   * @param {*} VueStore 
   * @param {*} parentID 
   * @param {*} force 
   */
  PositionAndRedrawDirectChildren(VueStore, parentID, force = false) {
    let self = this;

    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(VueStore, parentID);

    if (force == false) {
      if (parentItem.Type.toUpperCase() == "PALETTE" || parentItem.Type.toUpperCase() == "PEGBOARD") { // exclude redraw of all the items on pegboards and palettes.
        return;
      }
    }

    let directChildren = ctrl_store.getAllPlanogramItems(VueStore, parentID);
    directChildren.sort((a, b) => a.Group.getX() - b.Group.getX());

    if (directChildren != null && directChildren.length > 0) {
      directChildren.forEach(child => {
        child.Update();
        child.PositionElement();
      });
    }
  }
}

export default RedrawParentChildTree;