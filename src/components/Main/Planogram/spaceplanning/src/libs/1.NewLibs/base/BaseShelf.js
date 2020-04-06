import Konva from 'konva';
import GeneralPositionHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GeneralPosition.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";
import CloneBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/CloneBase.js";
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";

class BaseShelf extends PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, gondolaID) {
    super(vueStore, stage, layer, data, ratio, type, gondolaID);

    this.ParentTreeRedraw = new ParentTreeRedraw();
    this.BaseBar = null;
  }

  Initialise(dropPos, positionElementRequired = true) {
    let self = this;
    // add it to the store immediately
    self.AddToStore();

    self.BuildBase(dropPos);
    self.SetBaseDraggable(true);
    self.MoveThisToTop();

    // set width heights
    self.SetObjectDimensions();

    self.Build(dropPos, positionElementRequired);
  }

  SetObjectDimensions() {
    let self = this;

    self.Width = self.Data.width * self.Ratio;
    self.Height = self.Data.height * self.Ratio;
    self.TotalWidth = self.Width;
    self.TotalHeight = self.Height;
    self.Group.setWidth(self.TotalWidth)
    self.Group.setHeight(self.TotalHeight)
  }

  Build(dropPos, positionElementRequired = true) {
    let self = this;
    // TODO: add the extended method calls here
    self.AddBaseCosmetic();

    self.AddBaseBar();
    self.AddTextCosmetic();

    if (positionElementRequired == true) {
      self.PositionElement();
    }

    self.HideShowLabels();
    self.AddRenderings();
    self.ApplyZIndexing();

    self.Layer.draw();
  }

  PositionElement(intersects = null) {
    let self = this;

    let ctrl_position = new GeneralPositionHelper();
    let ctrl_store = new StoreHelper();

    if (ctrl_store.getCloneItem(self.VueStore) == self.ID) {
      let ctrl_clone = new CloneBase("BASE");
      ctrl_clone.Clone(self.VueStore, self.Stage, self, null, null, function() {
        self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ID);
      });
      return;
    }

    if (intersects != null) {

      if (intersects != undefined && intersects.intersects == true) {
        if (intersects.ID != self.ParentID && intersects.ID != self.ID) {

          // adust the previous parent after a move
          // let prevParent = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
          // if (prevParent != null && prevParent != null) {
          //   prevParent.UpdateMilkCrate(prevParent.ID);
          //   let allChildren = ctrl_store.getAllPlanogramItems(self.VueStore, prevParent.ID);
          //   allChildren.forEach(child => {
          //     child.Update();
          //     child.PositionElement();
          //   });
          // }

          ctrl_position.PositionToParent(self.VueStore, null, self.ParentID) // IMPORTANT!

          self.ParentID = intersects.ID;
          // move this item to the new group
          let gondolaItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
          self.MoveToParentGroup(gondolaItem);

          self.Group.setY(intersects.ContainerPosition.y)
          self.Group.setX(intersects.ContainerPosition.x)
        }
      }
    } else {
      self.Group.setY(self.LastPositionRelative.y)
      self.Group.setX(self.LastPositionRelative.x)
    }

    self.PositionBase();
  }

  PositionBase() {
    let self = this;

    let ctrl_store = new StoreHelper();
    let gondolaItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);

    self.Group.setX(0);
    self.Group.setY(((gondolaItem.TotalHeight) - self.TotalHeight));

    // adjust label values + fixture positions
    let ctrl_label = new LabelHelper();
    ctrl_label.SetNewLabelAndPositionNumbers(self.VueStore);

    self.Layer.draw();
  }

  ChangeDimensions(eventData) {
    let self = this;
    let ctrl_store = new StoreHelper();

    let lastData = self.Data;
    let newData = eventData.data;

    let deltaChangeObj = self.AdjustMasterGroupPositionAfterDimensionChange(lastData, newData)
    self.AdjustElementPosition(deltaChangeObj.deltaX, deltaChangeObj.deltaY);

    self.Data = newData;
    self.SetObjectDimensions();
    
    self.BaseBar.fill(self.Data.frontTransparent ? 'transparent' : self.Data.frontColor);
    self.BaseBar.setWidth(self.TotalWidth); // sample
    self.BaseBar.setHeight(self.TotalHeight); // sample
    self.Group.setWidth(self.TotalWidth);
    self.Group.setHeight(self.TotalHeight);

    self.HideShowLabels();

    if(self.Data.frontImageID == undefined || self.Data.frontImageID == null) {
      self.LoadImage(self.BaseBar, "data:image/png;base64," + self.Data.image);
    } else {
      self.LoadImage(self.BaseBar, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.frontImageID}`);
    }

    // self.LoadImage(self.BaseBar, self.Data.image);
    // call position element
    self.PositionElement();

    // call direct children to reposition
    let childrenItems = ctrl_store.getAllPlanogramItems(self.VueStore, self.ID);
    childrenItems.forEach(child => {
      child.AdjustElementPosition(deltaChangeObj.deltaX, deltaChangeObj.deltaY, true);
      child.PositionElement();
    });

    self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ID);

    self.AddRenderings();
    self.ApplyZIndexing();
  }

  AddRenderings() {
    let self = this;

    self.RemoveRenderings();
    
    if (self.Data.RenderingsItems == undefined || self.Data.RenderingsItems == null) {
      return;
    }

    if (self.Data.RenderingsItems.ShelfEdge != undefined || self.Data.RenderingsItems.ShelfEdge != null) {
      console.log("[BASE RENDERING] SHELF EDGE", self.Data.RenderingsItems.ShelfEdge);
      
      // add shelf edge rendering
      let w = self.Data.RenderingsItems.ShelfEdge.width * self.Ratio;
      let h = self.Data.RenderingsItems.ShelfEdge.height * self.Ratio;
      let offset = 0;

      if (self.Data.RenderingsItems.ShelfEdge.yOffset != undefined) {
        offset = parseFloat(self.Data.RenderingsItems.ShelfEdge.yOffset) * self.Ratio
      }

      let shelfEdge = new Konva.Image({
        x: 0,
        y: (h * -1) - offset,
        width: w,
        height: h,
        fill: self.Data.frontTransparent ? 'transparent' : self.Data.frontColor,
        listening: false
      })

      if(self.Data.RenderingsItems.ShelfEdge.frontImageID == undefined || self.Data.RenderingsItems.ShelfEdge.frontImageID == null) {
        self.LoadImage(shelfEdge, "data:image/png;base64," + self.Data.RenderingsItems.ShelfEdge.image);
      } else {
        self.LoadImage(shelfEdge, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.RenderingsItems.ShelfEdge.frontImageID}`);
      }

      // self.LoadImage(shelfEdge, self.Data.RenderingsItems.ShelfEdge.image);

      self.Renderings.push({
        type: 'SHELFEDGE',
        konva: shelfEdge
      });

      self.Group.add(shelfEdge);
    }

    if (self.Data.RenderingsItems.LabelHolder != undefined || self.Data.RenderingsItems.LabelHolder != null) {
      console.log("[BASE RENDERING] LABEL HOLDER", self.Data.RenderingsItems.LabelHolder);
      // add shelf edge rendering
      let w = self.Data.RenderingsItems.LabelHolder.width * self.Ratio;
      let h = self.Data.RenderingsItems.LabelHolder.height * self.Ratio;
      let offset = 0;

      if (self.Data.RenderingsItems.LabelHolder.yOffset != undefined) {
        offset = parseFloat(self.Data.RenderingsItems.LabelHolder.yOffset) * self.Ratio
      }

      let shelfLabelHolder = new Konva.Image({
        x: 0,
        y: 0 + offset,
        width: w,
        height: h,
        fill: self.Data.frontTransparent ? 'transparent' : self.Data.frontColor,
        listening: false
      })

      if(self.Data.RenderingsItems.LabelHolder.frontImageID == undefined || self.Data.RenderingsItems.LabelHolder.frontImageID == null) {
        self.LoadImage(shelfLabelHolder, "data:image/png;base64," + self.Data.RenderingsItems.LabelHolder.image);
      } else {
        self.LoadImage(shelfLabelHolder, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.RenderingsItems.LabelHolder.frontImageID}`);
      }

      // self.LoadImage(shelfLabelHolder, self.Data.RenderingsItems.LabelHolder.image);

      self.Renderings.push({
        type: 'LABELHOLDER',
        konva: shelfLabelHolder
      });

      self.Group.add(shelfLabelHolder);
    }

    if (self.Data.RenderingsItems.Back != undefined || self.Data.RenderingsItems.Back != null) {
      // add shelf edge rendering
      console.log("[BASE RENDERING] BACK RENDERING", self.Data.RenderingsItems.Back);
      let w = self.Data.RenderingsItems.Back.width * self.Ratio;
      let h = self.Data.RenderingsItems.Back.height * self.Ratio;
      let offset = 0;

      if (self.Data.RenderingsItems.Back.yOffset != undefined) {
        offset = parseFloat(self.Data.RenderingsItems.Back.yOffset) * self.Ratio
      }

      var shelfBack = new Konva.Image({
        x: 0,
        y: (h * -1) - offset,
        width: w,
        height: h,
        fill: self.Data.frontTransparent ? 'transparent' : self.Data.frontColor,
        listening: false
      })

      if(self.Data.RenderingsItems.Back.frontImageID == undefined || self.Data.RenderingsItems.Back.frontImageID == null) {
        self.LoadImage(shelfBack, "data:image/png;base64," + self.Data.RenderingsItems.Back.image);
      } else {
        self.LoadImage(shelfBack, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.RenderingsItems.Back.frontImageID}`);
      }

      // self.LoadImage(shelfBack, self.Data.RenderingsItems.Back.image);

      self.Renderings.push({
        type: 'BACKRENDERING',
        konva: shelfBack
      });

      self.Group.add(shelfBack);
    }

    /** This will be applied if a productRendering is turned on */
    self.AddProductRenderings();
    
    self.Layer.draw();
    // self.Group.draw();
  }

  AddProductRenderings() {
    let self = this;
    let ctrl_store = new StoreHelper();
    if (self.Data.productRendering != undefined && self.Data.productRendering != null && self.Data.productRendering == true) {
      let allProducts = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "PRODUCT", self.ID);

      if (allProducts.length == 0) {
        return;
      }

      let margin = 0;
      if (self.Data.productRenderingMargin != undefined && self.Data.productRenderingMargin != null) {
        margin = self.Data.productRenderingMargin;
      }
      
      allProducts.forEach(product => {
        // add rendering
        product.RemoveRendering();
        product.AddRendering(self, margin);
      });
    } else {
      console.warn("[PRODUCT RENDERING]", self.Type, "Product rendering setting off")
      let allProducts = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "PRODUCT", self.ID);

      if (allProducts.length == 0) {
        return;
      }

      allProducts.forEach(product => {
        // add rendering
        product.RemoveRendering();
      });
    }
  }

  RemoveRenderings() {
    let self = this;

    self.Renderings.forEach(element => {
      element.konva.destroy();
    });

    self.Renderings = [];
  }

  AddBaseCosmetic() {
    let self = this;
  }

  AddBaseBar() {
    let self = this;

    self.BaseBar = new Konva.Image({
      x: 0,
      y: 0,
      width: self.Data.width * self.Ratio,
      height: self.Data.height * self.Ratio,
      fill: self.Data.frontTransparent ? 'transparent' : self.Data.frontColor,
      transformsEnabled: 'position'
    })

    if(self.Data.frontImageID == undefined || self.Data.frontImageID == null) {
      self.LoadImage(self.BaseBar, "data:image/png;base64," + self.Data.image);
    } else {
      self.LoadImage(self.BaseBar, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.frontImageID}`);
    }

    // self.LoadImage(self.BaseBar, self.Data.image);

    self.Group.add(self.BaseBar);
  }

  SetTextLabel(number) {
    let self = this;
    self.Position = number;
    self.Text.text(self.Data.label + " " + number);
    self.Group.draw();
  }

  AdjustBarPosition() {

  }
}

export default BaseShelf;