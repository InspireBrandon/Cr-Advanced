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
                  <v-flex lg8 md12
                    v-if="!newData.rendering && (( newData.type == 2 && newData.fixtureType == 1 || newData.type == 3 && newData.fixtureType == 4))">
                    <v-text-field type="number" v-model="newData.x_Offset" label="X Offset:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12>
                    <v-text-field type="number" v-model="newData.y_Offset" label="Y Offset:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="!newData.rendering||newData.type == 2">
                    <v-select v-model="newData.floorplanShape" :items="floorplanShapes" label="Floorplan Shape:">
                    </v-select>
                  </v-flex>
                </v-layout>
                <!-- <v-layout>
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
                </v-layout> -->
              </v-container>
            </v-card>
          </v-flex>
          <v-flex lg4 md12>
            <v-card class="elevation-5">
              <v-toolbar dense>
                <v-toolbar-title class="toolbar-title">Display</v-toolbar-title>
              </v-toolbar>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex md4 class="px-3">
                    <!-- <div>Front</div> -->
                    <span>
                      <span style="padding-right: 45px;">{{ frontBack }}</span>
                      <span class="ml-2">
                        <a>
                          <v-icon size="18" @click="mirrorSides(frontBack)"> = </v-icon>
                        </a>
                      </span>
                      <span class="ml-2">
                        <a v-if="frontBack=='Front'" href="#"
                          @click.prevent="handleMirror(frontBack,newData.frontMirrored)"
                          :style="{ 'background': newData.frontMirrored ? 'white': 'transparent' }">m</a>

                        <a v-else href="#" @click.prevent="handleMirror(frontBack, newData.backMirrored)"
                          :style="{ 'background':  newData.backMirrored ? 'white': 'transparent' }">m</a>
                      </span>
                      <span class="ml-2">
                        <v-icon size="18" @click="changeDisplay(frontBack)">swap_horiz</v-icon>
                      </span>
                    </span>
                    <img v-if="!hideImages" ref="frontImage" style="width: 100%; max-height: 120px;"
                      :src="getFixtureImageNew(frontBack == 'Front' ? newData.frontImageID : newData.backImageID)" alt
                      @click="openFileDialog(frontBack.toLowerCase())" />
                    <a href="#" @click.prevent="openFileDialog(frontBack.toLowerCase())">Change</a>
                    <span class="mr-2"></span>
                    <a href="#" v-if="frontBack == 'Front'" @click.prevent="newData.frontImageID = null">Remove</a>
                    <a href="#" v-else @click.prevent="newData.backImageID = null">Remove</a>
                  </v-flex>
                  <v-flex md4 class="px-3">
                    <span>
                      <span style="padding-right: 45px;">{{ leftRight }}</span>
                      <span class="ml-2">
                        <a>
                          <v-icon size="18" @click="mirrorSides(leftRight)"> = </v-icon>
                        </a>
                      </span>
                      <span class="ml-2">
                        <a v-if="leftRight=='Left'" href="#"
                          @click.prevent="handleMirror(leftRight,newData.leftMirrored)"
                          :style="{ 'background': newData.leftMirrored ? 'white': 'transparent' }">m</a>

                        <a v-else href="#" @click.prevent="handleMirror(leftRight,newData.rightMirrored)"
                          :style="{ 'background':  newData.rightMirrored ? 'white': 'transparent' }">m</a>
                      </span>
                      <span class="ml-2">
                        <v-icon size="18" @click="changeDisplay(leftRight)">swap_horiz</v-icon>
                      </span>
                    </span>
                    <img v-if="!hideImages" ref="sideImage" style="width: 100%; max-height: 120px;"
                      :src="getFixtureImageNew(leftRight == 'Left' ? newData.leftImageID : newData.rightImageID)" alt
                      @click="openFileDialog(leftRight.toLowerCase())" />
                    <a href="#" @click.prevent="openFileDialog(leftRight.toLowerCase())">Change</a>
                    <span class="mr-2"></span>
                    <a href="#" v-if="leftRight == 'Left' " @click.prevent="newData.leftImageID = null">Remove</a>
                    <a href="#" v-else @click.prevent="newData.rightImageID = null">Remove</a>

                  </v-flex>
                  <v-flex md4 class="px-3">
                    <!-- <div>Top</div> -->
                    <span>
                      <span style="padding-right: 35px;">{{ topBottom }}</span>
                      <span class="ml-2">
                        <a>
                          <v-icon size="18" @click="mirrorSides(topBottom)"> = </v-icon>
                        </a>
                      </span>

                      <span class="ml-2">
                        <a v-if="topBottom=='Top'" href="#" @click.prevent="handleMirror(topBottom,newData.topMirrored)"
                          :style="{ 'background':  newData.topMirrored ? 'white': 'transparent' }">m</a>
                        <a v-else href="#" @click.prevent="handleMirror(topBottom,newData.bottomMirrored)"
                          :style="{ 'background':  newData.bottomMirrored ? 'white': 'transparent' }">m</a>
                      </span>
                      <span class="ml-2">
                        <v-icon size="18" @click="changeDisplay(topBottom)">swap_horiz</v-icon>
                      </span>
                    </span>
                    <!-- {{ form.topImageID }}
                    {{ form.bottomImageID }} -->
                    <img v-if="!hideImages" ref="topImage" style="width: 100%; max-height: 120px;"
                      :src="getFixtureImageNew(topBottom == 'Top' ? newData.topImageID : newData.bottomImageID)" alt
                      @click="openFileDialog(topBottom.toLowerCase())" />
                    <a href="#" @click.prevent="openFileDialog(topBottom.toLowerCase())">Change</a>
                    <span class="mr-2"></span>
                    <a href="#" v-if="topBottom == 'Top'" @click.prevent="newData.topImageID = null">Remove</a>
                    <a href="#" v-else @click.prevent="newData.bottomImageID = null">Remove</a>

                  </v-flex>
                  <input ref="imageInput" style="display: none" @change="changeImage" type="file" />
                  <!-- <v-flex lg12 md12 sm12 xs12 class="px-3">
                    <div>Old Image</div>
                    <img ref="changeImage" @click="openFileExplorer"
                      style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;" src=""
                      alt="">
                    <input ref="fileInput" style="display: none" @change="imageChange" type="file">
                  </v-flex>-->
                  <!-- <v-flex lg12 md12 sm12 xs12>
                    <div v-show="form.type == 2 && (form.fixtureType == 0 || form.fixtureType == 1) && !form.rendering">
                      <h3>Bar image</h3>
                      <img @click="openFileExplorerBar"
                        style="width: 150px; height: 150px; background: white; cursor: pointer;" ref="changeImageBar"
                        src="" alt="">
                      <input ref="fileInputBar" style="display: none" @change="imageChangeBar" type="file">
                    </div>
                  </v-flex>-->
                  <v-flex md4 class="px-3">
                    <div v-if="!newData.rendering">
                      <div>Colour</div>
                      <compact-picker v-if="frontBack == 'Front'" style="width: 100%" v-model="newData.frontColor" />
                      <compact-picker v-if="frontBack == 'Back'" style="width: 100%" v-model="newData.backColor" />
                    </div>
                  </v-flex>
                  <v-flex md4 class="px-3">
                    <div v-if="!newData.rendering">
                      <div>Colour</div>
                      <compact-picker v-if="leftRight == 'Left'" style="width: 100%" v-model="newData.leftColor" />
                      <compact-picker v-if="leftRight == 'Right'" style="width: 100%" v-model="newData.rightColor" />
                    </div>
                  </v-flex>
                  <v-flex md4 class="px-3">
                    <div v-if="!newData.rendering">
                      <div>Colour</div>
                      <compact-picker v-if="topBottom == 'Top'" style="width: 100%" v-model="newData.topColor" />
                      <compact-picker v-if="topBottom == 'Bottom'" style="width: 100%" v-model="newData.bottomColor" />
                    </div>
                  </v-flex>
                  <!-- <v-flex lg12 md12 sm12 xs12 class="px-3">
                    <div v-if="form.type == 2 && form.fixtureType == 2 && !form.rendering">
                      <h3>Peg Hole Colour</h3>
                      <compact-picker v-model="form.pegHoleColor" />
                    </div>
                  </v-flex>-->
                  <v-flex md4 class="px-3">
                    <v-checkbox @change="transparentChange('Front')" v-if="frontBack == 'Front'"
                      v-model="newData.frontTransparent" label="Transparent"></v-checkbox>
                    <v-checkbox @change="transparentChange('Back')" v-if="frontBack == 'Back'"
                      v-model="newData.backTransparent" label="Transparent"></v-checkbox>
                  </v-flex>
                  <v-flex md4 class="px-3">
                    <v-checkbox @change="transparentChange('Left')" v-if="leftRight == 'Left'"
                      v-model="newData.leftTransparent" label="Transparent"></v-checkbox>
                    <v-checkbox @change="transparentChange('Right')" v-if="leftRight == 'Right'"
                      v-model="newData.rightTransparent" label="Transparent"></v-checkbox>
                  </v-flex>
                  <v-flex md4 class="px-3">
                    <v-checkbox @change="transparentChange('Top')" v-if="topBottom == 'Top'"
                      v-model="newData.topTransparent" label="Transparent"></v-checkbox>
                    <v-checkbox @change="transparentChange('Bottom')" v-if="topBottom == 'Bottom'"
                      v-model="newData.bottomTransparent" label="Transparent"></v-checkbox>
                  </v-flex>
                  <v-flex v-if="!newData.rendering" lg12 md12 sm12 xs12 class="px-3">
                    <h3>Renderings</h3>
                  </v-flex>
                  <v-flex v-if="!newData.rendering &&renderingType0.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select placeholder="please select" :items="renderingType0" v-model="selectedRenderingType0" label="Label Holder:"></v-select>
                      <v-text-field label="Y Offset"></v-text-field>
                  </v-flex>
                  <v-flex v-if="!newData.rendering &&renderingType1.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select placeholder="please select" :items="renderingType1" v-model="selectedRenderingType1"
                      label="Shelf Edge:"></v-select>
                  </v-flex>
                  <v-flex v-if="!newData.rendering &&renderingType2.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select placeholder="please select" :items="renderingType2" v-model="selectedRenderingType2"
                      label="Back Face:"></v-select>
                  </v-flex>
                  <v-flex v-if="!newData.rendering &&renderingType3.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select placeholder="please select" :items="renderingType3" v-model="selectedRenderingType3"
                      label="Front Face:"></v-select>
                  </v-flex>
                  <v-flex v-if="!newData.rendering &&renderingType4.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select placeholder="please select" :items="renderingType4" v-model="selectedRenderingType4"
                      label="Side Face:"></v-select>
                  </v-flex>
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
        frontBack: "Front",
        frontBackMirror: false,
        leftRight: "Left",
        leftRightMirror: true,
        topBottom: "Top",
        topBottomMirror: true,
        renderingType0: [],
        selectedRenderingType0: null,
        renderingType1: [],
        selectedRenderingType1: null,
        renderingType2: [],
        selectedRenderingType2: null,
        renderingType3: [],
        selectedRenderingType3: null,
        renderingType4: [],
        selectedRenderingType4: null,
        hideImages: false,
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
        }],
        renderings: [],
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
      getRenderingTypes() {
        let self = this;
        axios
          .get(
            process.env.VUE_APP_API +
            `Renderings?db=CR-Devinspire&type=${self.newData.type}&subType=${self.newData.fixtureType}`
          )
          .then(r => {
            console.log("getRenderingTypes", r.data);
            self.renderingType0 = [{
              text: "none",
              value: -1
            }];
            self.renderingType1 = [{
              text: "none",
              value: -1
            }];
            self.renderingType2 = [{
              text: "none",
              value: -1
            }];
            self.renderingType3 = [{
              text: "none",
              value: -1
            }];
            self.renderingType4 = [{
              text: "none",
              value: -1
            }];
            r.data.forEach(rendering => {
              switch (rendering.renderingType) {
                case 0: {
                  self.renderingType0.push({
                    text: rendering.name,
                    value: rendering.id
                  });
                }
                break;
              case 1: {
                self.renderingType1.push({
                  text: rendering.name,
                  value: rendering.id
                });
              }
              break;
              case 2: {
                self.renderingType2.push({
                  text: rendering.name,
                  value: rendering.id
                });
              }
              break;
              case 3: {
                self.renderingType3.push({
                  text: rendering.name,
                  value: rendering.id
                });
              }
              break;

              case 4: {
                self.renderingType4.push({
                  text: rendering.name,
                  value: rendering.id
                });
              }
              break;

              default:
                break;
              }
            });
          })
          .catch(e => {
            console.log(e);
          });
      },
      getSelectedRenderings() {
        let self = this;
        axios
          .get(
            process.env.VUE_APP_API +
            `FixtureRenderingLink?db=CR-Devinspire&Fixture_ID=${self.newData.id}`
          )
          .then(r => {
            // self.newData.image = r.data;
            r.data.forEach(item => {
              switch (item.renderingType) {
                case 0: {
                  self.selectedRenderingType0 = item.id;
                }
                break;
              case 1: {
                self.selectedRenderingType1 = item.id;
              }
              break;
              case 2: {
                self.selectedRenderingType2 = item.id;
              }
              break;
              case 3: {
                self.selectedRenderingType3 = item.id;
              }
              break;
              case 4: {
                self.selectedRenderingType4 = item.id;
              }
              break;
              default:
                break;
              }
            });
          })
          .catch(e => {
            console.log(e);
          });
      },
      mirrorSides(side) {
        let self = this

        let stringEnd = ""
        switch (side) {
          case "Right":
            stringEnd = "Left"
            break;
          case "Left":
            stringEnd = "Right"
            break;
          case "Top":
            stringEnd = "Bottom"
            break;
          case "Bottom":
            stringEnd = "Top"
            break;
          case "Back":
            stringEnd = "Front"
            break;
          case "Front":
            stringEnd = "Back"
            break;
          default:
            break;
        }
        self.$refs.YesNoModal.show("do you want to copy this image to the " + stringEnd, value => {
          if (value) {
            switch (side) {
              case "Right":
                self.newData.leftImageID = self.newData.rightImageID
                self.newData.leftTransparent = self.newData.rightTransparent
                self.newData.leftColor = self.newData.rightColor
                break;

              case "Left":
                self.newData.rightImageID = self.newData.leftImageID
                self.newData.rightTransparent = self.newData.leftTransparent
                self.newData.rightColor = self.newData.leftColor
                break;

              case "Top":
                self.newData.bottomImageID = self.newData.topImageID
                self.newData.bottomTransparent = self.newData.topTransparent
                self.newData.bottomColor = self.newData.topColor
                break;

              case "Bottom":
                self.newData.topImageID = self.newData.bottomImageID
                self.newData.topTransparent = self.newData.bottomTransparent
                self.newData.topColor = self.newData.bottomColor
                break;

              case "Back":
                self.newData.frontImageID = self.newData.backImageID
                self.newData.frontTransparent = self.newData.backTransparent
                self.newData.frontColor = self.newData.backColor
                break;

              case "Front":
                self.newData.backImageID = self.newData.frontImageID
                self.newData.backTransparent = self.newData.frontTransparent
                self.newData.backColor = self.newData.frontColor
                break;

              default:
                break;
            }
          }
        })
      },
      getFixtureImageNew(imageID) {
        if (imageID == undefined || imageID == null) {
          return "https://sisterhoodofstyle.com/wp-content/uploads/2018/02/no-image-1.jpg";
        } else {
          return (
            process.env.VUE_APP_API +
            "FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=" +
            imageID
          );
        }
      },
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
        console.log("changeImageSelect", self.newData.renderImage);



        self.$nextTick(() => {

          if (self.newData.renderImage == "None") {
            console.log("nonne");
            self.newData.RenderingsItems.Front.image = null
            self.$refs.changeRenderImage.src = null
            self.viewRender.yOffset = 0
            self.viewRender.height = 1
            self.viewRender.width = 1
            self.viewRender.depth = 0
            return
          }
          console.log("self.renderings", self.renderings);

          self.renderings.forEach(render => {
            if (render.id == self.newData.renderImage) {
              self.newData.RenderingsItems.Front = render
              if (render.frontImageID != null) {
                self.newData.RenderingsItems.Front.image = process.env.VUE_APP_API +
                  `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.newData.RenderingsItems.Front.id}`
              }
              // console.log(element);

              // self.newData.renderLabel.width = element.width
              // self.newData.renderLabel.height = element.height
              // self.newData.renderLabel.depth = element.depth
              self.viewRender.yOffset = self.newData.RenderingsItems.Front.yOffset
              self.viewRender.height = self.newData.RenderingsItems.Front.height
              self.viewRender.width = self.newData.RenderingsItems.Front.width
              self.viewRender.depth = self.newData.RenderingsItems.Front.depth
              console.log(self.viewRender);
              self.$refs.changeRenderImage.src = self.newData.RenderingsItems.Front.image;
            }
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
        console.log("[OPEN]------eventdata", eventData);

        self.getFixtureTX(eventData.id, fixturecb => {

        })

        if (eventData.type.toUpperCase() === "GONDOLA") {
          self.modalShow = true;

          self.newData = JSON.parse(JSON.stringify(eventData.data));
          self.newData.uploadSide = false
          self.newData.uploadTop = false
          console.log("[OPEN]----rendering Items", self.newData.RenderingsItems);
          self.getRenderingTypes()
          // self.getSelectedRenderings()
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
            if (self.newData.image != undefined && self.newData.image != null) {
              // self.$refs.changeImage.src = 'data:image/png;base64,' + self.newData.image; 
            } else {
              //self.$refs.changeImage.src = '';
            }
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
              null) {
              // self.$refs.changeRenderImage.src = 'data:image/png;base64,' + self.newData.RenderingsItems.Front
              // .image;
            } else {
              //self.$refs.changeRenderImage.src = '';
            }


            // if (self.newData.barImage != undefined && self.newData.barImage != null)
            //   self.$refs.changeImageBar.src = 'data:image/png;base64,' + self.newData.barImage;
            // else
            //   self.$refs.changeImageBar.src = '';
          })
        } else {
          self.destroy();
        }
      },
      submit() {
        let self = this;
        let event = new CustomEmitter();
        // let tmp = self.newData.color.hex;

        self.newData.color = self.newData.color.hex == undefined ? "#fff" : self.newData.color.hex;
        self.newData.frontColor = self.newData.frontColor.hex == undefined ? "#fff" : self.newData.frontColor.hex;
        self.newData.backColor = self.newData.backColor.hex == undefined ? "#fff" : self.newData.backColor.hex;
        self.newData.leftColor = self.newData.leftColor.hex == undefined ? "#fff" : self.newData.leftColor.hex;
        self.newData.rightColor = self.newData.rightColor.hex == undefined ? "#fff" : self.newData.rightColor.hex;
        self.newData.topColor = self.newData.topColor.hex == undefined ? "#fff" : self.newData.topColor.hex;
        self.newData.bottomColor = self.newData.bottomColor.hex == undefined ? "#fff" : self.newData.bottomColor.hex;
        self.newData.pegHoleColor = self.newData.pegHoleColor.hex == undefined ? "#000" : self.newData.pegHoleColor.hex;

        // self.newData.RenderingsItems.Front.height = returnFloat(self.viewRender.height)
        // self.newData.RenderingsItems.Front.width = returnFloat(self.viewRender.width)
        // self.newData.RenderingsItems.Front.depth = returnFloat(self.viewRender.depth)

        // self.newData.RenderingsItems.Front.yOffset = self.viewRender.yOffset

        // if (self.newData.RenderingsItems.Front.yOffset == null || self.newData.RenderingsItems.Front.yOffset == undefined) {
        //   self.newData.RenderingsItems.Front.yOffset = 0
        // }

        // if (self.newData.renderImage == "None" || self.newData.renderImage == undefined) {
        //   self.newData.RenderingsItems.Front = null
        // }
        
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
      changeImage(e) {
        let self = this;

        const files = e.target.files;
        let file = files[0];

        // self.blobToDataUrl(file, url => {
        //   self.$refs[self.changingSide + "Image"].src = url;
        // })

        let request = {
          name: file.name,
          type: file.type == null ? "" : file.type
        };

        self.hideImages = true;

        axios
          .post(
            process.env.VUE_APP_API + "FixtureImage?db=CR-DEVINSPIRE",
            request
          )
          .then(r => {
            axios.post(process.env.VUE_APP_API + "FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=" + r.data.id, file)
              .then(image => {
                self.checkSideImageChange(r.data.id);
                self.hideImages = false;
              });
          })
          .catch(e => {});
      },
      checkSideImageChange(imageID) {
        let self = this

        switch (self.changingSide) {
          case 'front': {
            self.newData.frontImageID = imageID;

            if (self.frontBackMirror) {
              self.newData.backImageID = imageID;
            }
          }
          break;
        case 'back': {
          self.newData.backImageID = imageID;

          if (self.frontBackMirror) {
            self.newData.frontImageID = imageID;
          }
        }
        break;
        case 'top': {
          self.newData.topImageID = imageID;

          if (self.topBottomMirror) {
            self.newData.bottomImageID = imageID;
          }
        }
        break;
        case 'bottom': {
          self.newData.bottomImageID = imageID;

          if (self.topBottomMirror) {
            self.newData.topImageID = imageID;
          }
        }
        break;
        case 'left': {
          self.newData.leftImageID = imageID;

          if (self.leftRightMirror) {
            self.newData.rightImageID = imageID;
          }
        }
        break;
        case 'right': {
          self.newData.rightImageID = imageID;

          if (self.leftRightMirror) {
            self.newData.leftImageID = imageID;
          }
        }
        break;
        }
      },
      changeDisplay(prop) {
        let self = this;

        switch (prop) {
          case "Front": {
            self.frontBack = "Back";
          }
          break;
        case "Back": {
          self.frontBack = "Front";
        }
        break;
        case "Left": {
          self.leftRight = "Right";
        }
        break;
        case "Right": {
          self.leftRight = "Left";
        }
        break;
        case "Top": {
          self.topBottom = "Bottom";
        }
        break;
        case "Bottom": {
          self.topBottom = "Top";
        }
        break;
        }
      },
      transparentChange(side) {
        let self = this;

        self.$nextTick(() => {
          switch (side) {
            case "Front": {
              if (self.frontBackMirror) {
                self.newData.backTransparent = self.newData.frontTransparent;
              }
            }
            break;
          case "Back": {
            if (self.frontBackMirror) {
              self.newData.frontTransparent = self.newData.backTransparent;
            }
          }
          break;
          case "Left": {
            if (self.leftRightMirror) {
              self.newData.rightTransparent = self.newData.leftTransparent;
            }
          }
          break;
          case "Right": {
            if (self.leftRightMirror) {
              self.newData.leftTransparent = self.newData.rightTransparent;
            }
          }
          break;
          case "Top": {
            if (self.topBottomMirror) {
              self.newData.bottomTransparent = self.newData.topTransparent;
            }
          }
          break;
          case "Bottom": {
            if (self.topBottomMirror) {
              self.newData.topTransparent = self.newData.bottomTransparent;
            }
          }
          break;
          }
        })
      },
      openFileDialog(side) {
        let self = this;

        self.changingSide = side;

        self.$refs.imageInput.value = null;

        self.$refs.imageInput.click();
      },
    }
  };
</script>

<style scoped>
</style>