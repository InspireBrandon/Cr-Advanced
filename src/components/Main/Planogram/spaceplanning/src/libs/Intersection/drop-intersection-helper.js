class IntersectionHelper {
  constructor() {

  }

  DropIntersectsGondola(stage, dropPos) {
    var retVal = {
      intersects: false,
      gondolaID: null
    };

    let self = this;
    let gondolas = stage.find('.gondola_group');
    let intersectRect = {
      x: dropPos.x,
      y: dropPos.y,
      width: 1,
      height: 1
    }

    gondolas.forEach(gondola => {

      let transform = stage.getAbsoluteTransform().copy();
      // to detect relative position we need to invert transform
      transform.invert();
      // now we find relative point
      let pos = {
        x: gondola.getClientRect().x,
        y: gondola.getClientRect().y
      }

      let gondolaPos = transform.point(pos);

      let newRect = {
        x: gondolaPos.x,
        y: gondolaPos.y,
        width: gondola.getWidth(),
        height: gondola.getHeight()
      }

      if (self.hasIntersection(newRect, intersectRect)) {
        retVal.intersects = true;
        retVal.gondolaID = gondola.getId().replace("gondola_group_", "");
      }
    });

    return retVal;
  }

  DetermineProductIntersection(stage, dropPos) {
    console.log(stage, dropPos)
    let self = this;
    return new Promise((resolve) => {
      var retVal = {
        intersects: false,
        ID: null,
        KonvaFixtureData: null,
        Type: null,
        Position: null
      };

      var intersectsPromiseArr = [];
      intersectsPromiseArr.push(self.IntersectsBasket(stage, dropPos, self));
      intersectsPromiseArr.push(self.IntersectsShelf(stage, dropPos, self));
      intersectsPromiseArr.push(self.IntersectsPegbar(stage, dropPos, self));
      intersectsPromiseArr.push(self.IntersectsPegboard(stage, dropPos, self));

      Promise.all(intersectsPromiseArr)
      .then(results => {
        console.log("[DROP PRODUCT] RESULTS", results);
        let hasIntersection = false;
        var basketIntrsct = results.find(x=> x.Type == "BASKET");
        if (basketIntrsct != undefined && basketIntrsct.intersects == true) {
          console.log("[DROP PRODUCT] Basket Result", basketIntrsct);
          hasIntersection = true;
          resolve(basketIntrsct);
          return;
        }

        var shelfIntrsct = results.find(x=> x.Type == "SHELF");
        if (shelfIntrsct != undefined && shelfIntrsct.intersects == true) {
          console.log("[DROP PRODUCT] Shelf Result", shelfIntrsct);
          hasIntersection = true;
          resolve(shelfIntrsct);
          return;
        }

        var pegbarIntrsct = results.find(x=> x.Type == "PEGBAR");
        if (pegbarIntrsct != undefined && pegbarIntrsct.intersects == true) {
          console.log("[DROP PRODUCT] Pegbar Result", pegbarIntrsct);
          hasIntersection = true;
          resolve(pegbarIntrsct);
          return;
        }

        var pegboardIntrsct = results.find(x=> x.Type == "PEGBOARD");
        if (pegboardIntrsct != undefined && pegboardIntrsct.intersects == true) {
          console.log("[DROP PRODUCT] Pegboard Result", pegboardIntrsct);
          hasIntersection = true;
          resolve(pegboardIntrsct);
          return;
        }

        if (hasIntersection == false) {
          console.error("[DROP PRODUCT] HAS NO INTERSECTION");
          resolve(retVal);
        }
      });
    })
  }

  DetermineSubFixtureIntersection(stage, dropPos) {
    console.log(stage, dropPos)
    let self = this;

    return new Promise((resolve) => {
      var retVal = {
        intersects: false,
        ID: null,
        KonvaFixtureData: null,
        Type: null,
        Position: null
      };

      var intersectsPromiseArr = [];
      intersectsPromiseArr.push(self.IntersectsShelf(stage, dropPos, self));
      intersectsPromiseArr.push(self.IntersectsPegbar(stage, dropPos, self));
      intersectsPromiseArr.push(self.IntersectsPegboard(stage, dropPos, self));

      Promise.all(intersectsPromiseArr)
      .then(results => {
        let hasIntersection = false;
        var shelfIntrsct = results.find(x=> x.Type == "SHELF");
        if (shelfIntrsct != undefined && shelfIntrsct.intersects == true) {
          console.log("[DROP SUBFIXTURE] Shelf Result", shelfIntrsct);
          hasIntersection = true;
          resolve(shelfIntrsct);
          return;
        }

        var pegbarIntrsct = results.find(x=> x.Type == "PEGBAR");
        if (pegbarIntrsct != undefined && pegbarIntrsct.intersects == true) {
          console.log("[DROP SUBFIXTURE] Pegbar Result", pegbarIntrsct);
          hasIntersection = true;
          resolve(pegbarIntrsct);
          return;
        }

        var pegboardIntrsct = results.find(x=> x.Type == "PEGBOARD");
        if (pegboardIntrsct != undefined && pegboardIntrsct.intersects == true) {
          console.log("[DROP SUBFIXTURE] Pegboard Result", pegboardIntrsct);
          hasIntersection = true;
          resolve(pegboardIntrsct);
          return;
        }

        if (hasIntersection == false) {
          console.error("[DROP SUBFIXTURE] HAS NO INTERSECTION");
          resolve(retVal);
        }
      });
    })
  }

  IntersectsShelf(stage, dropPos, selfObj) {
    let self = selfObj;

    return new Promise((resolve) => {
      var retVal = {
        intersects: false,
        ID: null,
        KonvaFixtureData: null,
        Type: null,
        Position: null
      };

      let intersectRect = {
        x: dropPos.x,
        y: dropPos.y,
        width: 1,
        height: 1
      }

      //#region Shelves
      let shelves = stage.find('.shelf_client_rect');
      shelves.forEach(shelf => {

        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = {
          x: shelf.getClientRect().x,
          y: shelf.getClientRect().y
        }

        let shelfPos = transform.point(pos);

        let newRect = {
          x: shelfPos.x,
          y: shelfPos.y,
          width: shelf.getWidth(),
          height: shelf.getHeight()
        }

        if (self.hasIntersection(newRect, intersectRect)) {
          retVal.intersects = true;
          retVal.ID = shelf.getId().replace("shelf_client_rect_", "");
          retVal.KonvaFixtureData = shelf;
          retVal.Type = "SHELF";
          retVal.Position = dropPos;
        }
      });
      //#endregion

      resolve(retVal);
    })
  }

  IntersectsPegbar(stage, dropPos, selfObj) {
    let self = selfObj;

    return new Promise((resolve) => {
      let retVal = {
        intersects: false,
        ID: null,
        KonvaFixtureData: null,
        Type: null,
        Position: null
      };

      let intersectRect = {
        x: dropPos.x,
        y: dropPos.y,
        width: 1,
        height: 1
      }

      //#region Hanging Bar
      let hangingBars = stage.find('.pegbar_group');
      hangingBars.forEach(hangingBar => {

        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = {
          x: hangingBar.getClientRect().x,
          y: hangingBar.getClientRect().y
        }

        let hangingBarPos = transform.point(pos);

        let newRect = {
          x: hangingBarPos.x,
          y: hangingBarPos.y,
          width: hangingBar.getWidth(),
          height: hangingBar.getHeight()
        }

        if (self.hasIntersection(newRect, intersectRect)) {
          retVal.intersects = true;
          retVal.ID = hangingBar.getId().replace("pegbar_group_", "");
          retVal.KonvaFixtureData = hangingBar;
          retVal.Type = "PEGBAR";
          retVal.Position = dropPos;
        }
      });
      //#endregion
      resolve(retVal);
    })
  }

  IntersectsPegboard(stage, dropPos, selfObj) {
    let self = selfObj;
    return new Promise((resolve) => {
      var retVal = {
        intersects: false,
        ID: null,
        KonvaFixtureData: null,
        Type: null,
        Position: null
      };

      let intersectRect = {
        x: dropPos.x,
        y: dropPos.y,
        width: 1,
        height: 1
      }

      //#region Pegboards
      let pegboards = stage.find('.pegboard_group');
      pegboards.forEach(pegboard => {

        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = {
          x: pegboard.getClientRect().x,
          y: pegboard.getClientRect().y
        }

        let pegboardPos = transform.point(pos);

        let newRect = {
          x: pegboardPos.x,
          y: pegboardPos.y,
          width: pegboard.getWidth(),
          height: pegboard.getHeight()
        }

        if (self.hasIntersection(newRect, intersectRect)) {
          retVal.intersects = true;
          retVal.ID = pegboard.getId().replace("pegboard_group_", "");
          retVal.KonvaFixtureData = pegboard;
          retVal.Type = "PEGBOARD";
          retVal.Position = dropPos;
        }
      });
      //#endregion

      resolve(retVal);
    })
  }

  IntersectsBasket(stage, dropPos, selfObj) {
    let self = selfObj;
    return new Promise((resolve) => {

      var retVal = {
        intersects: false,
        ID: null,
        KonvaFixtureData: null,
        Type: null,
        Position: null
      };

      let intersectRect = {
        x: dropPos.x,
        y: dropPos.y,
        width: 1,
        height: 1
      }

      //#region Basket
      let baskets = stage.find('.basket_group');
      baskets.forEach(basket => {

        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = {
          x: basket.getClientRect().x,
          y: basket.getClientRect().y
        }

        let basketPos = transform.point(pos);

        let newRect = {
          x: basketPos.x,
          y: basketPos.y,
          width: basket.getWidth(),
          height: basket.getHeight()
        }

        if (self.hasIntersection(newRect, intersectRect)) {
          retVal.intersects = true;
          retVal.ID = basket.getId().replace("basket_group_", "");
          retVal.KonvaFixtureData = basket;
          retVal.Type = "BASKET";
          retVal.Position = dropPos;
        }
      });
      //#endregion

      resolve(retVal);
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

export default IntersectionHelper;