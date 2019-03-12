import EntityHelper from '@/components/Main/Planogram/spaceplanning/src/libs/EntityHelper/entity-helper.js'
import ProductGroup from '@/components/Main/Planogram/spaceplanning/src/libs/Product/ProductGroup.js'
import PositioningBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/PositioningBase.js';

class SubFixtureBase {
  constructor(VueStore, fixtureID, FixtureData, ratio) {
    this.ID = this.guid();

    if (ratio)
      this.Ratio = ratio;
    else
      this.Ratio = 1;

    this.VueStore = VueStore;
    this.FixtureID = fixtureID;
    this.Type = FixtureData.Type;
    this.FixtureType = null;
    this.Position = 0;
    this.Group = null;
    this.Layer = null;
    this.FixtureData = FixtureData;
    this.ProductGroupArray = [];
    this.SubFixtures = [];
    this.FixtureLabel = null;
    this.FixtureNumber = null;
    this.ClientRectIntersection = null;
    this.ClientRect = null;
    this.DrawClientRect = false;
    this.FixtureConfig = {
      ProductSpacing: 0 * ratio
    }
    this.CloneSettings = {
      CtrlIsDown: false,
      CloneListening: true
    }
    this.Stage = null;
  }

  LoadFromFile(stage, data) {

  }

  CalculateAllProductAndSubfixturePositions() {
    let self = this;
    console.log("[SUB FIXTURE] Calculate all children positions", self, self.ClientRect);


    let ctrl_positioning = new PositioningBase();
    ctrl_positioning.Calculate_AllProductAndSubfixturePositions(self);
  }

  AddToShelf(shelf) {
    let self = this;
    self.FixtureType = "SHELF";
    self.Position = 0;

    let ctrl_positioning = new PositioningBase();

    //#region remove this group from previous shelf if any
    if (self.FixtureID != null) {
      self.Store_RemoveSubFixtureFromFixture();
    }
    //#endregion

    let shelf_id = shelf.getId().replace("shelf_client_rect_", "");
    let shelfInstance = self.Store_GetFixtureByID(shelf_id);

    if (shelfInstance != null && shelfInstance != undefined) {

      ctrl_positioning.SetFixtureChildrenPositionNumbers(shelfInstance); // re-order first
      self.CallParentFixture_CalculateNewPositions();

      // assign the subfixture to the parent fixture.
      self.FixtureID = shelfInstance.ID;
      // Re-Add sub fixture to fixture

      let x = shelfInstance.Group.getX();

      let posArr = ctrl_positioning.GetFixtureSubFixtureGroupPositionArray(shelfInstance);

      posArr.forEach(element => {
        if (element.constructor.name == "ProductGroup") {
          x += element.TotalWidth;
        } else if (element.constructor.name == "Basket") {
          x += element.Group.getWidth();
        }
      });

      self.Group.position({
        x: x,
        y: shelf.getY() + (shelf.getHeight() - (self.FixtureData.height * self.Ratio))
      });

      self.ClientRect.position({
        x: x,
        y: shelf.getY() + (shelf.getHeight() - (self.FixtureData.height * self.Ratio))
      });

      console.log("[SUB FIXTURE] Adding back to shelf");
      self.Store_AddSubFixtureToFixture(self.FixtureID);

      ctrl_positioning.SetFixtureChildrenPositionNumbers(shelfInstance);
      self.CallParentFixture_CalculateNewPositions();
      self.DetermineFixturePosition();

      self.ProductGroupArray.forEach(product => {
        product.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
      });

      self.Layer.draw();
    }
  }

