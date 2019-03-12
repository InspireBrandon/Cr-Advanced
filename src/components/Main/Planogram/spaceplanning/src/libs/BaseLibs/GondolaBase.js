class GondolaBase {
  constructor(VueStore, gondolaData, ratio, gondolaPosition) {
    if (ratio) {
      this.Ratio = ratio;
    } else {
      this.Ratio = 1;
    }

    this.VueStore = VueStore;
    this.ID = this.guid();
    this.Type = "GONDOLA"; // "OBSTRUCTION????"
    this.GondolaPanelSpacer = 5;
    this.GondolaPanelHeight = 10 * this.Ratio;
    this.GondolaPanelGroup = null;
    this.GondolaPanelArea = null;
    this.GondolaPanelText = null;
    this.GondolaBackPanelImageSrc = gondolaData.image;
    this.EventBus = null;
    this.Group = null;
    this.Layer = null;
    this.Area = null;
    this.Fixtures = [];
    this.Rendering = [];
    this.GondolaData = gondolaData;
    this.GondolaConfig = null;
    this.Stage = null;
    this.Position = gondolaPosition;
  }

  LoadFromFile(stage, data) {
    let self = this;
    self.Stage = stage;
    // self.Ratio = ratio;
    self.GondolaData = data.Data.GondolaData;
    self.ID = data.Data.ID;
    // self.VueStore = VueStore;

    let width = data.Data.GondolaData.width * self.Ratio;
    let height = data.Data.GondolaData.height * self.Ratio;
    let total_heigth = height + (self.GondolaPanelSpacer + self.GondolaPanelHeight);

    let position = {
      x: data.RelativePosition.x,
      y: data.RelativePosition.y
    }

    self.Build(stage, width, height, position);
  }

  //#region Z-Indexing
  SetIndexes() {
    let self = this;
    self.Layer.moveToBottom();
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

  //#region Redraw with Dimensions

  RedrawGondolas(newData) {
    console.log("[GONDOLAS] REDRAW START")
    let self = this;
    let allGondolas = self.VueStore.getters.getAllGondolas;

    allGondolas.sort((a, b) => a.Position - b.Position);
    //#region Adjust gondola position
    console.log("[GONDOLAS] PREVIOUS POSITION NUMBERS", allGondolas);
    allGondolas.forEach((gondola, index) => {
      gondola.Position = index + 1;
    });

    allGondolas.sort((a, b) => a.Position - b.Position);
    console.log("[GONDOLAS] NEW POSITION NUMBERS", allGondolas);
    //#endregion

    //#region Move gondolas to correct positions
    let prevGondolaPos = null;
    allGondolas.forEach((gondola, index) => {

      if (newData != null && newData != undefined) { // newData is null when we are deleting
        if (newData.id == gondola.ID) { // set the new dimensions
          let width = gondola.GondolaData.width * self.Ratio;
          let height = gondola.GondolaData.height * self.Ratio;
          gondola.Group.setWidth(width)
          gondola.Group.setHeight(height)
  
          gondola.Area.setWidth(width)
          gondola.Area.setHeight(height)

          gondola.Group.setY(self.Stage.getHeight() - height);
        }
      }

      if (prevGondolaPos == null) {
        gondola.Group.setX(0)
      } else {
        gondola.Group.setX(prevGondolaPos)
      }
      prevGondolaPos += gondola.Group.getWidth() + 2; // + 2 constant spacing to prevent bad fixture products intersection
    });
    //#endregion

    //#region Move fixtures
    allGondolas.forEach((gondola, index) => {
      gondola.Fixtures.forEach(fixture => {
        fixture.ReAlignFixturesToGondola();
      });
    });
    //#endregion

    self.Stage.draw();

  }

  //#endregion
  //#region Delete Gondola

  DeleteGondola() {
    console.log("[GONDOLA] DELETE START");
    let self = this;

    for (var i = self.Fixtures.length - 1; i >= 0; i--) {
      var fixture = self.Fixtures[i];
      fixture.DeleteFixture();
    }

    self.VueStore.commit("removeGondola", self);

    self.Layer.destroy();
    self.Stage.draw();
    console.log("[GONDOLA] DELETED");

    console.log("[GONDOLA] CALLING ALL GONDOLAS REDRAW");

    self.RedrawGondolas();
  }

  //#endregion

  //#region TO JSON
  /// Will return an object json string of all the necessary items to build this gondola.
  toObject() {
    let self = this;
    let retVal = {
      RelativePosition: {
        x: self.Group.getX(),
        y: self.Group.getY(),
      },
      AbsolutePosition: {
        x: self.Group.getAbsolutePosition().x,
        y: self.Group.getAbsolutePosition().y
      },
      Data: {
        GondolaData: self.GondolaData,
        ID: self.ID,
        GondolaConfig: self.GondolaConfig,
        FixtureCount: self.Fixtures.length,
        Position: self.Position
      }
    }

    return JSON.stringify(retVal);
  }
  //#endregion
}

export default GondolaBase;