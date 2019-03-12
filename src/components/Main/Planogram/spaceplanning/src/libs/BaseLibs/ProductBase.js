import EntityHelper from '@/components/Main/Planogram/spaceplanning/src/libs/EntityHelper/entity-helper.js'
import IntersectDrop from "@/components/Main/Planogram/spaceplanning/src/libs/Intersection/drop-intersection-helper.js";
import PositioningBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/PositioningBase.js';

class ProductBase {
  constructor(VueStore, productData, ratio) {
    this.VueStore = VueStore;
    this.ID = this.guid();
    this.Ratio = ratio;
    this.FixtureType = null;
    this.FixtureID = null; // TODO: change to shelfID
    this.ProductData = productData;
    this.ProductWidth = productData.width * this.Ratio;
    this.ProductHeight = productData.height * this.Ratio;
    this.ProductDepth = productData.depth * this.Ratio;
    this.Orientation_Width = productData.width * this.Ratio;
    this.Orientation_Height = productData.height * this.Ratio;
    this.Orientation_Depth = productData.depth * this.Ratio;

    // caps & orientation
    this.Cap_Orientation_Width = this.Orientation_Width;
    this.Cap_Orientation_Height = this.Orientation_Depth;
    this.Cap_Orientation_Depth = this.Orientation_Height;
    this.caps_image_orientation_width = this.Cap_Orientation_Width;
    this.caps_image_orientation_height = this.Cap_Orientation_Height;
    this.Caps_Enabled = false;
    this.Caps_Count = 0;
    this.Cap_Rotation = 0;
    this.Caps_Face = 'top';

    this.Orientation = null;
    this.Rotation = 0;
    this.Layer = null;
    this.Group = null;
    this.Area = null;
    this.ProductRects = [];
    this.ImageRects = [];
    this.TextRects = [];
    this.ImagesOff = true;
    //#region Group Box 
    this.ProductGroupBox_ON = false;
    this.ProductGroupBox = null;
    this.ProductGroupBoxText = null;
    //#endregion Group Box
    this.LastPosition = null;
    this.TotalWidth = 0;
    this.TotalHeight = 0;

    this.TotalFacings = 0;

    this.Facings_X = 1;
    this.Facings_Y = 1;
    this.Facings_Z = 1;
    //#region Images
    this.image_front = null;
    this.image_side = null;
    this.image_top = null;
    // this.image_front_rect = null;
    // this.image_side_rect = null;
    // this.image_top_rect = null;
    this.image_orientation_width = this.Orientation_Width;
    this.image_orientation_height = this.Orientation_Height;
    //#endregion Images

    this.image_used = null;
    this.LastFace = 'front';
    this.RandomColor = this.randomColor()

    this.ProductConfig = null;
    this.Stage = null;
    this.CloneSettings = {
      CtrlIsDown: false,
      CloneListening: true
    }

    //#region Pegboard hole position
    this.PegboardHoleAssigned = null;
    this.PegboardHoleAssignedID = null;
    //#endregion Pegboard hole position
    this.Selected = false;
    this.Position = null;
  }

  LoadFromFile(stage, data) {
    let self = this;
    self.Stage = stage;

    return new Promise(function (resolve) {
      console.info("LOAD PRODUCT FROM FILE METHOD", data);
      self.ID = data.Data.ID;
      self.FixtureID = data.Data.FixtureID;
      self.ProductData = data.Data.ProductData;

      self.GetImages(stage);

      self.Orientation_Width = data.Data.Orientation.Width;
      self.Orientation_Height = data.Data.Orientation.Height;
      self.Orientation_Depth = data.Data.Orientation.Depth;

      self.image_orientation_width = data.Data.ImageOrientation.Width;
      self.image_orientation_height = data.Data.ImageOrientation.Height;

      // caps
      self.Cap_Orientation_Width = data.Data.Caps.Orientation.Width;
      self.Cap_Orientation_Height = data.Data.Caps.Orientation.Height;
      self.Cap_Orientation_Depth = data.Data.Caps.Orientation.Depth;
      self.Caps_Count = data.Data.Caps.Caps_Count;
      self.Caps_Face = data.Data.Caps.Caps_Face;
      self.caps_image_orientation_width = data.Data.Caps.ImageOrientation.Width;
      self.caps_image_orientation_height = data.Data.Caps.ImageOrientation.Height;
      self.Caps_Enabled = data.Data.Caps.Caps_Enabled;
      self.Cap_Rotation = data.Data.Caps.Rotation;
      // rotation and face
      self.Rotation = data.Data.Orientation.Rotation;
      self.LastFace = data.Data.Orientation.LastFace;

      self.TotalWidth = data.Data.TotalWidth;
      self.TotalHeight = data.Data.TotalHeight;

      self.Facings_X = data.Data.Facings.x;
      self.Facings_Y = data.Data.Facings.y;
      self.Facings_Z = data.Data.Facings.z;

      self.RandomColor = data.Data.RandomColor;
      self.PegboardHoleAssigned = data.Data.PegboardHoleAssigned;
      self.PegboardHoleAssignedID = data.Data.PegboardHoleAssignedID;

      // determine intersection
      let intersection_helper = new IntersectDrop();
      intersection_helper.DetermineProductIntersection(stage, data.RelativePosition)
        .then(intersectsFixture => {
          self.Build(stage).then(results => {
            // add to fixture
            let hasIntersection = false;
            let intersectsResult = null;
            results.forEach(intrsct => {
              if (intrsct.hasIntersection == true) {
                hasIntersection = true;
                intersectsResult = intrsct;
              }
            });

            if (hasIntersection == true) {
              self.AddToFixture(intersectsFixture);
              self.Store_AddActivePlanogramProduct();
            } else {
              self.DeleteProduct();
            }
            resolve();
          })
        })
    });
  }

