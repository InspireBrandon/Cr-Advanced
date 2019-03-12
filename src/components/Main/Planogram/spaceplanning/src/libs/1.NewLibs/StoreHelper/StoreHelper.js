class StoreHelper {
  constructor() {

  }

  /**
   * Finds all planogram items by type and optional id
   * @param {*} VueStore - Required. Store instance
   * @param {*} type - Required
   * @param {*} parentID - Optional
   */
  getAllPlanogramItemsByType(VueStore, type, parentID = null) {

    let itemArr = VueStore.getters.getAllPlanogramItems;

    let filteredArr = [];

    if (parentID == null) {
      filteredArr = itemArr.filter((el) => el.Type == type.toUpperCase());
    } else {
      filteredArr = itemArr.filter((el) => el.Type == type.toUpperCase() && el.ParentID == parentID);
    }

    return filteredArr;
  }

  getAllPlanogramItems(VueStore, parentID = null) {

    let itemArr = VueStore.getters.getAllPlanogramItems;

    let filteredArr = [];

    if (parentID == null) {
      return itemArr;
    } else {
      filteredArr = itemArr.filter((el) => el.ParentID == parentID);
    }

    return filteredArr;
  }

  getPlanogramItemById(VueStore, id) {
    return VueStore.getters.getPlanogramItemById(id);
  }

  addPlanogramItem(VueStore, item) {
    let self = this;

    VueStore.commit('addPlanogramItem', item);

    if (item.Type.toUpperCase() == "PRODUCT") {
      // add to active planogram products
      VueStore.commit('addActivePlanogramProduct', item);
    }
  }

  removeRecursive(VueStore, parentID) {
    let self = this;
    let items = self.getAllPlanogramItems(VueStore, parentID);
    items.forEach(item => {
      item.Delete();
      self.removeRecursive(VueStore, item.ID);
    });
  }

  removePlanogramItem(VueStore, item) {
    let self = this;

    switch (item.Type.toUpperCase()) {
      case "PRODUCT":
        {
          // remove the product from active product list
          VueStore.commit('removeActivePlanogramProduct', item);
        }
        break;
      case "GONDOLA":
        {
          self.removeRecursive(VueStore, item.ID);
        }
        break;
      case "PALETTE":
        {
          self.removeRecursive(VueStore, item.ID);
        }
        break;
      case "BASE":
        {
          self.removeRecursive(VueStore, item.ID);
        }
        break;
      case "SHELF":
        {
          self.removeRecursive(VueStore, item.ID);
        }
        break;
      case "PEGBAR":
        {
          self.removeRecursive(VueStore, item.ID);
        }
        break;
      case "PEGBOARD":
        {
          self.removeRecursive(VueStore, item.ID);
        }
        break;
      case "BASKET":
        {
          self.removeRecursive(VueStore, item.ID);
        }
        break;
      case "DIVIDER":
        {
          self.removeRecursive(VueStore, item.ID);
        }
        break;
        case "TEXTHEADER":
        {
          self.removeRecursive(VueStore, item.ID);
        }
        break;
    }

    VueStore.commit('removePlanogramItem', item);

  }

  getLabelConfig(VueStore) {
    let tmp = VueStore.getters.getLabelConfig;
    return tmp.Order;
  }

  getCtrlDown(VueStore) {
    let tmp = VueStore.getters.getCtrlDown;
    return tmp;
  }

  getCloneItem(VueStore) {
    let tmp = VueStore.getters.getCloneItem;
    return tmp;
  }

  setCtrlDown(VueStore, data) {
    VueStore.commit('setCtrlDown', data);
  }

  setCloneItem(VueStore, data) {
    VueStore.commit('setCloneItem', data);
  }

  setProductData(VueStore, data, barcode) {
    VueStore.commit('setProductData', {
      data,
      barcode
    });
  }
}

export default StoreHelper;