  AddToBase(shelf) {
    let self = this;
    self.FixtureType = "SHELF";
    self.Position = 0;

    let ctrl_positioning = new PositioningBase();

    //#region remove this group from previous shelf if any
    if (self.FixtureID != null) {
      self.Store_RemoveSubFixtureFromFixture();
    }
    //#endregion

    let shelf_id = shelf.getId().replace("shelf_client_rect_", "");
    let shelfInstance = self.Store_GetFixtureByID(shelf_id);

    if (shelfInstance != null && shelfInstance != undefined) {

      ctrl_positioning.SetFixtureChildrenPositionNumbers(shelfInstance); // re-order first
      self.CallParentFixture_CalculateNewPositions();

      // assign the subfixture to the parent fixture.
      self.FixtureID = shelfInstance.ID;
      // Re-Add sub fixture to fixture

      let x = shelfInstance.Group.getX();

      let posArr = ctrl_positioning.GetFixtureSubFixtureGroupPositionArray(shelfInstance);

      posArr.forEach(element => {
        if (element.constructor.name == "ProductGroup") {
          x += element.TotalWidth;
        } else if (element.constructor.name == "Basket") {
          x += element.Group.getWidth();
        }
      });

      self.Group.position({
        x: x,
        y: shelf.getY() + (shelf.getHeight() - (self.FixtureData.height * self.Ratio))
      });

      self.ClientRect.position({
        x: x,
        y: shelf.getY() + (shelf.getHeight() - (self.FixtureData.height * self.Ratio))
      });

      console.log("[SUB FIXTURE] Adding back to shelf");
      self.Store_AddSubFixtureToFixture(self.FixtureID);

      ctrl_positioning.SetFixtureChildrenPositionNumbers(shelfInstance);
      self.CallParentFixture_CalculateNewPositions();
      self.DetermineFixturePosition();

      self.ProductGroupArray.forEach(product => {
        product.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
      });

      self.Layer.draw();
    }
  }

  AddToPegbar(pegbar) {

  }

  AddToPegboard(pegboard) {

  }

  //#region Add sub fixture to fixture positions
  AddToFixture(intersectionResult) {
    let self = this;

    if (intersectionResult.intersects == true) {
      switch (intersectionResult.Type.toUpperCase()) {
        case "SHELF":
          {
            console.log("[SHELF BASKET] DROPPING TO SHELF")
            self.AddToShelf(intersectionResult.KonvaFixtureData);
          }
          break;
        case "BASE":
          {
            console.log("[SHELF BASKET] DROPPING TO BASE AS SHELF")
            self.AddToBase(intersectionResult.KonvaFixtureData);
          }
          break;
        case "PEGBAR":
          {
            console.log("[PEGBAR BASKET] DROPPING TO PEGBAR")
            self.AddToPegbar(intersectionResult.KonvaFixtureData);
          }
          break;
        case "PEGBOARD":
          {
            console.log("[PEGBOARD BASKET] DROPPING TO PEGBOARD")
            self.AddToPegboard(intersectionResult.KonvaFixtureData, intersectionResult.Position);
          }
          break;
          // case "BASKET":
          //   {
          //     console.log("[BASKET PRODUCT] DROPPING TO BASKET");
          //     self.AddToBasket(intersectionResult.KonvaFixtureData);
          //   }
      }
    } else {
      if (self.LastPosition == null) {
        // TODO : Delete sub fixture from fixture
        // self.DeleteProduct();
      } else {
        // self.Group.position(self.LastPosition);
        // self.Layer.draw();
      }
    }
  }
  //#endregion

  CallParentFixture_CalculateNewPositions() {
    let self = this;
    let fixtureParent = self.Store_GetFixtureByID(self.FixtureID);

    if (fixtureParent == null) {
      console.error("[SUB FIXTURE] Call root fixture to determine new positions --> NO PARENT FIXTURE FOUND");
      return;
    }

    fixtureParent.CalculateAllProductAndSubfixturePositions();

    self.ClientRect.destroy();
    self.ClientRect = null;
    self.AddClientRect();


    self.ProductGroupArray.forEach((productGroup) => {
      productGroup.AddProductDisplay(productGroup.Orientation_Width, productGroup.Orientation_Height);
    })
  }

