import Konva from 'konva';
import EventBus from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js';
import CustomEmitter from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js';
import IntersectDrop from "@/components/Main/Planogram/spaceplanning/src/libs/Intersection/drop-intersection-helper.js";
import ProductBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/ProductBase.js'
import axios from 'axios';

class ProductGroup extends ProductBase {
  constructor(VueStore, productData, ratio) {
    super(VueStore, productData, ratio);
  }

  Initialise(stage) {
    let self = this;
    self.Stage = stage;
    self.GetImages(stage);
    if (self.image_used == null) { // test that it is null, in case this was a cloned product
      self.image_used = self.image_front;
    }
    // self.Build(stage, self.Orientation_Width, self.Orientation_Height);
    self.Build(stage);

    self.Store_AddActivePlanogramProduct();
    self.Notify_SelectedDeselected(true);
  }

  Build(stage /*, w, h*/ ) {
    let self = this;
    return new Promise(function (resolve) {
      self.AddLayer();
      self.AddGroup();
      // self.AddProductDisplay(w, h);
      stage.add(self.Layer);
      self.SetIndexes();
      self.AddEvents(stage);

      resolve();
    })
  }

  AddLayer() {
    this.Layer = new Konva.Layer();
  }

  AddGroup() {
    this.Group = new Konva.Group({
      name: 'product_group',
      x: 0,
      y: 0,
      draggable: true
    })

    this.Layer.add(this.Group);
  }

  GetImages(stage) {
    let self = this;
    let rng = self.getRng();

    let productImageData = self.getImageFromBarcode(self.ProductData.Barcode);

    let imageURL_front = localStorage.ServerAddress + 'ProductImage?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.1';
    let imageURL_front_exists = localStorage.ServerAddress + 'ProductImage/Exists?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.1';
    let imageURL_side = localStorage.ServerAddress + 'ProductImage?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.2';
    let imageURL_side_exists = localStorage.ServerAddress + 'ProductImage/Exists?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.2';
    let imageURL_top = localStorage.ServerAddress + 'ProductImage?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.3';
    let imageURL_top_exists = localStorage.ServerAddress + 'ProductImage/Exists?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.3';

    //#region Images
    //#region Front Image
    // self.image_front_rect = new Konva.Image({
    //     listening: false
    // })
    // self.image_front_rect.hide();
    self.image_front = new Image();

    axios.get(imageURL_front_exists)
      .then(response => {
        if (response.data == true) {
          self.image_front.onload = function () {
            // remove if performance issues ... first draw after image load
            if (self.LastFace.toUpperCase() == "FRONT") {
              self.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
              stage.draw();
            }

          };
          self.image_front.src = imageURL_front;
          self.image_front.crossOrigin = 'Anonymous';
        }
      })
    //#endregion

    //#region Side Image
    // self.image_side_rect = new Konva.Image({
    //     listening: false
    // })
    // self.image_side_rect.hide();

    axios.get(imageURL_front_exists)
      .then(response => {
        if (response.data == true) {
          self.image_side = new Image();
          self.image_side.onload = function () {
            // self.image_side_rect.image(self.image_side);
            if (self.LastFace.toUpperCase() == "LEFT") {
              self.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
              stage.draw();
            }
          };
          self.image_side.src = imageURL_side;
          self.image_side.crossOrigin = 'Anonymous';
        }
      });
    //#endregion

    //#region Top Image
    // self.image_top_rect = new Konva.Image({
    //     listening: false
    // })
    // self.image_top_rect.hide();

    axios.get(imageURL_front_exists)
      .then(response => {
        if (response.data == true) {
          self.image_top = new Image();
          self.image_top.onload = function () {
            // self.image_top_rect.image(self.image_top);
            if (self.LastFace.toUpperCase() == "TOP") {
              self.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
              stage.draw();
            }
          };
          self.image_top.src = imageURL_top;
          self.image_top.crossOrigin = 'Anonymous';
        }
      });
    //#endregion
    //#endregion
  }