  Visual_Selected() {
    let self = this;
    self.Selected = true;
    self.ImageRects.forEach(element => {
      if (element)
        element.opacity(0.5);
    });

    self.ProductRects.forEach(element => {
      element.opacity(0.5);
      element.fill('#1976d2');
    });
    self.Stage.draw();
  }

  Visual_Deselected() {
    let self = this;
    self.Selected = false;
    self.ImageRects.forEach(element => {
      if (element)
        element.opacity(1);
    });

    self.ProductRects.forEach(element => {
      element.opacity(1);
      element.fill(self.RandomColor);
    });

    self.Stage.draw();
  }

  Visual_Opacity(includeTransparency) {
    let self = this;
    self.ImageRects.forEach(element => {
      if (includeTransparency) {
        if (element)
          element.opacity(0.5);
      } else {
        if (element)
          element.opacity(1);
      }
    });

    self.ProductRects.forEach(element => {
      if (includeTransparency) {
        if (element)
          element.opacity(0.5);
      } else {
        if (element)
          element.opacity(1);
      }
    });

    if (includeTransparency) {
      if (self.ProductGroupBox && self.ProductGroupBoxText) {
        self.ProductGroupBox.opacity(0.5);
        self.ProductGroupBoxText.opacity(0.5);
      }
    } else {
      if (self.ProductGroupBox && self.ProductGroupBoxText) {
        self.ProductGroupBox.opacity(1);
        self.ProductGroupBoxText.opacity(1);
      }
    }
  }