  //#region Fixture Label

  DetermineFixturePosition() {
    let self = this;

    let fixtureParent = self.Store_GetFixtureByID(self.FixtureID);

    let yArr = [];

    fixtureParent.SubFixtures.forEach((subFixture) => {
      switch (subFixture.Type.toUpperCase()) {
        case "BASKET":
          {
            yArr.push({
              fixture: subFixture,
              x: subFixture.Group.getX()
            })
          }
          break;
      }
    })

    yArr.sort((a, b) => a.x - b.x);
    yArr.forEach((el, idx) => {
      el.fixture.FixtureNumber = (idx + 1);
      el.fixture.AddFixtureText(false);
      el.fixture.Group.draw();
    })
  }

  //#endregion

  //#region Labeling
  AddFixtureText(bIsBase) {
    let self = this;

    var strText = "";

    switch (self.Type.toUpperCase()) {
      case "BASKET":
        {
          strText = "BASKET " + self.FixtureNumber;
        }
        break;
    }

    if (self.FixtureLabel != null) {
      self.FixtureLabel.destroy();
    }

    self.FixtureLabel = new Konva.Text({
      x: 5,
      y: 0,
      text: strText,
      fontSize: 10,
      fontFamily: 'Arial Black',
      fill: 'black'
    });

    self.Group.add(self.FixtureLabel);
  }
  //#endregion

  //#region Entity Helper
  Store_GetGondola(id) {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    return helper.GetGondolaByID(id);
  }

  Store_GetFixture() {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    return helper.GetFixtureByID(self.FixtureID);
  }

  Store_GetFixtureByID(fixtureID) {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    return helper.GetFixtureByID(fixtureID);
  }

  Store_RemoveSubFixtureFromFixture() {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    helper.RemoveSubFixtureFromFixture(self.FixtureID, self);
  }

  Store_AddSubFixtureToFixture(fixtureID) {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    helper.AddSubFixtureToFixture(fixtureID, self);
  }
  //#endregion

  //#region Delete Fixture
  DeleteFixture() {
    console.log("[FIXTURE] DELETE START");

    let self = this;

    for (var i = self.ProductGroupArray.length - 1; i >= 0; i--) {
      var productGroup = self.ProductGroupArray[i];
      productGroup.DeleteProduct();
    }

    self.Store_RemoveFixtureFromGondola(self);
    self.Group.destroy();
    self.ClientRect.destroy();

    self.CallFixture_CalculateShelfHeightsForGondola(self.GondolaID);
    self.Layer.draw();
    console.log("[FIXTURE] DELETED");
  }
  //#endregion

  //#region Re-Align fixtures with gondola position
  /// Re aligns the fixtures to the gondola after it has been deleted.
  ReAlignFixturesToGondola() {
    console.log("[Fixture] Re-Align to gondola START")
    let self = this;
    let gondolaItem = self.Store_GetGondola();
    var deltaChangeX = Math.abs(self.Group.getX() - gondolaItem.Group.getX());
    var prevFixturePosition = self.Group.position();
    console.log("[Fixture] Delta x", deltaChangeX);
    switch (self.Type.toUpperCase()) {
      case "SHELF":
        {
          self.ClientRectIntersection.x = gondolaItem.Group.getX();
          self.ClientRect.setX(gondolaItem.Group.getX());
        }
        break;
      case "BASE":
        {
          self.ClientRectIntersection.x = gondolaItem.Group.getX();
          self.ClientRect.setX(gondolaItem.Group.getX());
        }
        break;
      case "PEGBAR":
        {
          self.ClientRectIntersection.x = gondolaItem.Group.getX();
          self.ClientRect.setX(gondolaItem.Group.getX());
        }
        break;
        // case "PEGBOARD" : {

        // } break;
    }
    self.Group.setX(gondolaItem.Group.getX());

    self.ProductGroupArray.forEach(productGroup => {
      productGroup.ReAlignProductsToFixture(prevFixturePosition, deltaChangeX);
    });

    console.log("[Fixture] Re-Align END")
  }
  //#endregion