  AddProductDisplay(w, h) {
    let self = this;

    // console.group("Product Group");
    // console.log("Start Destroy");
    let fixtureItem = self.Store_GetFixture();

    // RESET - Then re-calc for each facing
    self.TotalWidth = 0;
    self.TotalHeight = 0;
    self.ProductRects.forEach(element => {
      element.destroy()
    });

    // destroy text labels
    self.TextRects.forEach(element => {
      element.destroy()
    });

    // destroy group box if assigned
    if (self.ProductGroupBox != null) {
      self.ProductGroupBox.destroy();
      self.ProductGroupBox = null;
    }
    if (self.ProductGroupBoxText != null) {
      self.ProductGroupBoxText.destroy();
      self.ProductGroupBoxText = null;
    }

    // destroy image boxes
    self.ImageRects.forEach(element => {
      element.destroy()
    });

    self.ProductRects = [];
    self.ImageRects = [];

    // console.log("End Destroy");

    if (self.FixtureType == null || self.FixtureType.length == 0) {
      return; // CLONING AND HAS NOT BEEN ASSIGNED TO A FIXTURE YET.
    }

    // console.log("Start Create")

    for (var y = 0; y < self.Facings_Y; y++) {
      for (var x = 0; x < self.Facings_X; x++) {

        let placeY = self.ProductPosition(y, x).y;
        let placeX = self.ProductPosition(y, x).x;
        let rect = new Konva.Image({
          x: placeX,
          y: placeY,
          width: w,
          height: h,
          fill: self.Selected == true ? '#1976d2' : self.RandomColor,
          stroke: 'black',
          strokeWidth: 0.5
        })

        if (self.Selected == true) {
          rect.opacity(0.5);
        } else {
          rect.opacity(1);
        }

        let image_rect = new Konva.Image({
          listening: false
        })

        self.ProductRects.push(rect)
        self.Group.add(rect);

        if (self.LastFace.toUpperCase() === "FRONT") {
          image_rect.rotation(0);
          image_rect.image(self.image_front);
          image_rect.setX(rect.getX() + rect.width() / 2);
          image_rect.setY(rect.getY() + rect.height() / 2);

          image_rect.offset({
            x: self.image_orientation_width / 2,
            y: self.image_orientation_height / 2
          })

          image_rect.setWidth(self.image_orientation_width);
          image_rect.setHeight(self.image_orientation_height);

          image_rect.rotation(self.Rotation);

          self.ImageRects.push(image_rect);
          self.Group.add(image_rect);

        } else if (self.LastFace.toUpperCase() === "LEFT") {
          image_rect.rotation(0);
          image_rect.image(self.image_side);
          image_rect.setX(rect.getX() + rect.width() / 2);
          image_rect.setY(rect.getY() + rect.height() / 2);

          image_rect.offset({
            x: self.image_orientation_width / 2,
            y: self.image_orientation_height / 2
          })

          image_rect.setWidth(self.image_orientation_width);
          image_rect.setHeight(self.image_orientation_height);

          image_rect.rotation(self.Rotation);

          self.ImageRects.push(image_rect);
          self.Group.add(image_rect);

        } else if (self.LastFace.toUpperCase() === "TOP") {
          image_rect.rotation(0);
          image_rect.image(self.image_top);
          image_rect.setX(rect.getX() + rect.width() / 2);
          image_rect.setY(rect.getY() + rect.height() / 2);

          image_rect.offset({
            x: self.image_orientation_width / 2,
            y: self.image_orientation_height / 2
          })

          image_rect.setWidth(self.image_orientation_width);
          image_rect.setHeight(self.image_orientation_height);

          image_rect.rotation(self.Rotation);

          self.ImageRects.push(image_rect);
          self.Group.add(image_rect);
        }

        if (self.ImagesOff == false) {
          image_rect.show();
        } else {
          image_rect.hide();
        }

        if (fixtureItem.Type.toUpperCase() != "PEGBOARD") {
          self.Group.setY(fixtureItem.ClientRect.getY());
        }

        let text = new Konva.Text({
          name: 'product_rect_label',
          x: placeX,
          y: placeY,
          width: w,
          height: h,
          text: self.ProductData.Description,
          fontSize: 10,
          fontFamily: 'Arial',
          fill: 'black',
          wrap: 'word',
          padding: 2
        })
        text.align('center');
        self.TextRects.push(text);

        self.Group.add(text);
      }
    }

    // console.log("End Create")

    // console.log("Caps Start Create")

    //#region Caps
    if (self.Caps_Enabled == true) {
      for (var y = 0; y < self.Caps_Count; y++) {
        for (var x = 0; x < self.Facings_X; x++) {

          let placeY = 0;
          if (self.FixtureID == null) {
            placeY = 0;
          } else {
            placeY = fixtureItem.ClientRect.getHeight() - ((self.Facings_Y) * self.Orientation_Height);
            placeY -= (y + 1) * self.Cap_Orientation_Height
          }

          let rect = new Konva.Image({
            x: (x * self.Orientation_Width),
            y: placeY,
            width: self.Cap_Orientation_Width,
            height: self.Cap_Orientation_Height,
            fill: self.Selected == true ? '#1976d2' : self.RandomColor,
            stroke: 'black',
            strokeWidth: 1
          })

          if (self.Selected == true) {
            rect.opacity(0.5);
          } else {
            rect.opacity(1);
          }

          let image_rect = new Konva.Image({
            listening: false
          })

          self.ProductRects.push(rect)
          self.Group.add(rect);

          if (self.Caps_Face.toUpperCase() === "FRONT") {
            image_rect.rotation(0);
            image_rect.image(self.image_front);

            image_rect.setX(rect.getX());
            image_rect.setY(rect.getY());

            image_rect.setX(rect.getX() + rect.width() / 2);
            image_rect.setY(rect.getY() + rect.height() / 2);

            image_rect.offset({
              x: self.caps_image_orientation_width / 2,
              y: self.caps_image_orientation_height / 2
            })

            image_rect.setWidth(self.caps_image_orientation_width);
            image_rect.setHeight(self.caps_image_orientation_height);

            image_rect.rotation(self.Cap_Rotation);

            self.ImageRects.push(image_rect);
            self.Group.add(image_rect);

          } else if (self.Caps_Face.toUpperCase() === "LEFT") {
            image_rect.rotation(0);
            image_rect.image(self.image_side);
            image_rect.setX(rect.getX() + rect.width() / 2);
            image_rect.setY(rect.getY() + rect.height() / 2);

            image_rect.offset({
              x: self.caps_image_orientation_width / 2,
              y: self.caps_image_orientation_height / 2
            })

            image_rect.setWidth(self.caps_image_orientation_width);
            image_rect.setHeight(self.caps_image_orientation_height);

            image_rect.rotation(self.Cap_Rotation);

            self.ImageRects.push(image_rect);
            self.Group.add(image_rect);

          } else if (self.Caps_Face.toUpperCase() === "TOP") {
            image_rect.rotation(0);
            image_rect.image(self.image_top);
            image_rect.setX(rect.getX() + rect.width() / 2);
            image_rect.setY(rect.getY() + rect.height() / 2);

            image_rect.offset({
              x: self.caps_image_orientation_width / 2,
              y: self.caps_image_orientation_height / 2
            })

            image_rect.setWidth(self.caps_image_orientation_width);
            image_rect.setHeight(self.caps_image_orientation_height);

            image_rect.rotation(self.Cap_Rotation);

            self.ImageRects.push(image_rect);
            self.Group.add(image_rect);
          }

          if (self.ImagesOff == false) {
            image_rect.show();
          } else {
            image_rect.hide();
          }

          if (fixtureItem.Type.toUpperCase() != "PEGBOARD") {
            self.Group.setY(fixtureItem.ClientRect.getY());
          }

          let text = new Konva.Text({
            name: 'product_rect_label',
            x: (x * self.Orientation_Width),
            y: placeY,
            width: w,
            height: h,
            text: self.ProductData.Description,
            fontSize: 10,
            fontFamily: 'Arial',
            fill: 'black',
            wrap: 'word',
            padding: 2
          })
          text.align('center');
          self.TextRects.push(text);
          self.Group.add(text);
        }
      }
    }
    //#endregion Caps
    // console.log("Caps End Create")

    // console.log("Start Draw")
    fixtureItem.Layer.draw();
    // console.log("End Draw")

    self.TotalWidth = self.Orientation_Width * self.Facings_X;
    self.TotalHeight = self.Orientation_Height * self.Facings_Y + (self.Caps_Count * self.Cap_Orientation_Height);
    self.ShowProductGroupBox();
    // console.groupEnd();

    self.ToggleImages(self.ImagesOff);

    //#region Calculate Facings
    self.Calculate_Facings();
    console.log("TTL FACINGS", self.TotalFacings)
    //#endregion
  }

