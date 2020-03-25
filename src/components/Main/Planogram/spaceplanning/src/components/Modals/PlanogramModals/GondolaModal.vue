<template>
  <v-dialog fullscreen persistent v-model="modalShow">
    <v-card dark v-if="newData != null">
      <v-toolbar>
        <v-toolbar-title>Edit Gondola Properties : {{newData.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="ma-0" @click="deleteGondola" dark color="error" flat fab>
          <v-icon>delete</v-icon>
        </v-btn>
        <v-btn class="ma-0" @click="submit" dark color="primary" flat fab>
          <v-icon>save</v-icon>
        </v-btn>
        <v-btn class="ma-0" @click="modalShow = false" dark flat fab>
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container style="height: calc(100vh - 65px); overflow-x: auto;" grid-list-md>
        <v-layout row wrap>
          <v-flex lg4 md12>
            <v-card class="elevation-5">
              <v-toolbar dense>
                <v-toolbar-title class="toolbar-title">Properties</v-toolbar-title>
              </v-toolbar>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex lg8 md12 sm12 xs12>
                    <v-text-field disabled v-model="newData.name" label="Name:"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12>
                    <v-text-field v-model="newData.countsAs" label="Counts as:"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12>
                    <v-text-field v-if="!newData.rendering" v-model="newData.label" label="Label:"></v-text-field>
                  </v-flex>
                  <v-flex v-if="newData.type == 0 && !newData.rendering" lg8 md12 sm12 xs12>
                    <v-select disabled placeholder="please select" :items="fixtureLabelOrders"
                      v-model="newData.fixtureLabelOrder" label="Label order:">
                    </v-select>
                  </v-flex>
                  <v-flex v-if="newData.type == 0 && !newData.rendering" lg12 md12>
                    <label v-if="!newData.rendering">Label Position</label>
                    <v-radio-group v-if="!newData.rendering" v-model="newData.labelPlacement" row>
                      <v-radio :label="'Left'" value="LEFT"></v-radio>
                      <v-radio :label="'Center'" value="CENTER"></v-radio>
                      <v-radio :label="'Right'" value="RIGHT"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12>
                    <v-select disabled placeholder="please select" v-if="newData.rendering" :items="types"
                      v-model="newData.type" label="Type:">
                    </v-select>
                    <v-select disabled placeholder="please select" v-if="newData.type == 2" :items="fixtureTypes"
                      v-model="newData.fixtureType" label="Type:">
                    </v-select>
                    <v-select disabled placeholder="please select" v-if="newData.type == 3" :items="subTypes"
                      v-model="newData.fixtureType" label="Subtype:">
                    </v-select>
                    <v-select disabled placeholder="please select"
                      v-if="newData.type == 2 && newData.fixtureType == 1 && newData.rendering"
                      :items="renderingTypeShelf" v-model="newData.renderingType" label="Subtype:">
                    </v-select>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering">
                    <v-select placeholder="please select"
                      v-if="(newData.fixtureType == 2 || newData.fixtureType == 3) && newData.type == 2" :items="pegs"
                      v-model="newData.defaultPeg" label="Default peg:">
                    </v-select>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering">
                    <v-select placeholder="please select" :items="spreadProducts" v-model="newData.spreadProducts"
                      label="Spread products:">
                    </v-select>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12>
                    <v-text-field type="number" label="Cost of Fixture" prefix="R" v-model="newData.cost">
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex lg4 md12>
            <v-card class="elevation-5">
              <v-toolbar dense>
                <v-toolbar-title class="toolbar-title">Dimensions</v-toolbar-title>
              </v-toolbar>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex lg8 md12>
                    <v-text-field type="number" v-model="newData.height" label="Height:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12>
                    <v-text-field type="number" v-model="newData.width" label="Width:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="!newData.rendering">
                    <v-text-field type="number" v-model="newData.depth" label="Depth:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12
                    v-if="!newData.rendering && (newData.type == 2 && (newData.fixtureType == 0 || newData.fixtureType == 1))">
                    <v-text-field type="number" v-model="newData.overhang" label="Overhang:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="!newData.rendering && newData.fixtureType == 3">
                    <v-text-field type="number" v-model="newData.productOffset" label="Product offset:" suffix="cm">
                    </v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="newData.fixtureType == 2 && !newData.rendering">
                    <v-text-field type="number" v-model="newData.xHoleSpacing" label="X hole spacing:" suffix="cm">
                    </v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="newData.fixtureType == 2 && !newData.rendering">
                    <v-text-field type="number" v-model="newData.yHoleSpacing" label="Y hole spacing:" suffix="cm">
                    </v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="!newData.rendering||newData.type == 2">
                    <v-select v-model="newData.floorplanShape" :items="floorplanShapes" label="Floorplan Shape:">
                    </v-select>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex lg6 md6 sm6 xs6>
                    <h3>Side Image</h3>
                    <v-card class="elevation-5" @click="openSideFileExplorer"
                      style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                      <img ref="changeSideImage" style="max-height: 150px; max-width: 150px;" :src="imgsrc('Side')"
                        alt="">
                    </v-card>
                    <input ref="fileSideInput" style="display: none" @change="imageSideChange" type="file">
                  </v-flex>
                  <v-flex lg6 md6 sm6 xs6>
                    <h3>Top Image</h3>
                    <v-card class="elevation-5" @click="openTopFileExplorer"
                      style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                      <img ref="changeTopImage" style="max-height: 150px; max-width: 150px;" :src="imgsrc('Top')"
                        alt="">
                    </v-card>
                    <input ref="fileTopInput" style="display: none" @change="imageTopChange" type="file">
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex lg4 md12>
            <v-card class="elevation-5">
              <v-toolbar dense>
                <v-toolbar-title class="toolbar-title">Display</v-toolbar-title>
              </v-toolbar>
              <v-container style="text-align: center;" grid-list-md>
                <v-layout row wrap>
                  <v-expansion-panel inset v-model="general" expand>
                    <v-expansion-panel-content class="elevation-0 pa-0">
                      <div slot="header">General</div>
                      <v-flex lg12 md12 sm12 xs12>
                        <h3>Image</h3>
                        <v-card class="elevation-5" @click="openFileExplorer"
                          style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                          <img ref="changeImage" style="max-height: 150px; max-width: 150px;" src="" alt="">
                        </v-card>
                        <input ref="fileInput" style="display: none" @change="imageChange" type="file">
                      </v-flex>
                      <v-flex lg12 md12 sm12 xs12>
                        <div
                          v-show="newData.type == 2 && (newData.fixtureType == 0 || newData.fixtureType == 1) && !newData.rendering">
                          <h3>Bar image</h3>
                          <v-card class="elevation-5" @click="openFileExplorerBar"
                            style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                            <img ref="changeImageBar" style="max-height: 150px; max-width: 150px;" src="" alt="">
                          </v-card>
                          <input ref="fileInputBar" style="display: none" @change="imageChangeBar" type="file">
                        </div>
                      </v-flex>
                      <v-flex lg12 md12 sm12 xs12>
                        <div v-if="!newData.rendering">
                          <h3>Colour</h3>
                          <compact-picker style="margin: 0 auto;" v-model="newData.color" />
                        </div>
                      </v-flex>
                      <v-flex lg8 md12 sm12 xs12>
                        <v-checkbox hide-details label="Transparent" v-model="newData.transparent"
                          @change="handleTransparency"></v-checkbox>
                      </v-flex>
                      <v-flex lg12 md12 sm12 xs12>
                        <div v-if="newData.type == 2 && newData.fixtureType == 2 && !newData.rendering">
                          <h3>Peg Hole Colour</h3>
                          <compact-picker style="margin: 0 auto;" v-model="newData.pegHoleColor" />
                        </div>
                      </v-flex>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <!-- start of rendering -->
                  <v-expansion-panel inset v-model="RenderingPanel">
                    <v-expansion-panel-content class="elevation-0 pa-0">
                      <div slot="header">Rendering Options</div>
                      <v-flex lg10 md12 sm12 xs12>
                        <h3>Front Face rendering</h3>
                        <v-select placeholder="Render Image" :items="renderingselect" v-model="newData.renderImage"
                          label="Rendering:" @change="changeImageSelect">
                        </v-select>
                        <v-card class="elevation-5" @click="openFileExplorerRender"
                          style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                          <img ref="changeRenderImage" style="max-height: 150px; max-width: 150px;" src="" alt="">
                        </v-card>
                        <input ref="fileInputRender" style="display: none" @change="imageChangeRender" type="file">


                        <v-layout>
                          <v-flex>
                            <v-text-field type="number" v-model="viewRender.height" label="Height:" suffix="cm"
                              :rules=numberRules></v-text-field>
                          </v-flex>
                          <v-flex>
                            <v-text-field type="number" v-model="viewRender.width" label="Width:" suffix="cm"
                              :rules=numberRules></v-text-field>
                          </v-flex>
                          <v-flex>
                            <v-text-field type="number" v-model="viewRender.yOffset" label="Y Offeset:" suffix="cm">
                            </v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-flex>

                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <YesNoModal ref="yesNo"></YesNoModal>
  </v-dialog>
</template>

<script>
  import EventBus from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js";
  import CustomEmitter from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js";
  import axios from 'axios';
  import {
    Compact
  } from 'vue-color'
  import YesNoModal from '@/components/Common/YesNoModal'


  function returnFloat(value) {
    return parseFloat(value == undefined || value == null || value == "" ? 0 : value);
  }

  export default {
    data() {
      return {
       
        floorplanFixture: null,
        numberRules: [
          v =>
          v > 0 || "number value must be at least 1"
        ],
        general: [true],
        RenderingPanel: [false],
        modalShow: false,
        newData: null,
        type: null,
        id: null,
        gondolaObj: null,
        pegs: [],
        viewRender: {
          width: 1,
          height: 1,
          depth: 1,
          yOffset: 0
        },
        floorplanShapes: [{
            text: "Square"
          },
          {
            text: "Circle"
          }
        ],
        renderImageDimensions: {},
        renderingselect: [{
          text: 'None',
          value: 'None'
        }],
        spreadProducts: [{
            text: 'Left to right',
            value: 'L2R'
          },
          {
            text: 'Right to left',
            value: 'R2L'
          },
          {
            text: 'Spread even',
            value: 'SE'
          },
          {
            text: 'Spread facings even',
            value: 'SFE'
          },
          {
            text: 'Place where dropped horizontal',
            value: 'PWD'
          },
          // {
          //   text: 'Place where dropped vertical',
          //   value: 'PWD'
          // },
          {
            text: 'Place where dropped vertical and horizontal',
            value: 'PWDXY'
          }
        ],
        types: [{
            text: 'Gondola',
            value: 0
          },
          {
            text: 'Obstruction',
            value: 11
          },
          {
            text: 'Fixture',
            value: 2
          },
          {
            text: 'Sub Fixture',
            value: 3
          },
          {
            text: 'Palette',
            value: 4
          },
        ],
        fixtureTypes: [{
            text: 'Base',
            value: 0
          },
          {
            text: 'Shelf',
            value: 1
          },
          {
            text: 'Pegboard',
            value: 2
          },
          {
            text: 'Pegbar',
            value: 3
          }
        ],
        subTypes: [{
            text: 'Peg',
            value: 0
          },
          {
            text: 'Basket',
            value: 1
          },
          {
            text: 'Divider',
            value: 2
          }
        ],
        renderingTypeShelf: [{
            text: 'Label',
            value: 0
          },
          {
            text: 'Grill',
            value: 1
          }
        ],
        fixtureLabelOrders: [{
          text: "Top to bottom",
          value: 0
        }, {
          text: "Bottom to top",
          value: 1
        }]
      };
    },
    components: {
      'compact-picker': Compact,
      YesNoModal
    },
    created() {
      EventBus.$on("MODAL_LOAD", this.open);
    },
    beforeDestroy() {
      EventBus.$off("MODAL_LOAD", this.open);
    },
    methods: {
      handleTransparency() {
        let self = this
        self.$nextTick(() => {
          if (self.newData.transparent == true) {
            self.newData.color = "transparent"
          } else {
            self.newData.color = {
              hex: "black"
            }
          }
        })
      },
      changeImageSelect() {
        var self = this
        console.log("testing none");



        self.$nextTick(() => {

          if (self.newData.renderImage == "None") {
            self.newData.RenderingsItems.Front.image = null
            self.$refs.changeRenderImage.src = null
            self.viewRender.yOffset = 0
            self.viewRender.height = 1
            self.viewRender.width = 1
            self.viewRender.depth = 0
            return
          }
          axios.get(process.env.VUE_APP_API + "/FixtureImage?db=cr-devinspire&id=" + self.newData.renderImage)
            .then(Response => {

              self.newData.renderings.forEach(element => {
                if (element.id == self.newData.renderImage) {
                  // console.log(element);

                  // self.newData.renderLabel.width = element.width
                  // self.newData.renderLabel.height = element.height
                  // self.newData.renderLabel.depth = element.depth
                  self.newData.RenderingsItems.Front.image = Response.data
                  self.viewRender.yOffset = element.yOffset

                  self.viewRender.height = element.height
                  self.viewRender.width = element.width
                  self.viewRender.depth = element.depth
                  console.log(self.viewRender);

                }
              })
              self.$refs.changeRenderImage.src = 'data:image/png;base64,' + Response.data;
            }).catch(e => {
              console.log("no image attatched to selection" + e);

            })
        })


        // GET api/FixtureImage?db={db}&id={id}
      },
      getFixtureTX(uid, callback) {
        let self = this
        axios.get(process.env.VUE_APP_API + `FloorPlan_Fixtures/GetFixtureByUID?UID=${uid}`)
          .then(Response => {
            self.floorplanFixture = Response.data
          })
      },
      open(eventData) {
        let self = this;
       
        self.getFixtureTX(eventData.id, fixturecb => {

        })

        if (eventData.type.toUpperCase() === "GONDOLA") {
          self.modalShow = true;

          self.newData = JSON.parse(JSON.stringify(eventData.data));
          console.log("eventData", eventData);
          self.newData.uploadSide = false 
          self.newData.uploadTop = false 

          console.log("openModal", self.newData);
          if (self.newData.RenderingsItems == undefined) {
            self.newData.RenderingsItems = {}
            self.newData.RenderingsItems.Front = {
              image: null,
              width: null,
              depth: null,
              height: null,
              yOffset: null,
            }
            self.viewRender.width = 1
            self.viewRender.height = 1
            self.viewRender.depth = 1
            self.viewRender.yOffset = 1


            //  self.$refs.changeRenderImage.src = '';
          }
          if (self.newData.renderings != undefined && self.newData.renderings != null) {
            self.newData.renderings.forEach(element => {
              if (element.type == 0) {
                self.renderingselect.push({
                  text: element.name,
                  value: element.id
                })
              }
            });
          }

          self.id = eventData.id;
          self.type = eventData.type;
          self.subType = eventData.subType;
          self.gondolaObj = eventData.object;


          self.newData.color = {
            hex: self.newData.color
          }

          self.newData.pegHoleColor = {
            hex: self.newData.color
          }

          self.$nextTick(() => {
            if (self.newData.image != undefined && self.newData.image != null)
              self.$refs.changeImage.src = 'data:image/png;base64,' + self.newData.image;
            else
              self.$refs.changeImage.src = '';
            console.log("[DEBUG]");
            if (self.newData.RenderingsItems.Front == null) {
              self.newData.RenderingsItems.Front = {
                image: null,
                width: null,
                depth: null,
                height: null,
                yOffset: null,
              }
            }
            if (self.newData.RenderingsItems.Front.image != undefined && self.newData.RenderingsItems.Front.image !=
              null)
              self.$refs.changeRenderImage.src = 'data:image/png;base64,' + self.newData.RenderingsItems.Front
              .image;


            else
              self.$refs.changeRenderImage.src = '';


            if (self.newData.barImage != undefined && self.newData.barImage != null)
              self.$refs.changeImageBar.src = 'data:image/png;base64,' + self.newData.barImage;
            else
              self.$refs.changeImageBar.src = '';
          })
        } else {
          self.destroy();
        }
      },
      submit() {
        let self = this;
        let event = new CustomEmitter();
        // let tmp = self.newData.color.hex;

        self.newData.color = self.newData.color.hex;
        self.newData.pegHoleColor = self.newData.pegHoleColor.hex;

        console.log("renderImage");
        self.newData.RenderingsItems.Front.height = returnFloat(self.viewRender.height)
        self.newData.RenderingsItems.Front.width = returnFloat(self.viewRender.width)
        self.newData.RenderingsItems.Front.depth = returnFloat(self.viewRender.depth)

        self.newData.RenderingsItems.Front.yOffset = self.viewRender.yOffset
        if (self.newData.RenderingsItems.Front.yOffset == null || self.newData.RenderingsItems.Front.yOffset ==
          undefined) {
          self.newData.RenderingsItems.Front.yOffset = 0
        }
        if (self.newData.renderImage == "None" || self.newData.renderImage == undefined) {
          self.newData.RenderingsItems.Front = null
        }
        self.newData.height = returnFloat(self.newData.height);
        self.newData.width = returnFloat(self.newData.width);
        self.newData.depth = returnFloat(self.newData.depth);
        self.newData.fixtureSpacing = returnFloat(self.newData.fixtureSpacing);
        self.newData.merchHeight = returnFloat(self.newData.merchHeight);
        self.newData.xHoleSpacing = returnFloat(self.newData.xHoleSpacing);
        self.newData.yHoleSpacing = returnFloat(self.newData.yHoleSpacing);
        self.newData.overhang = returnFloat(self.newData.overhang);
        self.newData.productOffset = returnFloat(self.newData.productOffset);

        var fixtureObj = {
          fixtureConfig: self.config,
          fixtureData: self.newData
        };

        event.modal_saved(EventBus, self.type, self.subType, self.newData, self.id, self.gondolaObj);
        self.destroy();
      },
      destroy() {
        let self = this;
        self.modalShow = false;
      },
      imgsrc(type) {
        let self = this
        if (self.floorplanFixture != null) {
          return process.env.VUE_APP_API + `FloorplanFixture?mapImageID=${self.floorplanFixture.id}&type=${type}`
        } else {
          return ''
        }

      },
      deleteGondola() {
        let self = this;
        self.$refs.yesNo.show('Delete this gondola?', goThrough => {
          if (goThrough) {
            let event = new CustomEmitter();
            event.delete_gondola(EventBus, self.newData, self.gondolaObj);
            self.destroy();

          }
        })

      },
      openSideFileExplorer() {
        let self = this;
        self.$refs.fileSideInput.value = null
        self.$refs.fileSideInput.click();
      },
      openTopFileExplorer() {
        let self = this;
        self.$refs.fileTopInput.value = null
        self.$refs.fileTopInput.click();
      },
      openFileExplorer() {
        let self = this;
        self.$refs.fileInput.value = null
        self.$refs.fileInput.click();
      },
      openFileExplorerRender() {
        let self = this;
        self.$refs.fileInputRender.value = null
        self.$refs.fileInputRender.click();
      },
      openFileExplorerBar() {
        let self = this;
        self.$refs.fileInputBar.value = null
        self.$refs.fileInputBar.click();
      },
      imageChangeRender(e) {
        let self = this;

        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          let splitUrl = url.split(',', 2);
          let imageString = splitUrl[1];

          self.$refs.changeRenderImage.src = url;
          self.newData.RenderingsItems.Front.image = imageString;
        })
      },
      imageChangeBar(e) {
        let self = this;

        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          let splitUrl = url.split(',', 2);
          let imageString = splitUrl[1];

          self.$refs.changeImageBar.src = url;
          self.newData.barImage = imageString;
        })
      },
      imageSideChange(e) {
        let self = this;
        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          let splitUrl = url.split(',', 2);
          let imageString = splitUrl[1];
          self.$refs.changeSideImage.src = url;
          self.newData.sideImage = file;
          self.newData.uploadSide = true
        })
      },
      imageTopChange(e) {
        let self = this;
        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          let splitUrl = url.split(',', 2);
          let imageString = splitUrl[1];
          self.$refs.changeTopImage.src = url;
          self.newData.topImage = file;
          self.newData.uploadTop = true
        })
      },
      imageChange(e) {
        let self = this;
        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          let splitUrl = url.split(',', 2);
          let imageString = splitUrl[1];
          self.$refs.changeImage.src = url;
          self.newData.image = imageString;
        })
      },
      blobToArrayBuffer(blob, callback) {
        var a = new FileReader();
        a.onload = function (e) {
          callback(a.result);
        }
        a.re(blob);
      },
      blobToDataUrl(blob, callback) {
        var a = new FileReader();
        a.onload = function (e) {
          callback(a.result);
        }
        a.readAsDataURL(blob);
      },
    }
  };
</script>

<style scoped>
</style>