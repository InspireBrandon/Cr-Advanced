import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";

class IntersectionTester {
  constructor() {

  }

  /**
   * Get the transformed point from where the mouse is on the stage
   * @param {The stage} stage 
   */
  GetTransformedMousePoint(stage) {
    let transform = stage.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();
    // now we find relative point
    let pos = stage.getPointerPosition();
    let dropPos = transform.point(pos);

    return dropPos;
  }

  /**
   * Get the transformed point from an objecs position
   * @param {The stage} stage 
   * @param {The object that contains a konva.position()} object 
   */
  GetTransformedObjectPoint(stage, object) {
    let transform = stage.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();
    // now we find relative point
    let pos = object.position();
    let dropPos = transform.point(pos);

    return dropPos;
  }

  /**
   * Tests an intersection by type passed in
   * @param {*} stage 
   * @param {*} Type - UPPERCASE --> gondola, shelf, basket, base, pegbar, pegboard
   * @param {*} dropPos 
   */
  TestIntersectsWithItem(stage, ItemType, Type, dropPos) {
    let self = this;

    return new Promise((resolve) => {
      var retVal = {
        intersects: false,
        ID: null,
        KonvaFixtureData: null,
        Type: "",
        Position: null,
        AbsolutePos: null,
        ContainerPosition: null
      };

      let intersectRect = {
        x: dropPos.x,
        y: dropPos.y,
        width: 1,
        height: 1
      }

      let itemArr = stage.find('.' + Type.toUpperCase() + '_master_group');
      itemArr.forEach(item => {
        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = {
          x: item.getAbsolutePosition().x,
          y: item.getAbsolutePosition().y
        }

        let itemPos = transform.point(pos);

        let newRect = {
          x: itemPos.x,
          y: itemPos.y,
          width: item.getWidth(),
          height: item.getHeight()
        }

        if (self.hasIntersection(newRect, intersectRect)) {
          retVal.intersects = true;
          retVal.ID = item.getId().replace(Type.toUpperCase() + '_master_group_', "");
          retVal.KonvaFixtureData = item;
          retVal.Type = Type;
          retVal.Position = dropPos;
          retVal.AbsolutePos = itemPos;

          let containerRelativePosition = {
            x: Math.abs(retVal.Position.x - retVal.AbsolutePos.x),
            y: Math.abs(retVal.Position.y - retVal.AbsolutePos.y)
          }

          retVal.ContainerPosition = containerRelativePosition;
        }
      });

      resolve(retVal);
    });
  }