  //#region TO JSON
  /// Will return an object json string of all the necessary items to build this shelf.
  toObject() {
    let self = this;
    let retVal = null;

    switch (self.Type.toUpperCase()) {
      case "SHELF":
        {
          retVal = {
            RelativePosition: {
              x: self.Group.getX(),
              y: self.Group.getY(),
            },
            AbsolutePosition: {
              x: self.Group.getAbsolutePosition().x,
              y: self.Group.getAbsolutePosition().y
            },
            ClientRect: {
              x: self.ClientRect.getX(),
              y: self.ClientRect.getX(),
              width: self.ClientRect.getWidth(),
              height: self.ClientRect.getHeight()
            },
            Data: {
              FixtureData: self.FixtureData,
              ID: self.ID,
              GondolaID: self.GondolaID,
              FixtureConfig: self.FixtureConfig,
              ProductGroupCount: self.ProductGroupArray.length,
              FixtureNumber: self.FixtureNumber
            }
          }
        }
        break;
      case "BASE":
        ; {
          retVal = {
            RelativePosition: {
              x: self.Group.getX(),
              y: self.Group.getY(),
            },
            AbsolutePosition: {
              x: self.Group.getAbsolutePosition().x,
              y: self.Group.getAbsolutePosition().y
            },
            ClientRect: {
              x: self.ClientRect.getX(),
              y: self.ClientRect.getX(),
              width: self.ClientRect.getWidth(),
              height: self.ClientRect.getHeight()
            },
            Data: {
              FixtureData: self.FixtureData,
              ID: self.ID,
              GondolaID: self.GondolaID,
              FixtureConfig: self.FixtureConfig,
              ProductGroupCount: self.ProductGroupArray.length
            }
          }
        }
        break;
      case "PEGBOARD":
        {
          retVal = {
            RelativePosition: {
              x: self.Group.getX(),
              y: self.Group.getY(),
            },
            AbsolutePosition: {
              x: self.Group.getAbsolutePosition().x,
              y: self.Group.getAbsolutePosition().y
            },
            // ClientRect: {
            //   x: self.ClientRect.getX(),
            //   y: self.ClientRect.getX(),
            //   width: self.ClientRect.getWidth(),
            //   height: self.ClientRect.getHeight()
            // },
            Data: {
              FixtureData: self.FixtureData,
              ID: self.ID,
              GondolaID: self.GondolaID,
              FixtureConfig: self.FixtureConfig,
              ProductGroupCount: self.ProductGroupArray.length
            }
          }
        }
        break;
      case "PEGBAR":
        {
          retVal = {
            RelativePosition: {
              x: self.Group.getX(),
              y: self.Group.getY(),
            },
            AbsolutePosition: {
              x: self.Group.getAbsolutePosition().x,
              y: self.Group.getAbsolutePosition().y
            },
            ClientRect: {
              x: self.ClientRect.getX(),
              y: self.ClientRect.getX(),
              width: self.ClientRect.getWidth(),
              height: self.ClientRect.getHeight()
            },
            Data: {
              FixtureData: self.FixtureData,
              ID: self.ID,
              GondolaID: self.GondolaID,
              FixtureConfig: self.FixtureConfig,
              ProductGroupCount: self.ProductGroupArray.length
            }
          }
        }
        break;
    }

    return JSON.stringify(retVal);
  }

  //#endregion

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  randomColor() {
    // return "#" + Math.random().toString(16).slice(2, 8);
    return 'rgb(' +
      (Math.floor(Math.random() * 56) + 200) + ', ' +
      (Math.floor(Math.random() * 56) + 200) + ', ' +
      (Math.floor(Math.random() * 56) + 200) +
      ')';
  }
}

export default SubFixtureBase;