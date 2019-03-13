<template>
  <v-dialog fullscreen persistent v-model="modalShow">
    <v-card dark v-if="newData != null">
      <v-toolbar>
        <v-toolbar-title>Edit Fixture Properties : {{newData.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="ma-0" @click="deleteFixture" dark color="error" flat fab>
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
                    <v-select disabled placeholder="please select" :items="fixtureLabelOrders" v-model="newData.fixtureLabelOrder"
                      label="Label order:">
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
                    <v-select disabled placeholder="please select" v-if="newData.rendering" :items="types" v-model="newData.type"
                      label="Type:">
                    </v-select>
                    <v-select disabled placeholder="please select" v-if="newData.type == 2" :items="fixtureTypes"
                      v-model="newData.fixtureType" label="Type:">
                    </v-select>
                    <v-select disabled placeholder="please select" v-if="newData.type == 3" :items="subTypes" v-model="newData.fixtureType"
                      label="Subtype:">
                    </v-select>
                    <v-select disabled placeholder="please select" v-if="newData.type == 2 && newData.fixtureType == 1 && newData.rendering"
                      :items="renderingTypeShelf" v-model="newData.renderingType" label="Subtype:">
                    </v-select>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering">
                    <v-select placeholder="please select" v-if="(newData.fixtureType == 2 || newData.fixtureType == 3) && newData.type == 2"
                      :items="pegs" v-model="newData.defaultPeg" label="Default peg:">
                    </v-select>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering">
                    <v-select placeholder="please select" :items="spreadProducts" v-model="newData.spreadProducts"
                      label="Spread products:">
                    </v-select>
                  </v-flex>

                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering && newData.type == 2 && newData.fixtureType != 2">
                    <v-checkbox hide-details label="Squish" v-model="newData.squish"></v-checkbox>
                  </v-flex>

                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering && newData.squish && newData.type == 2 && newData.fixtureType != 2">
                    <v-checkbox hide-details label="Auto Squish" v-model="newData.autoSquish"></v-checkbox>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering && newData.squish && !newData.autoSquish && newData.type == 2 && newData.fixtureType != 2">
                    <v-text-field hide-details v-if="!newData.rendering" v-model="newData.squishAmount" label="Squish Amount:"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering && newData.type == 2">
                    <v-checkbox hide-details label="Border" v-model="newData.border"></v-checkbox>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering && newData.type == 3 && newData.fixtureType == 1">
                    <v-checkbox hide-details label="Snap Left" v-model="newData.snapLeft"></v-checkbox>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering && newData.type == 3 && newData.fixtureType == 1">
                    <v-checkbox hide-details label="Snap Right" v-model="newData.snapRight"></v-checkbox>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering">
                    <v-checkbox hide-details label="Labels On" v-model="newData.labelsOn"></v-checkbox>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12>
                    <v-text-field type="number" label="Cost of Fixture" prefix="R" v-model="newData.cost"></v-text-field>
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
                  <v-flex lg8 md12 v-if="!newData.rendering && (newData.type == 2 && (newData.fixtureType == 0 || newData.fixtureType == 1))">
                    <v-text-field type="number" v-model="newData.overhang" label="Overhang:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="!newData.rendering && newData.fixtureType == 3">
                    <v-text-field type="number" v-model="newData.productOffset" label="Product offset:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="newData.fixtureType == 2 && !newData.rendering">
                    <v-text-field type="number" v-model="newData.xHoleSpacing" label="X hole spacing:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="newData.fixtureType == 2 && !newData.rendering">
                    <v-text-field type="number" v-model="newData.yHoleSpacing" label="Y hole spacing:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="newData.fixtureType == 2 && !newData.rendering">
                    <v-text-field type="number" v-model="newData.facingOffsetX" label="Facing Offset Horizontal:"
                      suffix="cm"></v-text-field>
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
                  <v-expansion-panel v-model="generalPanel" inset expand>
                    <v-expansion-panel-content class="elevation-0">
                      <div slot="header">General</div>
                      <v-flex lg12 md12 sm12 xs12>
                        <h3>Image</h3>
                        <v-card class="elevation-5" @click="openFileExplorer" style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                          <img ref="changeImage" style="max-height: 150px; max-width: 150px;" src="" alt="">
                        </v-card>
                        <input ref="fileInput" style="display: none" @change="imageChange" type="file">
                      </v-flex>
                      <!-- <v-flex lg12 md12 sm12 xs12> -->
                      <!-- <div v-show="newData.type == 2 && (newData.fixtureType == 0 || newData.fixtureType == 1) && !newData.rendering">
                          <h3>Bar image</h3>
                          <v-card class="elevation-5" @click="openFileExplorerBar" style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                            <img ref="changeImageBar" style="max-height: 150px; max-width: 150px;" src="" alt="">
                          </v-card>
                          <input ref="fileInputBar" style="display: none" @change="imageChangeBar" type="file">
                        </div> -->
                      <!-- </v-flex> -->
                      <v-flex lg12 md12 sm12 xs12>
                        <div v-if="!newData.rendering">
                          <h3>Colour</h3>
                          <compact-picker style="margin: 0 auto;" v-model="newData.color" />
                          <v-flex lg8 md12 sm12 xs12>
                            <v-checkbox hide-details label="Transparent" v-model="newData.transparent" @change="handleTransparency"></v-checkbox>
                          </v-flex>
                        </div>
                      </v-flex>
                      <v-flex lg12 md12 sm12 xs12>
                        <div v-if="newData.type == 2 && newData.fixtureType == 2 && !newData.rendering">
                          <h3>Peg Hole Colour</h3>
                          <compact-picker style="margin: 0 auto;" v-model="newData.pegHoleColor" />
                        </div>
                      </v-flex>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <!-- start of  render display settings -->
                  <v-expansion-panel v-model="renderingPanel" inset expand>
                    <v-expansion-panel-content class="elevation-0">
                      <div slot="header">Rendering Options</div>
                      <v-flex>
                        <hr>
                        <br>
                        <p>Front Face Renderings</p>
                        <v-divider></v-divider>
                        <v-expansion-panel inset expand v-model="renderingPanel2" v-if="newData.fixtureType==1&&newData.type==2||newData.fixtureType==3&&newData.type==2||newData.fixtureType==0&&newData.type==2">
                          <v-expansion-panel-content class="elevation-0 pa-0">
                            <div slot="header">Label Holder </div>
                            <v-select placeholder="please select" :items="labelType" v-model="newData.labelType" label="Label Holder Type:"
                              @change="changeLabelImage">
                            </v-select>
                            <v-card class="elevation-5" @click="openFileExplorerLabel" style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                              <img ref="changeImageLabel" style="max-height: 150px; max-width: 150px;" src="" alt="">
                            </v-card>
                            <input ref="fileInputLabel" style="display: none" @change="imageChangeLabel" type="file">
                            <v-layout>
                              <v-flex>
                                <v-text-field type="number" v-model="viewRenderLabel.height" label="Height:" suffix="cm"
                                  :rules=numberRules></v-text-field>
                              </v-flex>
                              <v-flex>
                                <v-text-field type="number" v-model="viewRenderLabel.width" label="Width:" suffix="cm"
                                  :rules=numberRules></v-text-field>
                              </v-flex>
                              <v-flex>
                                <v-text-field type="number" v-model="viewRenderLabel.yOffset" label="Y Offset:" suffix="cm"></v-text-field>
                              </v-flex>
                            </v-layout>

                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-flex>
                      <v-flex v-if="newData.fixtureType==1&&newData.type==2">
                        <v-expansion-panel expand v-model="renderingPanel3" inset>
                          <v-expansion-panel-content class="elevation-0 pa-0">
                            <div slot="header">Shelf Edge </div>
                            <v-select placeholder="please select" :items="ShelfEdgeType" v-model="newData.ShelfEdgeType"
                              label="Shelf Edge Rendering:" @change="changeShelfEdgeImage">
                            </v-select>
                            <v-card class="elevation-5" @click="openFileExplorerShelfEdge" style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                              <img ref="changeImageShelfEdge" style="max-height: 150px; max-width: 150px;" src="" alt="">
                            </v-card>
                            <input ref="fileInputShelfEdge" style="display: none" @change="imageChangeShelfEdge" type="file">
                            <v-layout>
                              <v-flex>
                                <v-text-field type="number" v-model="viewRenderShelfEdge.height" label="Height:" suffix="cm"
                                  :rules=numberRules></v-text-field>
                              </v-flex>


                              <v-flex>
                                <v-text-field type="number" v-model="viewRenderShelfEdge.width" label="Width:" suffix="cm"
                                  :rules=numberRules></v-text-field>

                              </v-flex>
                              <v-flex>
                                <v-text-field type="number" v-model="viewRenderShelfEdge.yOffset" label="Y Offset:"
                                  suffix="cm"></v-text-field>
                              </v-flex>
                            </v-layout>
                          </v-expansion-panel-content>
                        </v-expansion-panel>

                      </v-flex>
                      <v-flex>
                        <v-expansion-panel inset expand v-model="renderingPanel4" v-if="newData.fixtureType==1&&newData.type==3">
                          <v-expansion-panel-content class="elevation-0 pa-0">
                            <div slot="header"> Front rendering</div>
                            <v-flex>
                              <v-select placeholder="Render Image" :items="renderingselect" v-model="newData.renderImage"
                                label="Rendering:" @change="changeImageSelect">
                              </v-select>
                              <v-card class="elevation-5" @click="openFileExplorerRender" style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
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
                                  <v-text-field type="number" v-model="viewRender.yOffset" label="Y Offeset:" suffix="cm"></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-flex>

                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-flex>
                      <!-- data type for select box newData.fixtureType==1&&newData.type==3|| -->
                      <v-flex v-if="newData.fixtureType==1&&newData.type==2||newData.fixtureType==0&&newData.type==2">
                        <p>Back Face Renderings</p>
                        <v-divider></v-divider>
                        <v-expansion-panel inset expand v-model="BackFaceRenderingsPanel5">
                          <v-expansion-panel-content class="elevation-0 pa-0">
                            <div slot="header">Back Rendering </div>
                            <v-select placeholder="please select" :items="RenderBacks" v-model="newData.RenderingsItems.Backs"
                              label="Back Renderings:" @change="changeImageRenderBack">
                            </v-select>

                            <v-card class="elevation-5" @click="openFileExplorerRenderBack" style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                              <img ref="RenderBackImage" style="max-height: 150px; max-width: 150px;" src="" alt="">
                            </v-card>
                            <input ref="fileInputRenderBack" style="display: none" @change="imageChangeBack" type="file">
                            <v-layout>
                              <v-flex>
                                <v-text-field type="number" v-model="RenderBackModel.height" label="Height:" suffix="cm"
                                  :rules=numberRules></v-text-field>
                              </v-flex>

                              <v-flex>
                                <v-text-field type="number" v-model="RenderBackModel.width" label="Width:" suffix="cm"
                                  :rules=numberRules></v-text-field>
                              </v-flex>
                              <v-flex>
                                <v-text-field type="number" v-model="RenderBackModel.yOffset" label="Y Offset:" suffix="cm"></v-text-field>
                              </v-flex>
                            </v-layout>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
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
        numberRules: [
          v =>
          v > 0 || "number value must be at least 1"
        ],

        generalPanel: [true],
        renderingPanel: [false],
        renderingPanel2: [false],
        renderingPanel3: [false],
        renderingPanel4: [false],
        renderingPanel5: [false],
        modalShow: false,
        newData: null,
        viewRender: {
          width: 1,
          height: 1,
          depth: 1,
          yOffset: 0
        },
        viewRenderLabel: {
          height: 1,
          width: 1,
          depth: 1,
          yOffset: 0
        },
        RenderBackModel: {
          height: 1,
          width: 1,
          depth: 1,
          yOffset: 0
        },
        viewRenderShelfEdge: {
          height: 1,
          width: 1,
          depth: 1,
          yOffset: 0
        },
        config: null,
        type: null,
        subType: null,
        id: null,
        fixtureObj: null,
        ShelfEdgeType: [{
          text: 'None',
          value: 'None'
        }],
        labelType: [{
          text: 'None',
          value: 'None'
        }],
        RenderBacks: [{
          text: 'None',
          value: 'None'
        }],
        renderingselect: [{
          text: 'None',
          value: 'None'
        }],
        pegs: [],
        tmpPegs: [],
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
            text: 'Place where dropped',
            value: 'PWD'
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
            value: 1
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
            text: 'ShelfEdge',
            value: 1
          },
          {
            text: 'Back',
            value: 2
          }
        ],
      }
    },
    components: {
      'compact-picker': Compact,
      YesNoModal
    },
    created() {
      let self = this;

      EventBus.$on("MODAL_LOAD", this.open);

      axios.get(process.env.VUE_APP_API + "Fixture?db=CR-Devinspire&type=3&subType=0")
        .then(r => {
          let pegs = r.data;
          self.pegs = [];
          self.tmpPegs = r.data;

          if (pegs != undefined) {
            for (let index = 0; index < pegs.length; index++) {
              const element = pegs[index];
              self.pegs.push({
                text: element.name,
                value: element.id
              })
            }
          }
        })
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

                }
              })
              self.$refs.changeRenderImage.src = 'data:image/png;base64,' + Response.data;
            }).catch(e => {
              console.log("no image attatched to selection" + e);

            })
        })


        // GET api/FixtureImage?db={db}&id={id}
      },
      changeLabelImage() {
        var self = this
        self.$nextTick(() => {
          if (self.newData.labelType == "None") {
            self.newData.RenderingsItems.LabelHolder.image = null
            self.$refs.changeImageLabel.src = null
            self.viewRenderLabel.yOffset = 0

            self.viewRenderLabel.height = 1
            self.viewRenderLabel.width = 1
            self.viewRenderLabel.depth = 0
            return
          }
          axios.get(process.env.VUE_APP_API + "/FixtureImage?db=cr-devinspire&id=" + self.newData.labelType)
            .then(Response => {


              self.newData.renderings.forEach(element => {



                if (element.id == self.newData.labelType) {
                  // self.newData.RenderingsItems.LabelHolder.width = element.width
                  // self.newData.RenderingsItems.LabelHolder.height = element.height
                  // self.newData.RenderingsItems.LabelHolder.depth = element.depth
                  self.newData.RenderingsItems.LabelHolder.image = Response.data
                  self.viewRenderLabel.yOffset = element.yOffset
                  self.viewRenderLabel.height = element.height
                  self.viewRenderLabel.width = element.width
                  self.viewRenderLabel.depth = element.depth
                }
              })
              self.$refs.changeImageLabel.src = 'data:image/png;base64,' + Response.data;
            }).catch(e => {
              console.log("no image attatched to selection" + e);

            })
        })

        // GET api/FixtureImage?db={db}&id={id}
      },
      changeShelfEdgeImage() {
        var self = this
        self.$nextTick(() => {
          if (self.newData.ShelfEdgeType == "None") {
            self.newData.RenderingsItems.ShelfEdge.image = null
            self.$refs.changeImageShelfEdge.src = null

            self.viewRenderShelfEdge.yOffset = 0

            self.viewRenderShelfEdge.height = 1
            self.viewRenderShelfEdge.width = 1
            self.viewRenderShelfEdge.depth = 0
            return
          }
          axios.get(process.env.VUE_APP_API + "/FixtureImage?db=cr-devinspire&id=" + self.newData.ShelfEdgeType)
            .then(Response => {

              if (self.newData.renderings != undefined && self.newData.renderings != null) {
                self.newData.renderings.forEach(element => {
                  if (element.id == self.newData.ShelfEdgeType) {
                    // self.newData.RenderingsItems.LabelHolder.width = element.width
                    // self.newData.RenderingsItems.LabelHolder.height = element.height
                    // self.newData.RenderingsItems.LabelHolder.depth = element.depth
                    self.newData.RenderingsItems.ShelfEdge.image = Response.data
                    self.viewRenderShelfEdge.yOffset = element.yOffset

                    self.viewRenderShelfEdge.height = element.height
                    self.viewRenderShelfEdge.width = element.width
                    self.viewRenderShelfEdge.depth = element.depth
                  }
                })
              }
              self.$refs.changeImageShelfEdge.src = 'data:image/png;base64,' + Response.data;
            }).catch(e => {
              console.log("no image attatched to selection" + e);

            })
        })

      },
      changeImageRenderBack() {
        var self = this
        self.$nextTick(() => {
          if (self.newData.RenderingsItems.Backs == "None") {
            self.newData.RenderingsItems.Back.image = null
            self.$refs.RenderBackImage.src = null

            self.RenderBackModel.yOffset = 0

            self.RenderBackModel.height = 1
            self.RenderBackModel.width = 1
            self.RenderBackModel.depth = 0
            return
          }
          axios.get(process.env.VUE_APP_API + "/FixtureImage?db=cr-devinspire&id=" + self.newData.RenderingsItems
              .Backs)
            .then(Response => {

              if (self.newData.renderings != undefined && self.newData.renderings != null) {
                self.newData.renderings.forEach(element => {
                  if (element.id == self.newData.RenderingsItems.Backs) {
                    // self.newData.RenderingsItems.LabelHolder.width = element.width
                    // self.newData.RenderingsItems.LabelHolder.height = element.height
                    // self.newData.RenderingsItems.LabelHolder.depth = element.depth

                    self.newData.RenderingsItems.Back.image = Response.data
                    self.RenderBackModel.yOffset = element.yOffset

                    self.RenderBackModel.height = element.height
                    self.RenderBackModel.width = element.width
                    self.RenderBackModel.depth = element.depth
                  }
                })
              }
              self.$refs.RenderBackImage.src = 'data:image/png;base64,' + Response.data;
            }).catch(e => {
              console.log("no image attatched to selection" + e);

            })
        })

      },
      open(eventData) {
        let self = this;
        self.ShelfEdgeType = [{
          text: 'None',
          value: 'None'
        }]
        self.labelType = [{
            text: 'None',
            value: 'None'
          }],
          self.RenderBacks = [{
            text: 'None',
            value: 'None'
          }],
          self.renderingselect = [{
            text: 'None',
            value: 'None'
          }]
        self.generalPanel = [true]
        self.renderingPanel = [false]
        self.renderingPanel2 = [false]
        self.renderingPanel3 = [false]
        self.renderingPanel4 = [false]
        self.BackFaceRenderingsPanel5 = [false]

        if (eventData.type.toUpperCase() === "FIXTURE") {
          self.newData = {}
          self.modalShow = true;

          self.newData = JSON.parse(JSON.stringify(eventData.data.Data));
          console.log("[new data]");

          console.log(self.newData);

          self.newData.labelsOn = self.newData.labelsOn == undefined || self.newData.labelsOn == null ? true : self.newData.labelsOn;

          if (self.newData.RenderingsItems == undefined) {
            self.newData.RenderingsItems = {}
            self.viewRenderLabel = {
              height: 1,
              width: 1,
              depth: 1,
              yOffset: 0
            }
            self.RenderBackModel = {
              height: 1,
              width: 1,
              depth: 1,
              yOffset: 0
            }
            self.viewRenderShelfEdge = {
              height: 1,
              width: 1,
              depth: 1,
              yOffset: 0
            }
            self.newData.RenderingsItems.Front = {
              image: null,
              width: 1,
              depth: null,
              height: 1,
              yOffset: null,
            }

            self.newData.RenderingsItems.LabelHolder = {
              image: null,
              width: 1,
              depth: null,
              height: 1,
              yOffset: null,
            }
            self.newData.RenderingsItems.ShelfEdge = {
              image: null,
              width: 1,
              depth: null,
              height: 1,
              yOffset: null,
            }
            self.newData.RenderingsItems.Back = {
              image: null,
              width: 1,
              depth: null,
              height: 1,
              yOffset: null,
            }
          }
          if (self.newData.RenderingsItems.Front == undefined) {
            self.newData.RenderingsItems.Front = {}
          } else {
            self.viewRender.width = self.newData.RenderingsItems.Front.width,
              self.viewRender.height = self.newData.RenderingsItems.Front.height,
              self.viewRender.depth = self.newData.RenderingsItems.Front.depth,
              self.viewRender.yOffset = self.newData.RenderingsItems.Front.yOffset
          }

          if (self.newData.RenderingsItems.LabelHolder == undefined) {
            self.newData.RenderingsItems.LabelHolder = {}
          } else {
            self.viewRenderLabel.width = self.newData.RenderingsItems.LabelHolder.width,
              self.viewRenderLabel.height = self.newData.RenderingsItems.LabelHolder.height,
              self.viewRenderLabel.depth = self.newData.RenderingsItems.LabelHolder.depth,
              self.viewRenderLabel.yOffset = self.newData.RenderingsItems.LabelHolder.yOffset
          }
          if (self.newData.RenderingsItems.ShelfEdge == undefined) {
            self.newData.RenderingsItems.ShelfEdge = {}
          } else {
            self.viewRenderShelfEdge.width = self.newData.RenderingsItems.ShelfEdge.width,
              self.viewRenderShelfEdge.height = self.newData.RenderingsItems.ShelfEdge.height,
              self.viewRenderShelfEdge.depth = self.newData.RenderingsItems.ShelfEdge.depth,
              self.viewRenderShelfEdge.yOffset = self.newData.RenderingsItems.ShelfEdge.yOffset

          }
          if (self.newData.RenderingsItems.Back == undefined) {
            self.newData.RenderingsItems.Back = {}
          } else {
            self.RenderBackModel.width = self.newData.RenderingsItems.Back.width,
              self.RenderBackModel.height = self.newData.RenderingsItems.Back.height,
              self.RenderBackModel.depth = self.newData.RenderingsItems.Back.depth,
              self.RenderBackModel.yOffset = self.newData.RenderingsItems.Back.yOffset

          }


          self.config = eventData.data.Config;
          self.id = eventData.id;
          self.type = eventData.type;
          self.subType = eventData.subType;
          self.fixtureObj = eventData.object;

          if (self.newData.renderings != null || self.newData.renderings != undefined) {

            self.newData.renderings.forEach(element => {
              if (element.renderingType == 3) {
                self.renderingselect.push({
                  text: element.name,
                  value: element.id
                })
              }
              if (element.renderingType == 1) {
                self.ShelfEdgeType.push({
                  text: element.name,
                  value: element.id
                })
              }
              if (element.renderingType == 0) {
                self.labelType.push({
                  text: element.name,
                  value: element.id
                })
              }
              if (element.renderingType == 2) {
                self.RenderBacks.push({
                  text: element.name,
                  value: element.id
                })
              }
            })
          }

          // self.newData.countsAs = {};
          // self.newData.countsAs.description = self.newData.name
          // self.newData.countsAs.value = 1
          self.newData.color = {
            hex: self.newData.color
          }
          self.newData.pegHoleColor = {
            hex: self.newData.color
          }
          self.$nextTick(() => {
            if (self.newData.fixtureType == 1 && self.newData.type == 3) {
              if (self.newData.RenderingsItems.Front.image != undefined && self.newData.RenderingsItems.Front.image !=
                null)
                self.$refs.changeRenderImage.src = 'data:image/png;base64,' + self.newData.RenderingsItems.Front.image;
              else
                self.$refs.changeRenderImage.src = '';
            }

            if (self.newData.image != undefined && self.newData.image != null)
              self.$refs.changeImage.src = 'data:image/png;base64,' + self.newData.image;
            else
              self.$refs.changeImage.src = '';

            // if (self.newData.barImage != undefined && self.newData.barImage != null)
            //   self.$refs.changeImageBar.src = 'data:image/png;base64,' + self.newData.barImage;
            // else

            //   self.$refs.changeImageBar.src = '';
            if (self.newData.fixtureType == 1 && self.newData.type == 2 || self.newData.fixtureType == 3 && self.newData
              .type == 2 ||
              self.newData.fixtureType == 0 && self.newData.type == 2) {
              if (self.newData.RenderingsItems.LabelHolder.image != undefined && self.newData.RenderingsItems.LabelHolder
                .image != null)
                self.$refs.changeImageLabel.src = 'data:image/png;base64,' + self.newData.RenderingsItems.LabelHolder
                .image;
              else

                self.$refs.changeImageLabel.src = '';
            }

            if (self.newData.fixtureType == 1 && self.newData.type == 2) {
              if (self.newData.RenderingsItems.ShelfEdge.image != undefined && self.newData.RenderingsItems.ShelfEdge
                .image != null)
                self.$refs.changeImageShelfEdge.src = 'data:image/png;base64,' + self.newData.RenderingsItems.ShelfEdge
                .image;
              else

                self.$refs.changeImageShelfEdge.src = '';
            }

            if (self.newData.fixtureType == 1 && self.newData.type == 3 || self.newData.fixtureType == 1 && self.newData
              .type == 2 ||
              self.newData.fixtureType == 0 && self.newData.type == 2) {
              if (self.newData.RenderingsItems.Back.image != undefined && self.newData.RenderingsItems.Back.image !=
                null)
                self.$refs.RenderBackImage.src = 'data:image/png;base64,' + self.newData.RenderingsItems.Back.image;
              else
                self.$refs.RenderBackImage.src = '';
            }

          })
        } else {
          self.destroy();
        }

      },
      submit() {
        let self = this;
        let event = new CustomEmitter();

        self.newData.color = self.newData.color.hex;
        self.newData.pegHoleColor = self.newData.pegHoleColor.hex;

        self.newData.RenderingsItems.ShelfEdge.height = returnFloat(self.viewRenderShelfEdge.height)
        self.newData.RenderingsItems.ShelfEdge.width = returnFloat(self.viewRenderShelfEdge.width)
        self.newData.RenderingsItems.ShelfEdge.yOffset = returnFloat(self.viewRenderShelfEdge.yOffset)

        self.newData.RenderingsItems.LabelHolder.height = returnFloat(self.viewRenderLabel.height)
        self.newData.RenderingsItems.LabelHolder.width = returnFloat(self.viewRenderLabel.width)
        self.newData.RenderingsItems.LabelHolder.yOffset = returnFloat(self.viewRenderLabel.yOffset)

        self.newData.RenderingsItems.Back.height = returnFloat(self.RenderBackModel.height)
        self.newData.RenderingsItems.Back.width = returnFloat(self.RenderBackModel.width)
        self.newData.RenderingsItems.Back.yOffset = returnFloat(self.RenderBackModel.yOffset)

        self.newData.RenderingsItems.Front.height = returnFloat(self.viewRender.height)
        self.newData.RenderingsItems.Front.width = returnFloat(self.viewRender.width)
        self.newData.RenderingsItems.Front.depth = returnFloat(self.viewRender.depth)

        self.newData.RenderingsItems.Front.yOffset = self.viewRender.yOffset
        if (self.newData.renderImage == "None" || self.newData.renderImage == undefined) {
          self.newData.RenderingsItems.Front = null
        }
        if (self.newData.labelType == "None" || self.newData.labelType == undefined) {
          self.newData.RenderingsItems.LabelHolder = null
        }
        if (self.newData.ShelfEdgeType == "None" || self.newData.ShelfEdgeType == undefined) {
          self.newData.RenderingsItems.ShelfEdge = null
        }
        if (self.newData.RenderingsItems.Backs == "None" || self.newData.RenderingsItems.Backs == undefined) {
          self.newData.RenderingsItems.Back = null
        }
        if (self.newData.fixtureType == 2 || self.newData.fixtureType == 3) {
          if (self.tmpPegs != null && self.tmpPegs.length > 0) {
            self.tmpPegs.forEach(element => {
              if (element.id == self.newData.defaultPeg) {
                self.newData.defaultPegDetails = element;
              }
            });
          }
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
        self.newData.squishAmount = returnFloat(self.newData.squishAmount);
        self.newData.facingOffsetX = returnFloat(self.newData.facingOffsetX);

        var fixtureObj = {
          fixtureConfig: self.config,
          fixtureData: self.newData
        };

        event.modal_saved(EventBus, self.type, self.subType, self.newData, self.id, self.fixtureObj);

        self.destroy();
      },
      deleteFixture() {

        let self = this;
        self.$refs.yesNo.show('Delete this Fixture?', goThrough => {
          if (goThrough) {
            let event = new CustomEmitter();
            event.delete_fixture(EventBus, self.newData, self.fixtureObj);
            self.destroy();
          }
        })


      },
      destroy() {
        let self = this;
        self.modalShow = false;
        // self.newData = null;
        // self.id = null;
        // self.type = null;
      },
      openFileExplorer() {
        let self = this;
        self.$refs.fileInput.value = null
        self.$refs.fileInput.click();
      },
      openFileExplorerBar() {
        let self = this;
        self.$refs.fileInputBar.value = null
        self.$refs.fileInputBar.click();
      },
      openFileExplorerShelfEdge() {
        let self = this;
        self.$refs.fileInputShelfEdge.value = null
        self.$refs.fileInputShelfEdge.click();
      },
      openFileExplorerRender() {
        let self = this;
        self.$refs.fileInputRender.value = null
        self.$refs.fileInputRender.click();
      },
      openFileExplorerRenderBack() {
        let self = this;
        self.$refs.fileInputRenderBack.value = null
        self.$refs.fileInputRenderBack.click();
      },
      openFileExplorerLabel() {
        let self = this;
        self.$refs.fileInputLabel.value = null
        self.$refs.fileInputLabel.click();
      },
      imageChangeLabel(e) {
        let self = this;

        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          let splitUrl = url.split(',', 2);
          let imageString = splitUrl[1];

          self.$refs.changeImageLabel.src = url;
          self.newData.RenderingsItems.LabelHolder.image = imageString;
        })
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
      imageChangeShelfEdge(e) {
        let self = this;

        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          let splitUrl = url.split(',', 2);
          let imageString = splitUrl[1];

          self.$refs.changeImageShelfEdge.src = url;
          self.newData.RenderingsItems.ShelfEdge.image = imageString;
        })
      },
      imageChangeBack(e) {
        let self = this;

        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          let splitUrl = url.split(',', 2);
          let imageString = splitUrl[1];

          self.$refs.RenderBackImage.src = url;
          self.newData.RenderingsItems.Back.image = imageString;
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
  }

</script>

<style scoped>
</style>