  ShowProductGroupBox() {
    let self = this;
    let fixtureItem = self.Store_GetFixture();

    let placeY = 0;

    if (self.ProductGroupBox == null) {
      if (self.FixtureID != null) {
        placeY = self.ProductPosition(self.Facings_Y - 1, self.Facings_X).y; //fixtureItem.ClientRect.getHeight() - ((self.Facings_Y) * self.Orientation_Height);
        placeY -= (self.Caps_Count) * self.Cap_Orientation_Height

        self.ProductGroupBox = new Konva.Rect({
          x: 0,
          y: placeY,
          width: self.TotalWidth,
          height: self.TotalHeight,
          stroke: 'black',
          strokeWidth: 1
        })

        self.Group.add(self.ProductGroupBox);
      }
    }

    if (self.ProductGroupBox_ON == false) {
      self.ProductGroupBox.hide();
    } else {
      self.ProductGroupBox.show();
    }

    self.ProductGroupBox.opacity(self.Selected == true ? 0.5 : 1);
    self.ProductGroupBox.fill(self.Selected == true ? '#1976d2' : self.RandomColor);

    self.AddText();
  }

  AddText() {
    let self = this;
    let fixtureItem = self.Store_GetFixture();

    var strText = self.ProductData.Description;

    if (self.FixtureID != null && self.ProductGroupBoxText == null) {

      let placeY = self.ProductPosition((self.Facings_Y + self.Caps_Count) - 1, self.Facings_X).y;
      self.ProductGroupBoxText = new Konva.Text({
        x: 0,
        y: placeY,
        width: self.TotalWidth,
        height: self.TotalHeight,
        wrap: 'word',
        text: strText,
        fontSize: 10,
        fontFamily: 'Arial',
        fill: 'black',
        padding: 2
      });
      self.ProductGroupBoxText.align('center');

      self.Group.add(self.ProductGroupBoxText);
    }

    if (self.ProductGroupBox_ON == false) {
      self.ProductGroupBoxText.hide();
    } else {
      self.ProductGroupBoxText.show();
    }
  }

