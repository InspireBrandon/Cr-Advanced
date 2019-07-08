import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
class GeneralPosition {
  constructor() {

  }

  /**
   * Purpose is to determine the new position of the basket with other elements on the shelf
   * @param {*} VueStore - required
   * @param {*} currentItem - required
   * @param {*} parentObject - Optional
   */
  PositionToParent(VueStore, currentItem, parentID = null) {
    let ctrl_store = new StoreHelper();
    let pID = parentID;
    let parent = null;

    // console.log("[GERNEAL POSITIONING] CALLED");

    // get the parent
    if (pID == null) {
      if (currentItem != null) {
        parent = ctrl_store.getPlanogramItemById(VueStore, currentItem.ParentID);
      } else {
        console.error("[GERNEAL POSITIONING] Could not determine the parent of this element and therefore cannot position elements to parent.");
        return;
      }
    } else {
      parent = ctrl_store.getPlanogramItemById(VueStore, pID);
    }

    if (parent == null) {
      console.error("[GERNEAL POSITIONING] Failed to find item's parent");
      return;
    }

    // get all items within this parent
    let allParentItems = ctrl_store.getAllPlanogramItems(VueStore, pID);
    // let sortedArr = allParentItems.filter((el) => el.Type.toUpperCase() == "BASKET" || el.Type.toUpperCase() == "PRODUCT")
    // sort them by x/y
    let sortedArr = allParentItems.sort((a, b) => a.Group.getX() - b.Group.getX());

    // get the spread type of the fixture
    let spreadType = parent.Data.spreadProducts;
    let merchOffset = (parent.Data.merchandisingOffset == undefined ? 0 : parent.Data.merchandisingOffset) * 3; // TODO: PASS THIS IN ITS THE RATIO;

    switch (parent.Type.toUpperCase()) {
      case "PALETTE": {
        // free transform
        // let x = 0;
        // sortedArr.forEach(item => {
        //   item.Group.setX(x);
        //   x += item.TotalWidth + 0.1;
        // });

        // if (currentItem != null) {
        //   let y = (currentItem.TotalHeight) * -1;
        //   currentItem.Group.setY(y);
        // }
      }
      break;
    case "AREA": {
      if (currentItem != null) {
        let y = parent.Group.getHeight() - (currentItem.TotalHeight);
        currentItem.Group.setY(y);

        currentItem.LastPositionRelative = currentItem.Group.position();
        currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
      }
    }
    break;
    case "BASE": {
      switch (spreadType.toUpperCase()) {
        case "L2R": {
          let squish = parent.GetSquishValue(parent.ID);

          let x = merchOffset;
          sortedArr.forEach((item, idx) => {
            item.Position = idx + 1;
            item.Group.setX(x);
            item.LastPositionRelative = item.Group.position();
            item.LastPositionAbsolute = item.Group.getAbsolutePosition();

            if (item.Type == "PRODUCT") {
              let actualWidth = item.Orientation_Width * item.Facings_X;
              x += ((actualWidth - (item.Facings_X * squish))) + 0.1;
            } else {
              let actualWidth = item.TotalWidth;
              x += (actualWidth) + 0.1;
            }

          });

          if (currentItem != null) {
            let y = (currentItem.TotalHeight) * -1;
            currentItem.Group.setY(y);

            currentItem.LastPositionRelative = currentItem.Group.position();
            currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
          }
        }
        break;
      case "R2L": {
        let x = parent.TotalWidth - merchOffset;
        sortedArr.reverse();
        sortedArr.forEach((item, idx) => {
          x -= item.TotalWidth + 0.1;
          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();
        });

        if (currentItem != null) {
          let y = (currentItem.TotalHeight) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "SE": {
        let x = merchOffset;
        let totalItemWidths = 0;
        let totalItems = 0;
        let parentWidth = parent.TotalWidth;
        let spacing = 0;

        if (sortedArr.length > 1) {
          totalItems = sortedArr.length - 1;
        } else {
          totalItems = 1;
        }

        sortedArr.forEach((item) => {
          totalItemWidths += item.TotalWidth;
        });

        spacing = (parentWidth - totalItemWidths) / totalItems;

        // x = spacing;
        sortedArr.forEach((item, idx) => {

          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();

          x += (item.TotalWidth) + spacing;
        });

        if (currentItem != null) {
          let y = (currentItem.TotalHeight) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }

      }
      break;
      case "SFE": {
        let x = merchOffset;
        let spacing = 0;

        spacing = parent.GetSpreadSpacing(parent.ID);
        // squish = parent.GetSpreadSpacing(parent.ID);

        parent.TotalChildren.sort((a, b) => a.Item.Group.getX() - b.Item.Group.getX())

        parent.TotalChildren.forEach((item, idx) => {
          let groupWidth = (item.Width * item.Count) + ((item.Count - 1) * (spacing));

          item.Item.Position = idx + 1;

          item.Item.Group.setX(x);
          item.Item.LastPositionRelative = item.Item.Group.position();
          item.Item.LastPositionAbsolute = item.Item.Group.getAbsolutePosition();

          x = x + groupWidth + (spacing);
        });

        if (currentItem != null) {
          let y = (currentItem.TotalHeight) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "PWD": {
        if (currentItem != null) {
          let y = (currentItem.TotalHeight) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      default: {
        let squish = parent.GetSquishValue(parent.ID);

        let x = merchOffset;
        sortedArr.forEach((item, idx) => {
          let actualWidth = item.Orientation_Width * item.Facings_X;
          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();

          if (item.Type == "PRODUCT") {
            x += ((actualWidth - (item.Facings_X * squish))) + 0.1;
          } else {
            x += (actualWidth - (item.Facings_X * squish)) + 0.1;
          }

        });

        if (currentItem != null) {
          let y = (currentItem.TotalHeight) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      }
    }
    break;
    case "SHELF": {
      switch (spreadType.toUpperCase()) {
        case "L2R": {
          let squish = parent.GetSquishValue(parent.ID);

          let x = merchOffset;
          sortedArr.forEach((item, idx) => {
            item.Position = idx + 1;
            item.Group.setX(x);
            item.LastPositionRelative = item.Group.position();
            item.LastPositionAbsolute = item.Group.getAbsolutePosition();

            if (item.Type == "PRODUCT") {
              let actualWidth = item.Orientation_Width * item.Facings_X;
              x += ((actualWidth - (item.Facings_X * squish))) + 0.1;
            } else {
              let actualWidth = item.TotalWidth;
              x += (actualWidth) + 0.1;
            }
          });

          if (currentItem != null) {
            let y = (currentItem.TotalHeight) * -1;
            currentItem.Group.setY(y);

            currentItem.LastPositionRelative = currentItem.Group.position();
            currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
          }
        }
        break;
      case "R2L": {
        let x = parent.TotalWidth - merchOffset;
        sortedArr.reverse();
        sortedArr.forEach((item, idx) => {
          x -= item.TotalWidth + 0.1;
          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();
        });

        if (currentItem != null) {
          let y = (currentItem.TotalHeight) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "SE": {
        let x = merchOffset;
        let totalItemWidths = 0;
        let totalItems = 0;
        let parentWidth = parent.TotalWidth;
        let spacing = 0;

        if (sortedArr.length > 1) {
          totalItems = sortedArr.length - 1;
        } else {
          totalItems = 1;
        }

        sortedArr.forEach((item) => {
          totalItemWidths += item.TotalWidth;
        });

        spacing = (parentWidth - totalItemWidths) / totalItems;

        // x = spacing;
        sortedArr.forEach((item, idx) => {

          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();

          x += (item.TotalWidth) + spacing;
        });

        if (currentItem != null) {
          let y = (currentItem.TotalHeight) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }

      }
      break;
      case "SFE": {
        let x = merchOffset;
        let spacing = 0;

        spacing = parent.GetSpreadSpacing(parent.ID);
        // squish = parent.GetSpreadSpacing(parent.ID);

        parent.TotalChildren.sort((a, b) => a.Item.Group.getX() - b.Item.Group.getX())

        parent.TotalChildren.forEach((item, idx) => {
          let groupWidth = (item.Width * item.Count) + ((item.Count - 1) * (spacing));

          item.Item.Position = idx + 1;

          item.Item.Group.setX(x);
          item.Item.LastPositionRelative = item.Item.Group.position();
          item.Item.LastPositionAbsolute = item.Item.Group.getAbsolutePosition();

          x = x + groupWidth + (spacing);
        });

        if (currentItem != null) {
          let y = (currentItem.TotalHeight) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "PWD": {
        if (currentItem != null) {
          let y = (currentItem.TotalHeight) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      default: {
        let squish = parent.GetSquishValue(parent.ID);

        let x = merchOffset;
        sortedArr.forEach((item, idx) => {
          let actualWidth = item.Orientation_Width * item.Facings_X;
          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();

          if (item.Type == "PRODUCT") {
            x += ((actualWidth - (item.Facings_X * squish))) + 0.1;
          } else {
            x += (actualWidth - (item.Facings_X * squish)) + 0.1;
          }
        });

        if (currentItem != null) {
          let y = (currentItem.TotalHeight) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      }
    }
    break;
    case "BASKET": {
      switch (spreadType.toUpperCase()) {
        case "L2R": {
          let squish = parent.GetSquishValue(parent.ID);

          let x = merchOffset;
          sortedArr.forEach((item, idx) => {
            item.Position = idx + 1;
            item.Group.setX(x);
            item.LastPositionRelative = item.Group.position();
            item.LastPositionAbsolute = item.Group.getAbsolutePosition();

            if (item.Type == "PRODUCT") {
              let actualWidth = item.Orientation_Width * item.Facings_X;
              x += ((actualWidth - (item.Facings_X * squish))) + 0.1;
            } else {
              let actualWidth = item.TotalWidth;
              x += (actualWidth) + 0.1;
            }

          });

          if (currentItem != null) {
            let y = parent.Group.getHeight() - (currentItem.TotalHeight);
            currentItem.Group.setY(y);

            currentItem.LastPositionRelative = currentItem.Group.position();
            currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
          }
        }
        break;
      case "R2L": {
        let x = parent.TotalWidth - merchOffset;
        sortedArr.reverse();
        sortedArr.forEach((item, idx) => {
          x -= item.TotalWidth + 0.1;
          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();
        });

        if (currentItem != null) {
          let y = parent.Group.getHeight() - (currentItem.TotalHeight);
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "SE": {
        let x = merchOffset;
        let totalItemWidths = 0;
        let totalItems = 0;
        let parentWidth = parent.TotalWidth;
        let spacing = 0;

        if (sortedArr.length > 1) {
          totalItems = sortedArr.length - 1;
        } else {
          totalItems = 1;
        }

        sortedArr.forEach((item) => {
          totalItemWidths += item.TotalWidth;
        });

        spacing = (parentWidth - totalItemWidths) / totalItems;

        // x = spacing;
        sortedArr.forEach((item, idx) => {

          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();

          x += (item.TotalWidth) + spacing;
        });

        if (currentItem != null) {
          let y = parent.Group.getHeight() - (currentItem.TotalHeight);
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }

      }
      break;
      case "SFE": {
        let x = merchOffset;
        let spacing = 0;

        spacing = parent.GetSpreadSpacing(parent.ID);
        // squish = parent.GetSpreadSpacing(parent.ID);

        parent.TotalChildren.sort((a, b) => a.Item.Group.getX() - b.Item.Group.getX())

        parent.TotalChildren.forEach((item, idx) => {
          let groupWidth = (item.Width * item.Count) + ((item.Count - 1) * (spacing));

          item.Item.Position = idx + 1;

          item.Item.Group.setX(x);
          item.Item.LastPositionRelative = item.Item.Group.position();
          item.Item.LastPositionAbsolute = item.Item.Group.getAbsolutePosition();

          x = x + groupWidth + (spacing);
        });

        if (currentItem != null) {
          let y = parent.Group.getHeight() - (currentItem.TotalHeight);
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "PWD": {
        if (currentItem != null) {
          let y = parent.Group.getHeight() - (currentItem.TotalHeight);
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      default: {
        let squish = parent.GetSquishValue(parent.ID);

        let x = merchOffset;
        sortedArr.forEach((item, idx) => {
          let actualWidth = item.Orientation_Width * item.Facings_X;
          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();

          if (item.Type == "PRODUCT") {
            x += ((actualWidth - (item.Facings_X * squish))) + 0.1;
          } else {
            x += (actualWidth - (item.Facings_X * squish)) + 0.1;
          }

        });

        if (currentItem != null) {
          let y = parent.Group.getHeight() - (currentItem.TotalHeight);
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      }
    }
    break;
    case "PEG": {
      if (currentItem != null) {
        let y = parent.Group.getHeight() - (currentItem.TotalHeight);
        currentItem.Group.setY(y);

        currentItem.LastPositionRelative = currentItem.Group.position();
        currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
      }
    }
    break;
    case "PEGBAR": {
      switch (spreadType.toUpperCase()) {
        case "L2R": {
          let squish = parent.GetSquishValue(parent.ID);

          let x = merchOffset;
          sortedArr.forEach((item, idx) => {
            item.Position = idx + 1;
            item.Group.setX(x);
            item.LastPositionRelative = item.Group.position();
            item.LastPositionAbsolute = item.Group.getAbsolutePosition();

            if (item.Type == "PRODUCT") {
              let actualWidth = item.Orientation_Width * item.Facings_X;
              x += ((actualWidth - (item.Facings_X * squish))) + 0.1;
            } else {
              let actualWidth = item.TotalWidth;
              x += (actualWidth) + 0.1;
            }

          });

          if (currentItem != null) {
            // let y = (parent.TotalHeight / 2);
            let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
            currentItem.Group.setY(y);

            currentItem.LastPositionRelative = currentItem.Group.position();
            currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
          }
        }
        break;
      case "R2L": {
        let x = parent.TotalWidth - merchOffset;
        sortedArr.reverse();
        sortedArr.forEach((item, idx) => {
          x -= item.TotalWidth + 0.1;
          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();
        });

        if (currentItem != null) {
          // let y = (parent.TotalHeight / 2);
          let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "SE": {
        let x = merchOffset;
        let totalItemWidths = 0;
        let totalItems = 0;
        let parentWidth = parent.TotalWidth;
        let spacing = 0;

        if (sortedArr.length > 1) {
          totalItems = sortedArr.length - 1;
        } else {
          totalItems = 1;
        }

        sortedArr.forEach((item) => {
          totalItemWidths += item.TotalWidth;
        });

        spacing = (parentWidth - totalItemWidths) / totalItems;

        // x = spacing;
        sortedArr.forEach((item, idx) => {

          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();

          x += (item.TotalWidth) + spacing;
        });

        if (currentItem != null) {
          // let y = (parent.TotalHeight / 2);
          let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }

      }
      break;
      case "SFE": {
        let x = merchOffset;
        let spacing = 0;

        spacing = parent.GetSpreadSpacing(parent.ID);
        // squish = parent.GetSpreadSpacing(parent.ID);

        parent.TotalChildren.sort((a, b) => a.Item.Group.getX() - b.Item.Group.getX())

        parent.TotalChildren.forEach((item, idx) => {
          let groupWidth = (item.Width * item.Count) + ((item.Count - 1) * (spacing));

          item.Item.Position = idx + 1;

          item.Item.Group.setX(x);
          item.Item.LastPositionRelative = item.Item.Group.position();
          item.Item.LastPositionAbsolute = item.Item.Group.getAbsolutePosition();

          x = x + groupWidth + (spacing);
        });

        if (currentItem != null) {
          // let y = (parent.TotalHeight / 2);
          let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "PWD": {
        if (currentItem != null) {
          // let y = (parent.TotalHeight / 2);
          let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "PWDXY": {
        // if (currentItem != null) {
        //   // let y = (parent.TotalHeight / 2);
        //   let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
        //   currentItem.Group.setY(y);

        //   currentItem.LastPositionRelative = currentItem.Group.position();
        //   currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        // }
      }
      break;
      default: {
        let squish = parent.GetSquishValue(parent.ID);

        let x = merchOffset;
        sortedArr.forEach((item, idx) => {
          let actualWidth = item.Orientation_Width * item.Facings_X;

          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();

          if (item.Type == "PRODUCT") {
            x += ((actualWidth - (item.Facings_X * squish))) + 0.1;
          } else {
            x += (actualWidth - (item.Facings_X * squish)) + 0.1;
          }

        });

        if (currentItem != null) {
          // let y = (parent.TotalHeight / 2);
          let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      }
    }
    break;
    case "PEGBOARD": {
      //
    }
    break;
    case "LABELHOLDER": {
      switch (spreadType.toUpperCase()) {
        case "L2R": {
          let squish = parent.GetSquishValue(parent.ID);

          let x = merchOffset;
          sortedArr.forEach((item, idx) => {
            let actualWidth = item.Orientation_Width * item.Facings_X;

            item.Position = idx + 1;
            item.Group.setX(x);
            item.LastPositionRelative = item.Group.position();
            item.LastPositionAbsolute = item.Group.getAbsolutePosition();

            if (item.Type == "PRODUCT") {
              x += ((actualWidth - (item.Facings_X * squish))) + 0.1;
            } else {
              x += (actualWidth - (item.Facings_X * squish)) + 0.1;
            }

          });

          if (currentItem != null) {
            // let y = (parent.TotalHeight / 2);
            let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
            currentItem.Group.setY(y);

            currentItem.LastPositionRelative = currentItem.Group.position();
            currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
          }
        }
        break;
      case "R2L": {
        let x = parent.TotalWidth - merchOffset;
        sortedArr.reverse();
        sortedArr.forEach((item, idx) => {
          x -= item.TotalWidth + 0.1;
          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();
        });

        if (currentItem != null) {
          // let y = (parent.TotalHeight / 2);
          let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "SE": {
        let x = merchOffset;
        let totalItemWidths = 0;
        let totalItems = 0;
        let parentWidth = parent.TotalWidth;
        let spacing = 0;

        if (sortedArr.length > 1) {
          totalItems = sortedArr.length - 1;
        } else {
          totalItems = 1;
        }

        sortedArr.forEach((item) => {
          totalItemWidths += item.TotalWidth;
        });

        spacing = (parentWidth - totalItemWidths) / totalItems;

        // x = spacing;
        sortedArr.forEach((item, idx) => {

          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();

          x += (item.TotalWidth) + spacing;
        });

        if (currentItem != null) {
          // let y = (parent.TotalHeight / 2);
          let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }

      }
      break;
      case "SFE": {
        let x = merchOffset;
        let spacing = 0;

        spacing = parent.GetSpreadSpacing(parent.ID);
        // squish = parent.GetSpreadSpacing(parent.ID);

        parent.TotalChildren.sort((a, b) => a.Item.Group.getX() - b.Item.Group.getX())

        parent.TotalChildren.forEach((item, idx) => {
          let groupWidth = (item.Width * item.Count) + ((item.Count - 1) * (spacing));

          item.Item.Position = idx + 1;

          item.Item.Group.setX(x);
          item.Item.LastPositionRelative = item.Item.Group.position();
          item.Item.LastPositionAbsolute = item.Item.Group.getAbsolutePosition();

          x = x + groupWidth + (spacing);
        });

        if (currentItem != null) {
          // let y = (parent.TotalHeight / 2);
          let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "PWD": {
        if (currentItem != null) {
          // let y = (parent.TotalHeight / 2);
          let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      case "PWDXY": {
        // if (currentItem != null) {
        //   // let y = (parent.TotalHeight / 2);
        //   let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
        //   currentItem.Group.setY(y);

        //   currentItem.LastPositionRelative = currentItem.Group.position();
        //   currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        // }
      }
      break;
      default: {
        let squish = parent.GetSquishValue(parent.ID);

        let x = merchOffset;
        sortedArr.forEach((item, idx) => {
          let actualWidth = item.Orientation_Width * item.Facings_X;

          item.Position = idx + 1;
          item.Group.setX(x);
          item.LastPositionRelative = item.Group.position();
          item.LastPositionAbsolute = item.Group.getAbsolutePosition();

          if (item.Type == "PRODUCT") {
            x += ((actualWidth - (item.Facings_X * squish))) + 0.1;
          } else {
            x += (actualWidth - (item.Facings_X * squish)) + 0.1;
          }

        });

        if (currentItem != null) {
          // let y = (parent.TotalHeight / 2);
          let y = (parent.Data.productOffset == undefined ? 0 : parent.Data.productOffset) * -1;
          currentItem.Group.setY(y);

          currentItem.LastPositionRelative = currentItem.Group.position();
          currentItem.LastPositionAbsolute = currentItem.Group.getAbsolutePosition();
        }
      }
      break;
      }
    }
    break;
    }
  }

  /**
   * Position the product items within its parent container
   * @param {*} yFacings - required. Y Facings number for position
   * @param {*} xFacings - required. X Facings number for position
   */
  PositionProductItems(yFacings, xFacings, productGroup) {
    var retVal = {
      x: 0,
      y: 0
    };

    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(productGroup.VueStore, productGroup.ParentID);

    switch (parentItem.Type.toUpperCase()) {
      case "SHELF": {
        // if (spreadType == "SE") {
        //   let totalItemWidths = 0;
        //   let totalItems = 0;
        //   let parentWidth = parentItem.TotalWidth;
        //   let spacing = 0;

        //   if (sortedArr.length > 1) {
        //     totalItems = sortedArr.length;
        //   } else {
        //     totalItems = 1;
        //   }

        //   sortedArr.forEach((item, idx) => {
        //     totalItemWidths += item.TotalWidth;
        //   });

        //   spacing = (parentWidth - totalItemWidths) / totalItems;
        //   retVal.y = productGroup.Group.getHeight() - ((yFacings + 1) * productGroup.Orientation_Height);
        //   retVal.x = (xFacings * (productGroup.Orientation_Width + spacing));
        //   productGroup.TotalWidth = (productGroup.Facings_X * (productGroup.Orientation_Width + spacing))
        //   console.log("[PRODUCT FACING SPREAD]", retVal, spacing, totalItems, parentWidth, totalItemWidths, productGroup);

        //   return retVal;
        // } else {
        //   retVal.y = productGroup.Group.getHeight() - ((yFacings + 1) * productGroup.Orientation_Height);
        //   retVal.x = (xFacings * productGroup.Orientation_Width);
        //   productGroup.TotalWidth = (productGroup.Facings_X * (productGroup.Orientation_Width))
        //   return retVal;
        // }

        retVal.y = productGroup.Group.getHeight() - ((yFacings + 1) * productGroup.Orientation_Height);
        retVal.x = (xFacings * productGroup.Orientation_Width);
        return retVal;
      }
      case "BASE": {
        retVal.y = productGroup.Group.getHeight() - ((yFacings + 1) * productGroup.Orientation_Height);
        retVal.x = (xFacings * productGroup.Orientation_Width);
        return retVal;
      }
      case "PEGBAR": {
        // retVal.y = (parentItem.Group.getHeight() / 2);
        // retVal.x = (xFacings * productGroup.Orientation_Width);
        // return retVal;

        retVal.y = productGroup.Group.getHeight() - ((yFacings + 1) * productGroup.Orientation_Height);
        retVal.x = (xFacings * productGroup.Orientation_Width);
        return retVal;
      }
      case "LABELHOLDER": {
        // retVal.y = (parentItem.Group.getHeight() / 2);
        // retVal.x = (xFacings * productGroup.Orientation_Width);
        // return retVal;

        retVal.y = productGroup.Group.getHeight() - ((yFacings + 1) * productGroup.Orientation_Height);
        retVal.x = (xFacings * productGroup.Orientation_Width);
        return retVal;
      }
      case "BASKET": {
        retVal.y = productGroup.Group.getHeight() - ((yFacings + 1) * productGroup.Orientation_Height);
        retVal.x = (xFacings * productGroup.Orientation_Width);
        return retVal;
      }
      case "PEGBOARD": {

        retVal.y = productGroup.Group.getHeight() - ((yFacings + 1) * productGroup.Orientation_Height);
        retVal.x = (xFacings * productGroup.Orientation_Width);
        return retVal;
      }
      case "PALETTE": {
        retVal.y = productGroup.Group.getHeight() - ((yFacings + 1) * productGroup.Orientation_Height);
        retVal.x = (xFacings * productGroup.Orientation_Width);
        return retVal;
      }
    }

  }

  hasIntersection(r1, r2) {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }
}

export default GeneralPosition;