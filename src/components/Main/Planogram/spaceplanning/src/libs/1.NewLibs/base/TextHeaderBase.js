import Konva from 'konva';
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";

class TextHeaderBase extends PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, scale, stringText) {
    super(vueStore, stage, layer, data, ratio, type)

    this.Scale = scale;
    this.Area = null;
    this.Text = null;
    this.StringText = stringText;
  }

  Initialise(dropPos, positionElementRequired = true) {
    let self = this;
    // add it to the store immediately
    self.AddToStore();

    self.BuildBase(dropPos);
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

    self.Group.scaleX(self.Scale.ScaleX);
    self.Group.scaleY(self.Scale.ScaleY);

    self.Group.setWidth(self.TotalWidth);
    self.Group.setHeight(self.TotalHeight);
  }

  Build(dropPos, positionElementRequired = true) {
    let self = this;

    // TODO: add the extended method calls here
    // self.AddAreaCosmetic();
    self.AddCustomTextCosmetic();

    if (positionElementRequired == true) {
      self.PositionElement();
    }

    self.Stage.draw();
  }

  PositionElement() {
    // let self = this;
    // let ctrl_store = new StoreHelper();

    // if (ctrl_store.getCloneItem(self.VueStore) == self.ID) {
    //   let ctrl_clone = new CloneBase("GONDOLA");
    //   ctrl_clone.Clone(self.VueStore, self.Stage, self, null, null);
    //   ctrl_store.setCloneItem(self.VueStore, null);
    //   return;
    // }

    // self.PositionGondola();
  }

  //   AddAreaCosmetic() {
  //     let self = this;
  //     self.Area = new Konva.Image({
  //       x: 0,
  //       y: 0,
  //       width: self.Width,
  //       height: self.Height,
  //       fill: self.Data.color,
  //       // stroke: 'black',
  //       // strokeWidth: 0.5,
  //       //   transformsEnabled: 'position'
  //     })


  //     self.LoadImage(self.Area, self.Data.image);

  //     self.Group.add(self.Area);
  //   }

  AddCustomTextCosmetic() {
    let self = this;

    self.Text = new Konva.Text({
      x: 0,
      y: 0,
      text: self.StringText,
      fontFamily: 'Arial',
      fontSize: 18,
      padding: 5,
      fill: 'black',
      align: 'center',
      verticalAlign: 'center',
    })

    var tr = new Konva.Transformer();
    self.Layer.add(tr);
    self.Group.on('dblclick dbltap', () => {
      tr.hide();
      // create textarea over canvas with absolute position
      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of text node relative to the stage:
      var textPosition = self.Text.getAbsolutePosition();

      // then lets find position of stage container on the page:
      var stageBox = self.Stage.getContainer().getBoundingClientRect();

      // so position of textarea will be the sum of positions above:
      var areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y
      };

      // create textarea and style it
      var textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      self.Text.hide();
      self.Layer.draw();
      textarea.value = self.Text.text();
      textarea.style.fontFamily = 'Arial';
      textarea.style.fontSize = '18';
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = self.Text.width() * self.Ratio;

      textarea.focus();

      textarea.addEventListener('keydown', function (e) {
        // hide on enter
        if (e.keyCode === 13) {
          self.StringText = textarea.value;
          self.Text.text(self.StringText);
          self.Text.show();
          self.Layer.draw();
          document.body.removeChild(textarea);
        }
      });
    });

    self.Group.on('click tap', () => {
      tr.attachTo(self.Group);
      tr.show();
      self.Layer.draw();
      self.Group.on('transformend', function () {
        tr.hide();
        self.Layer.draw();
      });
    });
    // self.Text.on('transformstart', function () {
    //   console.log('transform start');
    // });

    self.Group.add(self.Text);
  }
}

export default TextHeaderBase;