  AddEvents(stage) {
    let self = this;
    let clone = null;
    self.AddControlCloneListener();

    self.Group.on('dragstart', function () {
      this.moveToTop();
      clone = null;
      if (self.CloneSettings.CtrlIsDown == true) {
        this.stopDrag();
        clone = new ProductGroup(self.VueStore, self.ProductData, self.Ratio);
        self.CloneProduct(stage, self, clone);
        document.body.style.cursor = 'copy';
      } else {
        document.body.style.cursor = 'move';
        self.LastPosition = self.Group.position();
        self.Visual_Opacity(true); // turn on opacity while moving
      }
    })

    self.Group.on('dragmove', function() {
      document.body.style.cursor = 'move';
    });

    self.Group.on('dragend', function () {
      console.log("END DRAG PRODUCT")
      self.Visual_Opacity(false); // turn off opacity while moving
      document.body.style.cursor = 'default';

      if (clone == null) {
        let transform = self.Stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = stage.getPointerPosition();
        let dropPos = transform.point(pos);

        let intersection_helper = new IntersectDrop();
        intersection_helper.DetermineProductIntersection(self.Stage, dropPos)
          .then(intersectionCheck => {
            console.log("[END DRAG PRODUCT] PRODUCT INTRSCT RESULT", intersectionCheck);
            self.AddToFixture(intersectionCheck);
            let fixtureItem = self.Store_GetFixture();
            fixtureItem.CalculateAllProductAndSubfixturePositions();
          });
      }
    })

    self.Group.on('click', function () {
      // apply filters

      // self.ProductRects.forEach(product => {
      //     product.fill('red');
      // });

      self.Group.draw();
      self.Notify_SelectedDeselected(true);
    })

    self.Group.on('mouseenter', function () {
      let event = new CustomEmitter();
      event.notify_product_group_statistics(EventBus, true, self);
    })

    self.Group.on('mouseleave', function () {
      let event = new CustomEmitter();
      event.notify_product_group_statistics(EventBus, false, self);
    })

    self.Group.on('dblclick dbltap', function () {
      self.Open_Modal();
    })

    stage.draw();
  }