  randomColor() {
    // return "#" + Math.random().toString(16).slice(2, 8);
    return 'rgb(' +
      (Math.floor(Math.random() * 56) + 200) + ', ' +
      (Math.floor(Math.random() * 56) + 200) + ', ' +
      (Math.floor(Math.random() * 56) + 200) +
      ')';
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  ToggleCapsOnOff(value) {
    let fixtureItem = this.Store_GetFixture();

    this.Caps_Enabled = value;

    if (value == false)
      this.Caps_Count = 0;
    else
      this.Caps_Count = 1;

    fixtureItem.CalculateAllProductAndSubfixturePositions();
    this.Layer.draw();
  }

  IncreaseCaps() {
    let fixtureItem = this.Store_GetFixture();

    this.Caps_Count++;
    fixtureItem.CalculateAllProductAndSubfixturePositions();
    this.Layer.draw();
  }

  DecreaseCaps() {
    if (this.Caps_Count > 1) {
      let fixtureItem = this.Store_GetFixture();
      this.Caps_Count--;
      fixtureItem.CalculateAllProductAndSubfixturePositions();
      this.Layer.draw();
    }
  }

  ToggleImages(bImagesOff) {
    let self = this;
    let fixtureItem = self.Store_GetFixture();
    self.ImagesOff = bImagesOff;

    if (bImagesOff == true) {
      self.ImageRects.forEach(element => {
        element.hide();
      });

    } else {
      self.ImageRects.forEach(element => {
        element.show();
      });
    }

    fixtureItem.Layer.draw();
    self.Group.draw();

  }

  ToggleGroupBoxOnOff(bOff) {
    let self = this;

    self.ProductGroupBox_ON = !bOff;

    self.ShowProductGroupBox();

    self.Group.draw();
  }

  AddToShelf(shelf) {
    let self = this;
    let prevFixtureID = self.FixtureID;
    self.FixtureType = "SHELF";
    self.Position = 0;

    let ctrl_positioning = new PositioningBase();
    // let shelf = self.Store_GetFixture();

    //#region remove this group from previous shelf if any
    if (self.FixtureID != null) {
      console.log("[PRODUCT SHELF] Removing from existing shelf", self.ProductData.description)
      self.Store_RemoveProductFromFixture(self);
    }
    //#endregion

    let shelf_id = shelf.getId().replace("shelf_client_rect_", "");
    let shelfInstance = self.Store_GetFixtureByID(shelf_id);

    // console.log("SHELF_ID:", shelf_id, "Actual shelf inst: ", shelfInstance, "SHELF?>>", shelf);

    if (shelfInstance != null && shelfInstance != undefined) {

      self.FixtureID = shelfInstance.ID;

      ctrl_positioning.SetFixtureChildrenPositionNumbers(shelfInstance); // re-order first
      self.CallParentFixture_CalculateNewPositions();

      let posArr = ctrl_positioning.GetFixtureSubFixtureGroupPositionArray(shelfInstance);

      // add product group to shelf
      let x = shelfInstance.Group.getX();

      console.log("[PRODUCT SHELF] Existing Children by Position", posArr);
      posArr.forEach(element => {
        if (element.constructor.name == "ProductGroup") {
          x += element.TotalWidth;
        } else if (element.constructor.name == "Basket") {
          x += element.Group.getWidth();
        }
      });

      // console.log(x, "shelfx: ", shelf.getX())
      self.Group.position({
        x: x,
        y: shelf.getY()
      });

      console.log("[PRODUCT SHELF] Adding to shelf", self.ProductData.description)
      self.Store_AddProductGroupToFixture(shelfInstance.ID, self);

      ctrl_positioning.SetFixtureChildrenPositionNumbers(shelfInstance);
      // self.AllocatePositionNumber(shelfInstance);

      self.CallParentFixture_CalculateNewPositions();

      self.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
      self.Layer.draw();

      if (prevFixtureID != null) {
        self.CallParentFixture_CalculateNewPositions(prevFixtureID);
      }
    }
  }

  AddToBase(shelf) {
    let self = this;
    let prevFixtureID = self.FixtureID;
    self.FixtureType = "BASE";
    self.Position = 0;

    let ctrl_positioning = new PositioningBase();
    // let shelf = self.Store_GetFixture();

    //#region remove this group from previous shelf if any
    if (self.FixtureID != null) {
      console.log("[PRODUCT SHELF] Removing from existing shelf", self.ProductData.description)
      self.Store_RemoveProductFromFixture(self);
    }
    //#endregion

    let shelf_id = shelf.getId().replace("shelf_client_rect_", "");
    let shelfInstance = self.Store_GetFixtureByID(shelf_id);

    // console.log("SHELF_ID:", shelf_id, "Actual shelf inst: ", shelfInstance, "SHELF?>>", shelf);

    if (shelfInstance != null && shelfInstance != undefined) {

      self.FixtureID = shelfInstance.ID;

      ctrl_positioning.SetFixtureChildrenPositionNumbers(shelfInstance); // re-order first
      self.CallParentFixture_CalculateNewPositions();

      let posArr = ctrl_positioning.GetFixtureSubFixtureGroupPositionArray(shelfInstance);

      // add product group to shelf
      let x = shelfInstance.Group.getX();

      console.log("[PRODUCT SHELF] Existing Children by Position", posArr);
      posArr.forEach(element => {
        if (element.constructor.name == "ProductGroup") {
          x += element.TotalWidth;
        } else if (element.constructor.name == "Basket") {
          x += element.Group.getWidth();
        }
      });

      // console.log(x, "shelfx: ", shelf.getX())
      self.Group.position({
        x: x,
        y: shelf.getY()
      });

      console.log("[PRODUCT SHELF] Adding to shelf", self.ProductData.description)
      self.Store_AddProductGroupToFixture(shelfInstance.ID, self);

      ctrl_positioning.SetFixtureChildrenPositionNumbers(shelfInstance);
      // self.AllocatePositionNumber(shelfInstance);

      self.CallParentFixture_CalculateNewPositions();

      self.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
      self.Layer.draw();

      if (prevFixtureID != null) {
        self.CallParentFixture_CalculateNewPositions(prevFixtureID);
      }
    }
  }

  AddToPegbar(pegbar) {
    let self = this;
    let prevFixtureID = self.FixtureID;

    self.FixtureType = "PEGBAR";
    
    console.group("ADD PRODUCT TO PEGBAR");
    // let shelf = self.Store_GetFixture();

    console.log("Current Fixture ID", self.FixtureID);

    //#region remove this group from previous shelf if any
    if (self.FixtureID != null) {
      self.Store_RemoveProductFromFixture(self);
    }
    //#endregion

    let pegbar_id = pegbar.getId().replace("pegbar_group_", "");
    let pegbarInstance = self.Store_GetFixtureByID(pegbar_id);
    // console.log("SHELF_ID:", shelf_id, "Actual shelf inst: ", shelfInstance, "SHELF?>>", shelf);

    if (pegbarInstance != null && pegbarInstance != undefined) {

      self.FixtureID = pegbarInstance.ID;
      // add product group to shelf
      self.Store_AddProductGroupToFixture(pegbarInstance.ID, self);

      let x = pegbarInstance.Group.getX();
      pegbarInstance.ProductGroupArray.forEach(productGroup => {
        if (productGroup.ID != self.ID) {
          x += productGroup.TotalWidth;
        }
      });

      self.Group.position({
        x: x,
        y: pegbar.getY()
      });

      self.AllocatePositionNumber(pegbarInstance);

      self.CallParentFixture_CalculateNewPositions();

      self.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
      self.Layer.draw();

      if (prevFixtureID != null) {
        self.CallParentFixture_CalculateNewPositions(prevFixtureID);
      }
    }
  }

  AddToPegboard(pegboard, dropPos) {
    let self = this;
    let prevFixtureID = self.FixtureID;

    self.FixtureType = "PEGBOARD";

    let intersectRect = {
      x: dropPos.x,
      y: dropPos.y,
      width: 1,
      height: 1
    }

    // get the pegboard id
    let fixtureID = pegboard.getId().replace("pegboard_group_", "");
    // get the fixture from store
    let fixtureItem = self.Store_GetFixtureByID(fixtureID);

    //#region remove this group from previous shelf if any
    if (self.FixtureID != null) {
      self.Store_RemoveProductFromFixture(self);
    }
    //#endregion

    if (fixtureItem == null) {
      console.warn("[PEGBOARD PRODUCT] Could not determine fixture from ID ", fixtureID);
      return;
    }

    self.Store_AddProductGroupToFixture(fixtureItem.ID, self);

    self.FixtureID = fixtureItem.ID;

    // use the fixture to cycle through all holes
    fixtureItem.Holes.forEach(hole => {
      // find an intersection

      let transform = self.Stage.getAbsoluteTransform().copy();
      // to detect relative position we need to invert transform
      transform.invert();
      // now we find relative point
      let pos = {
        x: hole.getClientRect().x,
        y: hole.getClientRect().y
      }

      let holePos = transform.point(pos);

      let newRect = {
        x: holePos.x,
        y: holePos.y,
        width: hole.getWidth(),
        height: hole.getHeight()
      }

      if (self.hasIntersection(newRect, intersectRect)) {
        // assign product to holeID for future placement
        console.log("PEGBOARD ASSIGNING THE HOLE", hole.position(), hole.getAbsolutePosition(), hole.getId())
        self.PegboardHoleAssigned = hole;
        self.PegboardHoleAssignedID = hole.getId();

        // determine where the hole is and position the group to that
        self.Group.position({
          // x: self.PegboardHoleAssigned.getAbsolutePosition().x - (self.Orientation_Width / 2),
          // y: self.PegboardHoleAssigned.getAbsolutePosition().y
          x: (holePos.x + (self.PegboardHoleAssigned.getHeight() / 2)) - (self.Orientation_Width / 2),
          y: holePos.y + (self.PegboardHoleAssigned.getWidth() / 2)
        })

        // -- this will be called ProductPositionY, make sure to give the correct position back from that call.
        self.AllocatePositionNumber(fixtureItem);

        self.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
        self.Layer.draw();

        if (prevFixtureID != null) {
          self.CallParentFixture_CalculateNewPositions(prevFixtureID);
        }

      }
    });
  }

  AddToBasket(basket) {
    let self = this;
    self.FixtureType = "BASKET";
    let prevFixtureID = self.FixtureID;
    self.Position = 0;
    
    console.group("ADD PRODUCT TO BASKET", basket);

    let ctrl_positioning = new PositioningBase();

    // let shelf = self.Store_GetFixture();

    console.log("Current Fixture ID", self.FixtureID);

    //#region remove this group from previous shelf if any
    if (self.FixtureID != null) {
      self.Store_RemoveProductFromFixture(self);
    }
    //#endregion

    let basket_id = basket.getId().replace("basket_group_", "");
    console.log("BASKET_ID:", basket_id);
    let basketInstance = self.Store_GetFixtureByID(basket_id);

    if (basketInstance != null && basketInstance != undefined) {

      ctrl_positioning.SetFixtureChildrenPositionNumbers(basketInstance); // re-order first
      self.CallParentFixture_CalculateNewPositions();

      self.FixtureID = basketInstance.ID;

      let posArr = ctrl_positioning.GetFixtureSubFixtureGroupPositionArray(basketInstance);

      let x = basketInstance.Group.getX();
      posArr.forEach(element => {
        if (element.constructor.name == "ProductGroup") {
          x += element.TotalWidth;
        } else if (element.constructor.name == "Basket") {
          x += element.Group.getWidth();
        }
      });

      // console.log(x, "shelfx: ", shelf.getX())
      self.Group.position({
        x: x,
        y: basket.getY()
      });

      // add product group to shelf
      self.Store_AddProductGroupToFixture(basketInstance.ID, self);

      ctrl_positioning.SetFixtureChildrenPositionNumbers(basketInstance);

      self.CallParentFixture_CalculateNewPositions();

      self.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
      self.Layer.draw();

      if (prevFixtureID != null) {
        self.CallParentFixture_CalculateNewPositions(prevFixtureID);
      }
    }
  }

  AddToFixture(intersectionResult) {
    let self = this;

    if (intersectionResult.intersects == true) {
      switch (intersectionResult.Type.toUpperCase()) {
        case "SHELF":
          {
            console.log("[SHELF PRODUCT] DROPPING TO SHELF")
            self.AddToShelf(intersectionResult.KonvaFixtureData);
          }
          break;
          case "BASE":
          {
            console.log("[BASE PRODUCT] DROPPING TO BASE AS SHELF")
            self.AddToBase(intersectionResult.KonvaFixtureData);
          }
          break;
        case "PEGBAR":
          {
            console.log("[PEGBAR PRODUCT] DROPPING TO PEGBAR")
            self.AddToPegbar(intersectionResult.KonvaFixtureData);
          }
          break;
        case "PEGBOARD":
          {
            console.log("[PEGBOARD PRODUCT] DROPPING TO PEGBOARD")
            self.AddToPegboard(intersectionResult.KonvaFixtureData, intersectionResult.Position);
          }
          break;
        case "BASKET":
          {
            console.log("[BASKET PRODUCT] DROPPING TO BASKET");
            self.AddToBasket(intersectionResult.KonvaFixtureData);
          }
      }
    } else {
      if (self.LastPosition == null) {
        self.DeleteProduct();
      } else {
        self.Group.position(self.LastPosition);
        self.Layer.draw();
      }
    }
  }

  ProductPosition(yCount, xCount) {
    let self = this;
    var retVal = {
      x: 0,
      y: 0
    };
    let fixtureItem = self.Store_GetFixture();

    console.log("[PRODUCT POSITIONING] Positioning for : ", self.FixtureType.toUpperCase());

    switch (self.FixtureType.toUpperCase()) {
      case "SHELF":
        {
          if (self.FixtureID == null) {
            return retVal;
          } else {
            retVal.y = fixtureItem.ClientRect.getHeight() - ((yCount + 1) * self.Orientation_Height);
            retVal.x = (xCount * self.Orientation_Width);
            return retVal;
          }

        }
        break;
        case "BASE":
        {
          if (self.FixtureID == null) {
            return retVal;
          } else {
            retVal.y = fixtureItem.ClientRect.getHeight() - ((yCount + 1) * self.Orientation_Height);
            retVal.x = (xCount * self.Orientation_Width);
            return retVal;
          }

        }
        break;
      case "PEGBAR":
        {
          if (self.FixtureID == null) {
            return retVal;
          } else {
            retVal.y = (fixtureItem.ClientRect.getHeight() / 2);
            retVal.x = (xCount * self.Orientation_Width);
            return retVal;
          }
        }
        break;
      case "BASKET":
        {
          if (self.FixtureID == null) {
            return retVal;
          } else {
            console.log("[BASKET PRODUCT POSITIONS]", fixtureItem, self)
            retVal.y = fixtureItem.ClientRect.getHeight() - ((yCount + 1) * self.Orientation_Height);
            retVal.x = (xCount * self.Orientation_Width);
            return retVal;
          }
        }
        break;
      case "PEGBOARD":
        {
          if (self.FixtureID == null) {
            return retVal;
          } else {

            if (self.PegboardHoleAssigned == null) {
              if (self.PegboardHoleAssignedID == null) {
                console.error("Cannot find peg assigned because id and peg is null for this product.");
              } else {
                self.PegboardHoleAssigned = self.Stage.find('#' + self.PegboardHoleAssignedID);
                console.log("TRYING TO FIND PEG HOLE", self.PegboardHoleAssignedID, self.Stage.find('#' + self.PegboardHoleAssignedID))
              }
            }

            // calculate product position
            let transform = self.Stage.getAbsoluteTransform().copy();
            // to detect relative position we need to invert transform
            transform.invert();
            // now we find relative point
            let pos = {
              x: self.PegboardHoleAssigned.getClientRect().x,
              y: self.PegboardHoleAssigned.getClientRect().y
            }

            let holePos = transform.point(pos);

            // determine where the hole is and position the group to that
            self.Group.position({
              // x: self.PegboardHoleAssigned.getAbsolutePosition().x - (self.Orientation_Width / 2),
              // y: self.PegboardHoleAssigned.getAbsolutePosition().y

              x: (holePos.x + (self.PegboardHoleAssigned.getWidth() / 2)) - (self.Orientation_Width / 2),
              y: holePos.y + (self.PegboardHoleAssigned.getHeight() / 2)
            })

            // return product position relative to the ProductGroup
            retVal.y = (yCount * self.Orientation_Height);
            retVal.x = (xCount * self.Orientation_Width);
            return retVal;
          }
        }
        break;
    }
  }

  CallParentFixture_CalculateNewPositions(fixtureID = null) {
    let self = this;
    let searchFixtureID = fixtureID == null ? self.FixtureID : fixtureID;
    let fixtureParent = self.Store_GetFixtureByID(searchFixtureID);

    if (fixtureParent == null) {
      console.error("[SUB FIXTURE] Call root fixture to determine new positions --> NO PARENT FIXTURE FOUND");
      return;
    }

    fixtureParent.CalculateAllProductAndSubfixturePositions();
  }

  //#region 

  Store_AddActivePlanogramProduct() {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    return helper.AddActivePlanogramProduct(self.ProductData);
  }

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
    console.log("[GET FIXTURE BY ID]", fixtureID);

    let self = this;
    let helper = new EntityHelper(self.VueStore);
    return helper.GetFixtureByID(fixtureID);
  }

