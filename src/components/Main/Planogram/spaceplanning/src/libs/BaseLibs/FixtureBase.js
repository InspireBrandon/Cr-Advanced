import EntityHelper from '@/components/Main/Planogram/spaceplanning/src/libs/EntityHelper/entity-helper.js'
// postioning controller
import PositioningBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/PositioningBase.js';

class FixtureBase {
  constructor(VueStore, gondolaID, FixtureData, ratio) {
    this.ID = this.guid();

    if (ratio)
      this.Ratio = ratio;
    else
      this.Ratio = 1;

    this.VueStore = VueStore;
    this.Type = FixtureData.Type;
    this.Group = null;
    this.Layer = null;
    this.FixtureData = FixtureData;
    this.SubFixtures = [];
    this.ProductGroupArray = [];
    this.GondolaID = gondolaID;
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
    let self = this;
    return new Promise(function (resolve) {
      self.Stage = stage;
      self.GondolaID = data.Data.GondolaID;
      // self.Ratio = ratio;
      self.GondolaData = data.Data.GondolaData;
      self.ID = data.Data.ID;
      self.GondolaID = data.Data.GondolaID;
      self.FixtureData = data.Data.FixtureData;
      self.FixtureConfig = data.Data.FixtureConfig;

      switch (data.Data.FixtureData.fixtureType) {
        case 0:
          {
            self.Type = "Base";
            self.ClientRectIntersection = null;
            self.ClientRect = null;
          }
          break;
        case 1:
          {
            self.Type = "Shelf";
            self.ClientRectIntersection = null;
            self.ClientRect = null;
          }
          break;
        case 2:
          {
            self.Type = "Pegboard";
          }
          break;
        case 3:
          {
            self.Type = "Pegbar";
            self.ClientRectIntersection = null;
            self.ClientRect = null;
          }
          break;
      }

      console.log("LOAD FROM FILE PGBAR", self.FixtureData, self.FixtureData.width, self.FixtureData.height);
      let width = self.FixtureData.width * self.Ratio;
      let height = self.FixtureData.height * self.Ratio;

      self.Build(stage, width, height, data.RelativePosition)
        .then(buildComplete => {
          self.CallFixture_CalculateShelfHeightsForGondola(self.GondolaID);
          resolve();
        })
    })
  }

  CalculateAllProductAndSubfixturePositions() {
    let self = this;
    console.log("[FIXTURE] Calculate all children positions", self, self.ClientRect);


    let ctrl_positioning = new PositioningBase();
    ctrl_positioning.Calculate_AllProductAndSubfixturePositions(self);
  }

  CallFixture_CalculateHeight() {
    let self = this;
    self.CalculateHeight(); // TODO: IMPORTANT - ALL FIXUTURES / SUBFIXTURES MUST HAVE A METHOD CALLED CalculateHeight
  }

  CallFixture_CalculateShelfHeightsForGondola(gondolaID) {
    let self = this;
    console.log("[FIXTURE] Calculating heights for each fixture within gondola", gondolaID);
    let fixtureArr = self.VueStore.getters.getAllFixtures;

    fixtureArr.forEach(fixture => {
      if (fixture.GondolaID == gondolaID) {
        if (fixture.Type.toUpperCase() == "SHELF" || fixture.Type.toUpperCase() == "BASE") {
          fixture.CalculateHeight();
        }
      }
    });
  }
  //#region Fixture Label

  DetermineFixturePosition(order) {
    let self = this;

    let gondolas = self.VueStore.getters.getAllGondolas;
    let prevFixtureCount = 0;

    gondolas.forEach((gondolaEl) => {
      let gondolaPos = gondolaEl.Position;
      let yArr = [];

      gondolaEl.Fixtures.forEach((fixtureEl) => {
        switch (fixtureEl.Type.toUpperCase()) {
          case "BASKET":
            {
              yArr.push({
                fixture: fixtureEl,
                y: fixtureEl.Group.getY()
              })
            }
            break;
          case "SHELF":
            {
              yArr.push({
                fixture: fixtureEl,
                y: fixtureEl.Group.getY()
              })
            }
            break;
          case "BASE":
            {
              yArr.push({
                fixture: fixtureEl,
                y: fixtureEl.Group.getY()
              })
            }
            break;
          case "PEGBOARD":
            {
              yArr.push({
                fixture: fixtureEl,
                y: fixtureEl.Group.getY() + fixtureEl.Group.getHeight()
              })
            }
            break;
          case "PEGBAR":
            {
              yArr.push({
                fixture: fixtureEl,
                y: fixtureEl.Group.getY() + fixtureEl.Group.getHeight()
              })
            }
            break;
        }

        if (order == "T2B") {
          yArr.sort((a, b) => a.y - b.y);
        } else if (order == "B2T") {
          yArr.sort((a, b) => b.y - a.y);
        }

        yArr.forEach((el, idx) => {
          if (gondolaPos > 0) {
            el.fixture.FixtureNumber = prevFixtureCount + (idx + 1);
          } else {
            el.fixture.FixtureNumber = (idx + 1);
          }

          el.fixture.AddFixtureText(false);
        })
      })

      yArr = [];
      prevFixtureCount += gondolaEl.Fixtures.length;
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
          alert('we are here')
          strText = "BASKET " + self.FixtureNumber;
        }
        break;
      case "BASE":
        {
          strText = "BASE " + self.FixtureNumber;
        }
        break;
      case "SHELF":
        {
          strText = "SHELF " + self.FixtureNumber;
        }
        break;
      case "PEGBAR":
        {
          strText = "PEGBAR " + self.FixtureNumber;
        }
        break;
      case "PEGBOARD":
        {
          strText = "PEGBOARD " + self.FixtureNumber;
        }
        break;
    }

    if (self.FixtureLabel != null) {
      self.FixtureLabel.destroy();
    }
    // TODO: LABELS FOR PRODUCTS MAYBE???
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
  Store_GetGondola() {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    return helper.GetGondolaByID(self.GondolaID);
  }

  Store_AddToGondola() {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    helper.AddFixtureToGondola(self.GondolaID, self);
  }

  Store_RemoveFixtureFromGondola(fixture) {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    helper.RemoveFixtureFromGondola(self.GondolaID, fixture);
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

    switch(self.Type.toUpperCase()) {
      case "SHELF": {
        self.Group.destroy();
        self.ClientRect.destroy();
      } break;
      case "PEGBAR": {
        self.Group.destroy();
        self.ClientRect.destroy();
      }
      case "PEGBOARD": {

      } break;
    }
    self.Store_RemoveFixtureFromGondola(self);

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
}

export default FixtureBase;