  Notify_SelectedDeselected(selected) {
    let event = new CustomEmitter();
    event.notify_product_group_selected_deselected(EventBus, selected, this);
  }

  Open_Modal() {
    let self = this;
    let event = new CustomEmitter();
    event.modal_load(EventBus, "PRODUCT", null, self.ProductData, self.ProductData.Barcode, self);
  }

  //#region Z-Indexing
  SetIndexes() {
    let self = this;
    self.Layer.moveToTop();
  }
  //#endregion

  //#region External methods to be used
  PositionWithfixtureItemDragCalc() {
    let self = this;
    self.AddProductDisplay(self.Orientation_Width, self.Orientation_Height)
    self.ShowProductGroupBox();
  }
  //#endregion

  //#region External Methods

  IncreaseFacingsX() {
    let self = this;
    let fixtureItem = self.Store_GetFixture();
    self.Facings_X++;
    fixtureItem.CalculateAllProductAndSubfixturePositions();
    self.Layer.draw();
  }

  IncreaseFacingsY() {
    let self = this;
    let fixtureItem = self.Store_GetFixture();

    self.Facings_Y++;
    fixtureItem.CalculateAllProductAndSubfixturePositions();
    self.Layer.draw();
  }

  DecreaseFacingsX() {
    let self = this;
    let fixtureItem = self.Store_GetFixture();

    if (self.Facings_X > 1) {
      self.Facings_X--;
      fixtureItem.CalculateAllProductAndSubfixturePositions();
      self.Layer.draw();
    } else {
      // do nothing
    }
  }

  DecreaseFacingsY() {
    let self = this;
    let fixtureItem = self.Store_GetFixture();

    if (self.Facings_Y > 1) {
      self.Facings_Y--;
      fixtureItem.CalculateAllProductAndSubfixturePositions();
      self.Layer.draw();
    } else {
      // do nothing
    }
  }