  Store_RemoveProductFromFixture(productGroup) {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    helper.RemoveProductGroupFromFixture(self.FixtureID, productGroup);
  }

  Store_AddProductGroupToFixture(fixtureID, productGroup) {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    helper.AddProductGroupToFixture(fixtureID, productGroup);
  }

  Store_GetAllFixtures() {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    return helper.GetAllFixtures();
  }

  //#endregion

  //#region Calculate Totals

  Calculate_Facings() {
    let self = this;
    let fixtureItem = self.Store_GetFixtureByID(self.FixtureID);

    if (self.FixtureType === "PEGBOARD") {
      // find the peg default depth
      let peg = fixtureItem.FixtureData.defaultPegDetails;

      if (peg == null) {
        console.error("[PEGBOARD] Pegboar has no default peg assigned");
        self.TotalFacings = 1;
        return;
      }

      self.Facings_Z = Math.floor((peg.depth * self.Ratio) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((peg.depth * self.Ratio) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z;

        console.log("FACINGS PRODUCT", self.Facings_X, self.Facings_Y, self.Facings_Z);
        console.log("FACINGS CAP", cap_facings_x, cap_facings_y, cap_facings_z);

        self.TotalFacings += totalCapsFacings;
      }

    } else if (self.FixtureType === "PEGBAR") {
      // find the peg default depth
      let peg = fixtureItem.FixtureData.defaultPegDetails;

      if (peg == null) {
        console.error("[PEGBOARD] Pegboar has no default peg assigned");
        self.TotalFacings = 1;
        return;
      }

      self.Facings_Z = Math.floor((peg.depth * self.Ratio) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((peg.depth * self.Ratio) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z;

        console.log("FACINGS PRODUCT", self.Facings_X, self.Facings_Y, self.Facings_Z);
        console.log("FACINGS CAP", cap_facings_x, cap_facings_y, cap_facings_z);

        self.TotalFacings += totalCapsFacings;
      }


    } else if (self.FixtureType === "SHELF") {

      self.Facings_Z = Math.floor((fixtureItem.FixtureData.depth * self.Ratio) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((fixtureItem.FixtureData.depth * self.Ratio) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z;

        console.log("FACINGS PRODUCT", self.Facings_X, self.Facings_Y, self.Facings_Z);
        console.log("FACINGS CAP", cap_facings_x, cap_facings_y, cap_facings_z);

        self.TotalFacings += totalCapsFacings;
      }
    } else if (self.FixtureType === "BASKET") {
      self.Facings_Z = Math.floor((fixtureItem.FixtureData.depth * self.Ratio) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((fixtureItem.FixtureData.depth * self.Ratio) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z;

        console.log("FACINGS PRODUCT", self.Facings_X, self.Facings_Y, self.Facings_Z);
        console.log("FACINGS CAP", cap_facings_x, cap_facings_y, cap_facings_z);

        self.TotalFacings += totalCapsFacings;
      }
    }
  }

  //#endregion

  //#region TO JSON
  /// Will return an object json string of all the necessary items to build this product group.
  toObject() {
    let self = this;
    let fixtureItem = self.Store_GetFixture();

    if (fixtureItem == null) {
      console.error("[PRODUCT] TOOBJECT, there is no fixture assigned to this product and therefore cannot be created for save file.");
      return;

    }

    switch (fixtureItem.Type.toUpperCase()) {
      case "SHELF":
        {
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
              ProductData: self.ProductData,
              ID: self.ID,
              FixtureID: self.FixtureID,
              FixtureType: fixtureItem.Type,
              ProductConfig: self.ProductConfig,
              Facings: {
                x: self.Facings_X,
                y: self.Facings_Y,
                z: self.Facings_Z
              },
              Orientation: {
                Rotation: self.Rotation,
                LastFace: self.LastFace,
                Width: self.Orientation_Width,
                Height: self.Orientation_Height,
                Depth: self.Orientation_Depth
              },
              ImageOrientation: {
                Width: self.image_orientation_width,
                Height: self.image_orientation_height
              },
              Caps: {
                Orientation: {
                  Width: self.Cap_Orientation_Width,
                  Height: self.Cap_Orientation_Height,
                  Depth: self.Cap_Orientation_Depth
                },
                ImageOrientation: {
                  Width: self.caps_image_orientation_width,
                  Height: self.caps_image_orientation_height
                },
                Rotation: self.Cap_Rotation,
                Caps_Face: self.Caps_Face,
                Caps_Count: self.Caps_Count,
                Caps_Enabled: self.Caps_Enabled
              },
              TotalWidth: self.TotalWidth,
              TotalHeight: self.TotalHeight,
              RandomColor: self.RandomColor
            }
          }

          return JSON.stringify(retVal);
        }
      case "BASE":
        {
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
              ProductData: self.ProductData,
              ID: self.ID,
              FixtureID: self.FixtureID,
              FixtureType: fixtureItem.Type,
              ProductConfig: self.ProductConfig,
              Facings: {
                x: self.Facings_X,
                y: self.Facings_Y,
                z: self.Facings_Z
              },
              Orientation: {
                Rotation: self.Rotation,
                LastFace: self.LastFace,
                Width: self.Orientation_Width,
                Height: self.Orientation_Height,
                Depth: self.Orientation_Depth
              },
              ImageOrientation: {
                Width: self.image_orientation_width,
                Height: self.image_orientation_height
              },
              Caps: {
                Orientation: {
                  Width: self.Cap_Orientation_Width,
                  Height: self.Cap_Orientation_Height,
                  Depth: self.Cap_Orientation_Depth
                },
                ImageOrientation: {
                  Width: self.caps_image_orientation_width,
                  Height: self.caps_image_orientation_height
                },
                Rotation: self.Cap_Rotation,
                Caps_Face: self.Caps_Face,
                Caps_Count: self.Caps_Count,
                Caps_Enabled: self.Caps_Enabled
              },
              TotalWidth: self.TotalWidth,
              TotalHeight: self.TotalHeight,
              RandomColor: self.RandomColor
            }
          }

          return JSON.stringify(retVal);
        }
      case "PEGBOARD":
        {
          let retVal = {
            RelativePosition: {
              x: self.Group.getX() + self.Orientation_Width / 2,
              y: self.Group.getY(),
            },
            AbsolutePosition: {
              x: self.Group.getAbsolutePosition().x + self.Orientation_Width / 2,
              y: self.Group.getAbsolutePosition().y
            },
            Data: {
              ProductData: self.ProductData,
              ID: self.ID,
              FixtureID: self.FixtureID,
              FixtureType: fixtureItem.Type,
              ProductConfig: self.ProductConfig,
              Facings: {
                x: self.Facings_X,
                y: self.Facings_Y,
                z: self.Facings_Z
              },
              Orientation: {
                Rotation: self.Rotation,
                LastFace: self.LastFace,
                Width: self.Orientation_Width,
                Height: self.Orientation_Height,
                Depth: self.Orientation_Depth
              },
              ImageOrientation: {
                Width: self.image_orientation_width,
                Height: self.image_orientation_height
              },
              Caps: {
                Orientation: {
                  Width: self.Cap_Orientation_Width,
                  Height: self.Cap_Orientation_Height,
                  Depth: self.Cap_Orientation_Depth
                },
                ImageOrientation: {
                  Width: self.caps_image_orientation_width,
                  Height: self.caps_image_orientation_height
                },
                Rotation: self.Cap_Rotation,
                Caps_Face: self.Caps_Face,
                Caps_Count: self.Caps_Count,
                Caps_Enabled: self.Caps_Enabled
              },
              TotalWidth: self.TotalWidth,
              TotalHeight: self.TotalHeight,
              RandomColor: self.RandomColor,
              PegboardHoleAssigned: self.PegboardHoleAssigned,
              PegboardHoleAssignedID: self.PegboardHoleAssignedID
            }
          }

          return JSON.stringify(retVal);
        }
      case "PEGBAR":
        {
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
              ProductData: self.ProductData,
              ID: self.ID,
              FixtureID: self.FixtureID,
              FixtureType: fixtureItem.Type,
              ProductConfig: self.ProductConfig,
              Facings: {
                x: self.Facings_X,
                y: self.Facings_Y,
                z: self.Facings_Z
              },
              Orientation: {
                Rotation: self.Rotation,
                LastFace: self.LastFace,
                Width: self.Orientation_Width,
                Height: self.Orientation_Height,
                Depth: self.Orientation_Depth
              },
              ImageOrientation: {
                Width: self.image_orientation_width,
                Height: self.image_orientation_height
              },
              Caps: {
                Orientation: {
                  Width: self.Cap_Orientation_Width,
                  Height: self.Cap_Orientation_Height,
                  Depth: self.Cap_Orientation_Depth
                },
                ImageOrientation: {
                  Width: self.caps_image_orientation_width,
                  Height: self.caps_image_orientation_height
                },
                Rotation: self.Cap_Rotation,
                Caps_Face: self.Caps_Face,
                Caps_Count: self.Caps_Count,
                Caps_Enabled: self.Caps_Enabled
              },
              TotalWidth: self.TotalWidth,
              TotalHeight: self.TotalHeight,
              RandomColor: self.RandomColor
            }
          }

          return JSON.stringify(retVal);
        }
    }
  }
  //#endregion

  //#region Clone
  CloneProduct(stage, productGroup, clone) {
    // clone.FixtureData = productGroup.FixtureData;
    // clone.FixtureType = productGroup.FixtureType;
    // clone.FixutreID = productGroup.FixtureID;
    clone.CloneSettings.CtrlIsDown = false;
    clone.CloneSettings.CloneListening = false;
    clone.Facings_X = productGroup.Facings_X;
    clone.Facings_Y = productGroup.Facings_Y;
    clone.Facings_Z = productGroup.Facings_Z;
    clone.Orientation_Width = productGroup.Orientation_Width;
    clone.Orientation_Height = productGroup.Orientation_Height;
    clone.Orientation_Depth = productGroup.Orientation_Depth;

    // caps
    clone.Cap_Orientation_Width = productGroup.Cap_Orientation_Width;
    clone.Cap_Orientation_Height = productGroup.Cap_Orientation_Height;
    clone.Cap_Orientation_Depth = productGroup.Cap_Orientation_Depth;
    clone.caps_image_orientation_width = productGroup.caps_image_orientation_width;
    clone.caps_image_orientation_height = productGroup.caps_image_orientation_height;
    clone.Caps_Count = productGroup.Caps_Count;
    clone.Cap_Rotation = productGroup.Cap_Rotation;
    clone.Caps_Face = productGroup.Caps_Face;
    clone.Caps_Enabled = productGroup.Caps_Enabled;

    clone.image_orientation_width = productGroup.image_orientation_width;
    clone.image_orientation_height = productGroup.image_orientation_height;
    clone.LastFace = productGroup.LastFace;
    clone.Rotation = productGroup.Rotation;

    clone.image_used = productGroup.image_used;
    clone.LastFace = productGroup.LastFace;
    clone.ProductGroupBox_ON = productGroup.ProductGroupBox_ON;
    clone.ImagesOff = productGroup.ImagesOff;

    setTimeout(() => {
      clone.AddEvents(stage);
      clone.CloneSettings.CtrlIsDown = false;
      clone.CloneSettings.CloneListening = true;
    }, 3000);

    clone.Initialise(stage);

    console.log("P CLONE", productGroup)
    clone.Group.setX(productGroup.Group.getX())
    clone.Group.setY(productGroup.Group.getY())
    clone.RandomColor = productGroup.RandomColor;

    clone.Group.startDrag();

    // let intersection_helper = new IntersectDrop();
    // let checkIntersection = intersection_helper.DetermineProductIntersection(
    //   stage,
    //   stage.getPointerPosition()
    // );

    // clone.AddToFixture(checkIntersection);

  }

  AddControlCloneListener() {
    let self = this;
    document.addEventListener('keydown', function (e) {

      var ctrlKey = 17,
        cmdKey = 91,
        vKey = 86,
        // cDeleteKey = 46,
        cKey = 67;

      if (e.keyCode === ctrlKey || e.keyCode === cmdKey || e.keyCode === vKey || e.keyCode === cKey) {
        if (self.CloneSettings.CloneListening == true) {
          self.CloneSettings.CtrlIsDown = true;
        }
      } else {
        if (self.CloneSettings.CloneListening == true) {
          self.CloneSettings.CtrlIsDown = false;
        }
      }
      // if (e.keyCode === cDeleteKey) {
      //     // fire event
      //     var trElements = stage.find('Transformer');
      //     if (trElements.length > 0) {
      //         if (trElements[0].parent.getId() === uid) {
      //             group.destroy();
      //             layer.draw();
      //         }
      //     }
      // }

      setTimeout(() => {
        self.CloneSettings.CtrlIsDown = false;
      }, 1000);
    });

    document.addEventListener('keyup', function () {
      self.CtrlIsDown = false;
    });
  }

  //#endregion

  hasIntersection(r1, r2) {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }

  //#region Re-Align products to fixture after gondaola deleted or dimensions changed
  /// Re aligns the products to the fixtures after a gondola has been deleted.
  ReAlignProductsToFixture(prevFixturePosition, fixtureDeltaX) {
    console.log("[ProductGroup] Re-Align to Fixture START")
    let self = this;
    let fixtureItem = self.Store_GetFixture();

    let positveNegativeAdjustment = 0;
    var moveByUnits = 0;

    if (fixtureItem == null) {
      console.error("[ProductGroup] Re-Align failed to find fixture");
      return;
    }

    positveNegativeAdjustment = fixtureItem.Group.getX() - prevFixturePosition.x;

    if (positveNegativeAdjustment > 0) { // positive adjustment
      moveByUnits = self.Group.getX() + fixtureDeltaX;
    } else { // negative adjustment
      moveByUnits = self.Group.getX() - fixtureDeltaX;
    }
    console.log("[ProductGroup] Re-Align move by units", moveByUnits, fixtureDeltaX, self.Group.getX(), positveNegativeAdjustment)
    self.Group.setX(moveByUnits);

    console.log("[ProductGroup] Re-Align END")
  }
  //#region Delete

  DeleteProduct() {
    console.log("[PRODUCT] DELETING");
    let self = this;
    let fixtureItem = self.Store_GetFixture();

    // we test this because a product can be initialised and added to the planogram active products regardless of fixture.
    // If a product doesnt get assigned to the fixture the DeleteProduct is called.
    // If it is not null, this means a product has been assigned successfully to a fixture and needs to remove all reference.
    if (fixtureItem != null) {
      var index = fixtureItem.ProductGroupArray.indexOf(self);
      if (index > -1) {
        fixtureItem.ProductGroupArray.splice(index, 1);
      }
    }

    self.VueStore.commit("removeProductGroup", self);
    self.VueStore.commit("removeActivePlanogramProduct", self.ProductData);
    self.Group.destroy();

    console.log("[PRODUCT] DELETE calling fixture CalculateAllProductAndSubfixturePositions");
    fixtureItem.CalculateAllProductAndSubfixturePositions();
    fixtureItem.Layer.draw();

  }
  //#endregion Delete
}

export default ProductBase;