  /**
   * Returns a single intersection by all types passed in
   * @param {*} stage 
   * @param {*} TypeArr - UPPERCASE --> Array - gondola, shelf, basket, base, pegbar, pegboard
   * @param {*} dropPos 
   */
  TestIntersectsWithMany(stage, ItemType, TypeArr, VueStore, dropPosPossibility) {
    let self = this;

    console.log("BECAUSE INTERSECTION???")

    let dropPos = null;

    if (dropPosPossibility == null) {
      dropPos = self.GetTransformedMousePoint(stage);
    } else {
      dropPos = dropPosPossibility;
    }

    return new Promise((resolve) => {
      let promiseArr = [];
      let hasIntersection = false;
      var retVal = {
        intersects: false,
        ID: null,
        KonvaFixtureData: null,
        Type: "",
        Position: null,
        AbsolutePos: null,
        ContainerPosition: null
      };

      TypeArr.forEach(type => {
        promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, type, dropPos));
      });

      Promise.all(promiseArr)
        .then(results => {

          var basketIntrsct = results.find(x => x.Type == "BASKET");
          if (basketIntrsct != undefined && basketIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(basketIntrsct);
            return;
          }

          var pegIntrsct = results.find(x => x.Type == "PEG");
          if(pegIntrsct != undefined && pegIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(pegIntrsct);
            return;
          }

          var shareboxIntrsct = results.find(x => x.Type == "SHAREBOX");

          if (shareboxIntrsct != undefined && shareboxIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(shareboxIntrsct);
            return;
          }

          var shelfIntrsct = results.find(x => x.Type == "SHELF");
          if (shelfIntrsct != undefined && shelfIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(shelfIntrsct);
            return;
          }

          var baseIntrsct = results.find(x => x.Type == "BASE");
          if (baseIntrsct != undefined && baseIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(baseIntrsct);
            return;
          }

          var pegbarIntrsct = results.find(x => x.Type == "PEGBAR");
          if (pegbarIntrsct != undefined && pegbarIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(pegbarIntrsct);
            return;
          }

          var labelHolderIntrsct = results.find(x => x.Type == "LABELHOLDER");
          if (labelHolderIntrsct != undefined && labelHolderIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(labelHolderIntrsct);
            return;
          }

          var pegboardIntrsct = results.find(x => x.Type == "PEGBOARD");
          if (pegboardIntrsct != undefined && pegboardIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(pegboardIntrsct);
            return;
          }

          var areaIntrsct = results.find(x => x.Type == "AREA");
          if (areaIntrsct != undefined && areaIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(areaIntrsct);
            return;
          }

          var gondolaIntrsct = results.find(x => x.Type == "GONDOLA");
          if (gondolaIntrsct != undefined && gondolaIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(gondolaIntrsct);
            return;
          }

          var paletteIntrsct = results.find(x => x.Type == "PALETTE");
          if (paletteIntrsct != undefined && paletteIntrsct.intersects == true) {
            hasIntersection = true;
            resolve(paletteIntrsct);
            return;
          }

          if (hasIntersection == false) {

            // only do this test if you are a specific type [Basket, Product, Sharebox]
            // let containsSpecifcItems = TypeArr.filter(function (el) {
            //   return el == "BASKET" || el == "PRODUCT";
            // });

            console.log("BASKET/PRODUCT/SHAREBOX TEST INTRSCT", ItemType, TypeArr)

            if (ItemType == "BASKET" || ItemType == "PRODUCT" || ItemType == "SHAREBOX") {
              // console.log("BASKET TEST INTRSCT", ItemType)
              self.Internal_TestForIntersectionBelow(VueStore, dropPos, stage)
                .then(finalTestResult => {
                  if (finalTestResult.intersects == false) {
                    console.error("[DROP PRODUCT] HAS NO INTERSECTION", results);
                  }
                  resolve(finalTestResult);
                  return;
                })
                .catch(error => {
                  console.log(error, error.toString());
                  resolve(retVal);
                  return;
                })
            } else {
              // console.error("[DROP PRODUCT] HAS NO INTERSECTION", results);
              resolve(retVal);
              return;
            }
          }
        })
    })
  }

  /**
   * Return the closest intersecting item for the type passed in
   * @param {*} Type 
   * @param {*} stage 
   * @param {*} AllPlanogramItems 
   */
  Internal_TestForIntersectionBelow(VueStore, dropPos, stage) {
    // return the closest element drop item.
    return new Promise((resolve) => {
      let ctrl_store = new StoreHelper();
      var retVal = {
        intersects: false,
        ID: null,
        KonvaFixtureData: null,
        Type: "",
        Position: null,
        AbsolutePos: null,
        ContainerPosition: null
      };

      let intersectRect = {
        x: dropPos.x,
        y: dropPos.y,
        width: 1,
        height: 1
      }

      ctrl_store.getAllPlanogramItems(VueStore);

      let AllPlanogramItems = ctrl_store.getAllPlanogramItems(VueStore);

      let gondolaItems = AllPlanogramItems.filter((el) => el.Type.toUpperCase() == "GONDOLA");

      let activeGondola = null;

      if (gondolaItems.length > 0) {
        gondolaItems.sort((a, b) => (a.Group.getAbsolutePosition().x) - (b.Group.getAbsolutePosition().x))

        gondolaItems.forEach(gondola => {
          let postionX = gondola.Group.getX();
          let postion_total = gondola.Group.getX() + gondola.TotalWidth;

          if (intersectRect.x >= postionX && intersectRect.x <= postion_total) {
            activeGondola = gondola;
          }

        });
      } else {
        resolve(retVal);
        return;
      }

      if (activeGondola == null) {
        resolve(retVal);
        return;
      }

      let children = ctrl_store.getAllPlanogramItems(VueStore, activeGondola.ID);
      children = children.filter((el) => el.Type.toUpperCase() == "SHELF" || el.Type.toUpperCase() == "BASE");

      if (children.length == 0) {
        resolve(retVal);
        return;
      }

      children.sort((a, b) => a.Group.getAbsolutePosition().y - b.Group.getAbsolutePosition().y);

      let transform = stage.getAbsoluteTransform().copy();
      // to detect relative position we need to invert transform
      transform.invert();
      let transformedPoint = transform.point(children[0].Group.getAbsolutePosition());
      console.log("SHELF BASE INTRSCT ABOVE", intersectRect, dropPos, children[0].Group.getAbsolutePosition(), transformedPoint)

      if (intersectRect.y < transformedPoint.y) {
        retVal.intersects = true;
        retVal.ID = children[0].ID;
        retVal.KonvaFixtureData = children[0].Group;
        retVal.Type = children[0].Type;
        retVal.Position = dropPos;
        // retVal.ContainerPosition = children[0].Group.position();

        let containerRelativePosition = {
          x: Math.abs(dropPos.x - children[0].Group.position().x),
          y: Math.abs(dropPos.y - children[0].Group.position().y)
        }

        retVal.ContainerPosition = containerRelativePosition;

        resolve(retVal);
      }

      children.forEach((child, idx) => {
        let position = transform.point(child.Group.getAbsolutePosition());

        if (intersectRect.y > position.y) {

          if ((idx + 1) < children.length) {
            retVal.intersects = true;
            retVal.ID = children[idx + 1].ID;
            retVal.KonvaFixtureData = children[idx + 1].Group;
            retVal.Type = children[idx + 1].Type;
            retVal.Position = dropPos;
            // retVal.ContainerPosition = children[idx + 1].Group.position();
            let containerRelativePosition = {
              x: Math.abs(dropPos.x - children[idx + 1].Group.position().x),
              y: Math.abs(dropPos.y - children[idx + 1].Group.position().y)
            }

            retVal.ContainerPosition = containerRelativePosition;
            resolve(retVal);
            return;
          } else {
            resolve(retVal);
            return;
          }
        }
      });

      resolve(retVal);
    })
  }


  TestIntersectsForAllItems(stage, ItemType, VueStore) {
    let self = this;
    let dropPos = self.GetTransformedMousePoint(stage);

    console.log("INTERSECTION")

    return new Promise((resolve) => {
      let promiseArr = [];
      let types = ["GONDOLA", "SHELF", "BASE", "BASKET", "PEGBAR", "PEGBOARD", "DIVIDER", "AREA", "SHAREBOX", "PEG"];

      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "GONDOLA", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "AREA", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "PALETTE", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "SHELF", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "BASE", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "PEGBAR", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "LABELHOLDER", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "PEGBOARD", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "BASKET", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "PEG", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "DIVIDER", dropPos));
      promiseArr.push(self.TestIntersectsWithItem(stage, ItemType, "SHAREBOX", dropPos));

      Promise.all(promiseArr)
        .then(results => {
          resolve(results);
        })
    })
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

export default IntersectionTester;