  ChangeOrientation(face) {
    let self = this;
    self.LastFace = face;

    switch (face.toUpperCase()) {
      case "FRONT":
        {
          switch (self.Rotation) {
            case 0:
              {
                // no rotation
                self.Orientation_Width = self.ProductWidth;
                self.Orientation_Height = self.ProductHeight;
                self.Orientation_Depth = self.ProductDepth;

                self.image_used = self.image_front;

                self.image_orientation_width = self.Orientation_Width;
                self.image_orientation_height = self.Orientation_Height;

                // set cap details
                self.Caps_Face = "TOP";
                self.Cap_Orientation_Width = self.Orientation_Width;
                self.Cap_Orientation_Height = self.Orientation_Depth;
                self.Cap_Orientation_Depth = self.ProductHeight;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
            case 90:
              {
                // 90 degree rotation
                self.Orientation_Width = self.ProductHeight;
                self.Orientation_Height = self.ProductWidth;
                self.Orientation_Depth = self.ProductDepth;

                self.image_used = self.image_front;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "LEFT";
                self.Cap_Orientation_Width = self.Orientation_Width;
                self.Cap_Orientation_Height = self.Orientation_Depth;
                self.Cap_Orientation_Depth = self.ProductWidth;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
            case 180:
              {
                // 180 degree rotation
                self.Orientation_Width = self.ProductWidth;
                self.Orientation_Height = self.ProductHeight;
                self.Orientation_Depth = self.ProductDepth;

                self.image_used = self.image_front;

                self.image_orientation_width = self.ProductWidth;
                self.image_orientation_height = self.ProductHeight;

                // set cap details
                self.Caps_Face = "TOP";
                self.Cap_Orientation_Width = self.Orientation_Width;
                self.Cap_Orientation_Height = self.Orientation_Depth;
                self.Cap_Orientation_Depth = self.ProductHeight;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
            case 270:
              {
                // 270 degree rotation
                self.Orientation_Width = self.ProductHeight;
                self.Orientation_Height = self.ProductWidth;
                self.Orientation_Depth = self.ProductDepth;

                self.image_used = self.image_front;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "LEFT";
                self.Cap_Orientation_Width = self.Orientation_Width;
                self.Cap_Orientation_Height = self.Orientation_Depth;
                self.Cap_Orientation_Depth = self.ProductWidth;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
          }
        }
        break;
      case "LEFT":
        {
          switch (self.Rotation) {
            case 0:
              {
                // no rotation
                self.Orientation_Width = self.ProductDepth;
                self.Orientation_Height = self.ProductHeight;
                self.Orientation_Depth = self.ProductWidth;

                self.image_used = self.image_side;

                self.image_orientation_width = self.Orientation_Width;
                self.image_orientation_height = self.Orientation_Height;

                // set cap details
                self.Caps_Face = "TOP";
                self.Cap_Orientation_Width = self.ProductDepth;
                self.Cap_Orientation_Height = self.ProductWidth;
                self.Cap_Orientation_Depth = self.ProductHeight;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
            case 90:
              {
                // 90 degree rotation
                self.Orientation_Width = self.ProductHeight;
                self.Orientation_Height = self.ProductDepth;
                self.Orientation_Depth = self.ProductWidth;

                self.image_used = self.image_side;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "FRONT";
                self.Cap_Orientation_Width = self.ProductHeight;
                self.Cap_Orientation_Height = self.ProductWidth;
                self.Cap_Orientation_Depth = self.ProductDepth;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
            case 180:
              {
                // 180 degree rotation
                self.Orientation_Width = self.ProductDepth;
                self.Orientation_Height = self.ProductHeight;
                self.Orientation_Depth = self.ProductWidth;

                self.image_used = self.image_side;

                self.image_orientation_width = self.Orientation_Width;
                self.image_orientation_height = self.Orientation_Height;

                // set cap details
                self.Caps_Face = "TOP";
                self.Cap_Orientation_Width = self.ProductDepth;
                self.Cap_Orientation_Height = self.ProductWidth;
                self.Cap_Orientation_Depth = self.ProductHeight;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
            case 270:
              {
                // 270 degree rotation
                self.Orientation_Width = self.ProductHeight;
                self.Orientation_Height = self.ProductDepth;
                self.Orientation_Depth = self.ProductWidth;

                self.image_used = self.image_side;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "FRONT";
                self.Cap_Orientation_Width = self.ProductHeight;
                self.Cap_Orientation_Height = self.ProductWidth;
                self.Cap_Orientation_Depth = self.ProductDepth;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
          }
        }
        break;
      case "TOP":
        {
          switch (self.Rotation) {
            case 0:
              {
                // no rotation
                self.Orientation_Width = self.ProductWidth;
                self.Orientation_Height = self.ProductDepth;
                self.Orientation_Depth = self.ProductHeight;

                self.image_used = self.image_top;

                self.image_orientation_width = self.Orientation_Width;
                self.image_orientation_height = self.Orientation_Height;

                // set cap details
                self.Caps_Face = "FRONT";
                self.Cap_Orientation_Width = self.ProductWidth;
                self.Cap_Orientation_Height = self.ProductHeight;
                self.Cap_Orientation_Depth = self.ProductDepth;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
            case 90:
              {
                // 90 degree rotation
                self.Orientation_Width = self.ProductDepth;
                self.Orientation_Height = self.ProductWidth;
                self.Orientation_Depth = self.ProductHeight;

                self.image_used = self.image_top;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "LEFT";
                self.Cap_Orientation_Width = self.ProductDepth;
                self.Cap_Orientation_Height = self.ProductHeight;
                self.Cap_Orientation_Depth = self.ProductWidth;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
            case 180:
              {
                // 180 degree rotation
                self.Orientation_Width = self.ProductWidth;
                self.Orientation_Height = self.ProductDepth;
                self.Orientation_Depth = self.ProductHeight;

                self.image_used = self.image_top;

                self.image_orientation_width = self.Orientation_Width;
                self.image_orientation_height = self.Orientation_Height;

                // set cap details
                self.Caps_Face = "FRONT";
                self.Cap_Orientation_Width = self.ProductWidth;
                self.Cap_Orientation_Height = self.ProductHeight;
                self.Cap_Orientation_Depth = self.ProductDepth;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
            case 270:
              {
                // 270 degree rotation
                self.Orientation_Width = self.ProductDepth;
                self.Orientation_Height = self.ProductWidth;
                self.Orientation_Depth = self.ProductHeight;

                self.image_used = self.image_top;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "LEFT";
                self.Cap_Orientation_Width = self.ProductDepth;
                self.Cap_Orientation_Height = self.ProductHeight;
                self.Cap_Orientation_Depth = self.ProductWidth;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
          }
        }
        break;
    }

    self.AddProductDisplay(self.Orientation_Width, self.Orientation_Height);
    self.ShowProductGroupBox();
    self.Group.draw();
    self.Layer.draw();

    let fixtureItem = self.Store_GetFixture();
    fixtureItem.CalculateAllProductAndSubfixturePositions();
    self.Layer.draw();
  }

  Rotate() {
    let self = this;

    let fixtureItem = self.Store_GetFixture();

    self.Rotation = (self.Rotation + 90) % 360;

    self.ChangeOrientation(self.LastFace);
    fixtureItem.CalculateAllProductAndSubfixturePositions();
  }

  UpdateAllProductGroupPositions() {

  }
  //#endregion

  //#region Image from Barcode
  getFolderFile(barcode, index) {
    let retval = {
      folder: String,
      file: String
    }

    retval.folder = barcode.substring(0, index);
    retval.file = barcode.substring(index, barcode.length);

    return retval;
  }

  getImageFromBarcode(barcode) {
    let self = this;

    let retval = {
      folder: String,
      file: String
    }

    switch (barcode.length) {
      case 2:
        {
          retval.file = barcode;
        }
        break;
      case 3:
        {
          retval.file = barcode;
        }
        break;
      case 4:
        {
          retval.file = barcode;
        }
        break;
      case 5:
        {
          retval.file = barcode;
        }
        break;
      case 6:
        {
          retval = self.getFolderFile(barcode, 1)
        }
        break;
      case 7:
        {
          retval = self.getFolderFile(barcode, 2)
        }
        break;
      case 8:
        {
          retval = self.getFolderFile(barcode, 5)
        }
        break;
      case 9:
        {
          retval = self.getFolderFile(barcode, 4)
        }
        break;
      case 10:
        {
          retval = self.getFolderFile(barcode, 5)
        }
        break;
      case 11:
        {
          retval = self.getFolderFile(barcode, 6)
        }
        break;
      case 12:
        {
          retval = self.getFolderFile(barcode, 7)
        }
        break;
      case 13:
        {
          retval = self.getFolderFile(barcode, 7)
        }
        break;
      case 14:
        {
          retval = self.getFolderFile(barcode, 9)
        }
        break;
      case 15:
        {
          retval = self.getFolderFile(barcode, 10)
        }
        break;
    }

    return retval;
  }

  getRng() {
    let rng = Math.random()
    return rng;
  }
  //#endregion

  //#region Delete
  Delete() {
    let self = this;
    self.DeleteProduct();
  }
  //#endregion Delete
}

export default ProductGroup;