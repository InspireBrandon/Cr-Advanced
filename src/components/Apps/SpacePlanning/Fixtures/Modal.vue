<template>
  <v-dialog fullscreen persistent v-model="dialog">
    <v-card dark>
      <v-toolbar>
        <v-toolbar-title v-if="isAdd">Add Fixture</v-toolbar-title>
        <v-toolbar-title v-else>Edit Fixture</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="ma-0" @click="submit" dark color="primary" flat fab>
          <v-icon>save</v-icon>
        </v-btn>
        <v-btn class="ma-0" @click="dialog = false" dark flat fab>
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
                    <v-autocomplete item-text="name" item-value="id" :items="fixtureGroups"
                      v-model="form.fixtureGroupID" label="Fixture Group:"></v-autocomplete>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12>
                    <v-text-field v-model="form.name" label="Name:"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12>
                    <v-text-field v-if="!form.rendering" v-model="form.label" label="Label:"></v-text-field>
                  </v-flex>
                  <v-flex v-if="form.type == 0 && !form.rendering" lg8 md12 sm12 xs12>
                    <v-select placeholder="please select" :items="fixtureLabelOrders" v-model="form.fixtureLabelOrder"
                      label="Label order:"></v-select>
                  </v-flex>
                  <v-flex v-if="form.type == 0 && !form.rendering" lg12 md12>
                    <label v-if="!form.rendering">Label Position</label>
                    <v-radio-group v-if="!form.rendering" v-model="form.labelPlacement" row>
                      <v-radio :label="'Left'" value="LEFT"></v-radio>
                      <v-radio :label="'Center'" value="CENTER"></v-radio>
                      <v-radio :label="'Right'" value="RIGHT"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12>
                    <v-select placeholder="please select" v-if="form.rendering" :items="types" v-model="form.type"
                      label="Type:"></v-select>
                    <v-select placeholder="please select" v-if="form.type == 2" :items="fixtureTypes"
                      v-model="form.fixtureType" label="Type:"></v-select>
                    <v-select placeholder="please select" v-if="form.type == 3" :items="subTypes"
                      v-model="form.fixtureType" label="Subtype:"></v-select>
                    <v-select placeholder="please select" v-if="form.type == 0  && form.rendering"
                      :items="renderingTypeGondola" v-model="form.renderingType" label="Rendering Type:"></v-select>
                    <v-select placeholder="please select"
                      v-if="form.type == 2 && form.fixtureType == 1 || form.type == 3 && form.fixtureType == 4 && form.rendering"
                      :items="renderingTypeShelf" v-model="form.renderingType" label="Rendering Type:"></v-select>

                    <v-select placeholder="please select"
                      v-if="form.type == 3 && form.fixtureType == 3 && form.rendering" :items="renderingTypeArea"
                      v-model="form.renderingType" label="Rendering Type:"></v-select>

                    <v-select placeholder="please select"
                      v-if="form.type == 2 && form.fixtureType == 0 && form.rendering" :items="renderingTypeBase"
                      v-model="form.renderingType" label="Rendering Type:"></v-select>
                    <v-select placeholder="please select"
                      v-if="form.type == 2 && form.fixtureType == 3 && form.rendering" :items="renderingTypePegBar"
                      v-model="form.renderingType" label="Rendering Type:"></v-select>
                    <v-select placeholder="please select"
                      v-if="form.type == 3 && form.fixtureType == 1 && form.rendering" :items="renderingTypeBasket"
                      v-model="form.renderingType" label="Rendering Type:"></v-select>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!form.rendering">
                    <v-select placeholder="please select"
                      v-if="(form.fixtureType == 2 || form.fixtureType == 3) && form.type == 2" :items="pegs"
                      v-model="form.defaultPeg" label="Default peg:"></v-select>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!form.rendering">
                    <v-select placeholder="please select" :items="SpreadProducts" v-model="form.spreadProducts"
                      label="Spread products:"></v-select>
                  </v-flex>

                  <v-flex lg8 md12 sm12 xs12>
                    <v-text-field type="number" label="Cost of Fixture" prefix="R" v-model="form.cost"></v-text-field>
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
                    <v-text-field type="number" v-model="form.height" label="Height:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12>
                    <v-text-field type="number" v-model="form.width" label="Width:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12>
                    <v-text-field type="number" v-model="form.depth" label="Depth:" suffix="cm"></v-text-field>
                  </v-flex>
                  <!-- <v-flex lg8 md12 sm12 xs12
                    v-if="(form.fixtureType==1&&form.type==2||form.fixtureType==0&&form.type==2 ||form.fixtureType==1&&form.type==3 ||form.fixtureType==3&&form.type==2 || form.fixtureType==4&&form.type==3)">
                    <v-text-field type="number" v-model="form.height" suffix="cm"
                      label="Merchandising Offset:"></v-text-field>
                  </v-flex>-->
                  <v-flex lg8 md12
                    v-if="!form.rendering && (form.type == 2 && (form.fixtureType == 0 || form.fixtureType == 1))">
                    <v-text-field type="number" v-model="form.overhang" label="Overhang:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12
                    v-if="!form.rendering && (( form.type == 2 && form.fixtureType == 1 || form.type == 3 && form.fixtureType == 4))">
                    <v-text-field type="number" v-model="form.x_Offset" label="X Offset:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12>
                    <v-text-field type="number" v-model="form.y_Offset" label="Y Offset:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12
                    v-if="form.spreadProducts!='SFE'&&(!form.rendering && form.type == 2 && form.fixtureType != 2 || form.fixtureType==4&&form.type==3)">
                    <v-checkbox hide-details label="Squish" v-model="form.squish"></v-checkbox>
                  </v-flex>

                  <v-flex lg8 md12 sm12 xs12
                    v-if="(!form.rendering && form.squish) && (form.type == 2 && form.fixtureType != 2 || form.fixtureType==4&&form.type==3)">
                    <v-checkbox hide-details label="Auto Squish" v-model="form.autoSquish"></v-checkbox>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12
                    v-if="(!form.rendering && form.squish && !form.autoSquish) && (form.type == 2 && form.fixtureType != 2 || form.fixtureType==4&&form.type==3)">
                    <v-text-field hide-details v-if="!form.rendering" v-model="form.squishAmount"
                      label="Squish Amount:"></v-text-field>
                  </v-flex>
                  <!-- <v-flex lg8 md12
                    v-if="!form.rendering && form.fixtureType == 3 || form.fixtureType==4&&form.type==3">
                    <v-text-field type="number" v-model="form.productOffset" label="Product offset:" suffix="cm">
                    </v-text-field>
                  </v-flex>-->
                  <!-- <v-flex lg8 md12
                    v-if="!form.rendering && (form.type == 2 && (form.fixtureType == 0 || form.fixtureType == 1))">
                    <v-text-field type="number" v-model="form.overhang" label="Overhang:" suffix="cm"></v-text-field>
                  </v-flex>-->
                  <!-- <v-flex lg8 md12 v-if="!form.rendering && form.fixtureType == 3">
                    <v-text-field type="number" v-model="form.productOffset" label="Product offset:" suffix="cm">
                    </v-text-field>
                  </v-flex>-->
                  <v-flex lg8 md12 v-if="form.fixtureType == 2 && !form.rendering">
                    <v-text-field type="number" v-model="form.xHoleSpacing" label="X hole spacing:" suffix="cm">
                    </v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="form.fixtureType == 2 && !form.rendering">
                    <v-text-field type="number" v-model="form.yHoleSpacing" label="Y hole spacing:" suffix="cm">
                    </v-text-field>
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
                        <a href="#" @click.prevent="frontBackMirror = !frontBackMirror"
                          :style="{ 'background': frontBackMirror ? 'white': 'transparent' }">m</a>
                      </span>
                      <span class="ml-2">
                        <v-icon size="18" @click="changeDisplay(frontBack)">swap_horiz</v-icon>
                      </span>
                    </span>
                    <img v-if="!hideImages" ref="frontImage" style="width: 100%; max-height: 120px;"
                      :src="getFixtureImageNew(frontBack == 'Front' ? form.frontImageID : form.backImageID)" alt
                      @click="openFileDialog(frontBack.toLowerCase())" />
                    <a href="#" @click.prevent="openFileDialog(frontBack.toLowerCase())">Change</a>
                    <span class="mr-2"></span>
                    <a href="#" @click.prevent="form.frontImageID = null">Remove</a>
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
                        <a href="#" @click.prevent="leftRightMirror = !leftRightMirror"
                          :style="{ 'background': leftRightMirror ? 'white': 'transparent' }">m</a>
                      </span>
                      <span class="ml-2">
                        <v-icon size="18" @click="changeDisplay(leftRight)">swap_horiz</v-icon>
                      </span>
                    </span>
                    <img v-if="!hideImages" ref="sideImage" style="width: 100%; max-height: 120px;"
                      :src="getFixtureImageNew(leftRight == 'Left' ? form.leftImageID : form.rightImageID)" alt
                      @click="openFileDialog(leftRight.toLowerCase())" />
                    <a href="#" @click.prevent="openFileDialog(leftRight.toLowerCase())">Change</a>
                    <span class="mr-2"></span>
                    <a href="#" @click.prevent="form.sideImageID = null">Remove</a>
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
                        <a href="#" @click.prevent="topBottomMirror = !topBottomMirror"
                          :style="{ 'background': topBottomMirror ? 'white': 'transparent' }">m</a>
                      </span>
                      <span class="ml-2">
                        <v-icon size="18" @click="changeDisplay(topBottom)">swap_horiz</v-icon>
                      </span>
                    </span>
                    {{ form.topImageID }}
                    {{ form.bottomImageID }}
                    <img v-if="!hideImages" ref="topImage" style="width: 100%; max-height: 120px;"
                      :src="getFixtureImageNew(topBottom == 'Top' ? form.topImageID : form.bottomImageID)" alt
                      @click="openFileDialog(topBottom.toLowerCase())" />
                    <a href="#" @click.prevent="openFileDialog(topBottom.toLowerCase())">Change</a>
                    <span class="mr-2"></span>
                    <a href="#" @click.prevent="form.topImageID = null">Remove</a>
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
                    <div v-if="!form.rendering">
                      <div>Colour</div>
                      <compact-picker v-if="frontBack == 'Front'" style="width: 100%" v-model="form.frontColor" />
                      <compact-picker v-if="frontBack == 'Back'" style="width: 100%" v-model="form.backColor" />
                    </div>
                  </v-flex>
                  <v-flex md4 class="px-3">
                    <div v-if="!form.rendering">
                      <div>Colour</div>
                      <compact-picker v-if="leftRight == 'Left'" style="width: 100%" v-model="form.leftColor" />
                      <compact-picker v-if="leftRight == 'Right'" style="width: 100%" v-model="form.rightColor" />
                    </div>
                  </v-flex>
                  <v-flex md4 class="px-3">
                    <div v-if="!form.rendering">
                      <div>Colour</div>
                      <compact-picker v-if="topBottom == 'Top'" style="width: 100%" v-model="form.topColor" />
                      <compact-picker v-if="topBottom == 'Bottom'" style="width: 100%" v-model="form.bottomColor" />
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
                      v-model="form.frontTransparent" label="Transparent"></v-checkbox>
                    <v-checkbox @change="transparentChange('Back')" v-if="frontBack == 'Back'"
                      v-model="form.backTransparent" label="Transparent"></v-checkbox>
                  </v-flex>
                  <v-flex md4 class="px-3">
                    <v-checkbox @change="transparentChange('Left')" v-if="leftRight == 'Left'"
                      v-model="form.leftTransparent" label="Transparent"></v-checkbox>
                    <v-checkbox @change="transparentChange('Right')" v-if="leftRight == 'Right'"
                      v-model="form.rightTransparent" label="Transparent"></v-checkbox>
                  </v-flex>
                  <v-flex md4 class="px-3">
                    <v-checkbox @change="transparentChange('Top')" v-if="topBottom == 'Top'"
                      v-model="form.topTransparent" label="Transparent"></v-checkbox>
                    <v-checkbox @change="transparentChange('Bottom')" v-if="topBottom == 'Bottom'"
                      v-model="form.bottomTransparent" label="Transparent"></v-checkbox>
                  </v-flex>
                  <v-flex v-if="!form.rendering" lg12 md12 sm12 xs12 class="px-3">
                    <h3>Renderings</h3>
                  </v-flex>
                  <v-flex v-if="!form.rendering &&renderingType0.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select placeholder="please select" :items="renderingType0" v-model="selectedRenderingType0"
                      label="Label Holder:"></v-select>
                  </v-flex>
                  <v-flex v-if="!form.rendering &&renderingType1.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select placeholder="please select" :items="renderingType1" v-model="selectedRenderingType1"
                      label="Shelf Edge:"></v-select>
                  </v-flex>
                  <v-flex v-if="!form.rendering &&renderingType2.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select placeholder="please select" :items="renderingType2" v-model="selectedRenderingType2"
                      label="Back Face:"></v-select>
                  </v-flex>
                  <v-flex v-if="!form.rendering &&renderingType3.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select placeholder="please select" :items="renderingType3" v-model="selectedRenderingType3"
                      label="Front Face:"></v-select>
                  </v-flex>
                  <v-flex v-if="!form.rendering &&renderingType4.length>1" lg8 md12 sm12 xs12 class="px-3">
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
    <YesNoModal ref="YesNoModal" />
  </v-dialog>
</template>
<script>
  import axios from "axios";
  import {
    Compact
  } from "vue-color";
  import YesNoModal from "@/components/Common/YesNoModal";

  export default {
    components: {
      "compact-picker": Compact,
      YesNoModal
    },
    created() {
      let self = this;

      axios
        .get(
          process.env.VUE_APP_API + "Fixture?db=CR-Devinspire&type=3&subType=0"
        )
        .then(r => {
          let pegs = r.data;

          if (pegs != undefined) {
            for (let index = 0; index < pegs.length; index++) {
              const element = pegs[index];
              self.pegs.push({
                text: element.name,
                value: element.id
              });
            }
          }
        });
    },
    name: "FixturesModal",
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
        changingSide: "",
        fixtureGroups: [],
        isSubtype: false,
        dialog: false,
        afterEdit: null,
        afterAdd: null,
        isAdd: true,
        SpreadProducts: [{
            text: "Left to right",
            value: "L2R"
          },
          {
            text: "Right to left",
            value: "R2L"
          },
          {
            text: "Spread even",
            value: "SE"
          },
          {
            text: "Spread facings even",
            value: "SFE"
          },
          {
            text: "Place where dropped horizontal",
            value: "PWD"
          },
          // {
          //   text: 'Place where dropped vertical',
          //   value: 'PWD'
          // },
          {
            text: "Place where dropped vertical and horizontal",
            value: "PWDXY"
          }
        ],
        types: [{
            text: "Gondola",
            value: 0
          },
          {
            text: "Obstruction",
            value: 1
          },
          {
            text: "Fixture",
            value: 2
          },
          {
            text: "Sub Fixture",
            value: 3
          },
          {
            text: "Palette",
            value: 4
          }
        ],
        fixtureTypes: [{
            text: "Base",
            value: 0
          },
          {
            text: "Shelf",
            value: 1
          },
          {
            text: "Pegboard",
            value: 2
          },
          {
            text: "Pegbar",
            value: 3
          },
          {
            text: "Share box",
            value: 4
          }
        ],
        subTypes: [{
            text: "Peg",
            value: 0
          },
          {
            text: "Basket",
            value: 1
          },
          {
            text: "Divider",
            value: 2
          },
          {
            text: "Area",
            value: 3
          },
          {
            text: "Label Holder",
            value: 4
          }
        ],
        renderingTypeShelf: [{
            text: "Label Holder",
            value: 0
          },
          {
            text: "Shelf Edge",
            value: 1
          },
          {
            text: "Back Face",
            value: 2
          },
          {
            text: "Side Face",
            value: 4
          }
        ],
        renderingTypeBase: [{
            text: "Label Holder",
            value: 0
          },
          {
            text: "Back Face",
            value: 2
          }
        ],
        renderingTypeArea: [{
            text: "Front Face",
            value: 3
          },
          {
            text: "Back Face",
            value: 2
          }
        ],
        renderingTypeGondola: [{
          text: "Front Face",
          value: 3
        }],
        renderingTypePegBar: [{
          text: "Label Holder",
          value: 0
        }],
        renderingTypeBasket: [
          // {
          //   text: 'Back Face',
          //   value: 2
          // },
          {
            text: "Front Face",
            value: 3
          }
        ],
        pegs: [],
        fixtureLabelOrders: [{
            text: "Top to bottom",
            value: 0
          },
          {
            text: "Bottom to top",
            value: 1
          }
        ],
        form: {
          id: 1,
          uid: "da141b3c-436c-4933-bea2-ed36d4466140",
          type: -1,
          fixtureGroupID: null,
          fixtureType: null,
          renderingType: null,
          name: "sample string 5",
          label: "sample string 6",
          image: "",
          barImage: "",
          labelPlacement: "sample string 7",
          height: 8.0,
          width: 9.0,
          depth: 10.0,
          fixtureSpacing: 11.0,
          merchheight: 12.0,
          xPegsCount: 13,
          yPegsCount: 14,
          xHoleSpacing: 15.0,
          yHoleSpacing: 16.0,
          spreadProducts: "sample string 17",
          pegRadius: 0,
          pegDiameter: 0,
          fixtureLabelOrder: 0,
          color: {
            hex: "#fff"
          },
          frontColor: {
            hex: "#fff"
          },
          backColor: {
            hex: "#fff"
          },
          leftColor: {
            hex: "#fff"
          },
          rightColor: {
            hex: "#fff"
          },
          bottomColor: {
            hex: "#fff"
          },
          topColor: {
            hex: "#fff"
          },
          pegHoleColor: {
            hex: "#000"
          },
          defaultPeg: null,
          pegboardPadding: null,
          wireMesh: false,
          rendering: false,
          overhang: null,
          productOffset: null,
          cost: null,
          squish: null,
          autoSquish: null,
          squishAmount: null,
          frontImageID: null,
          backImageID: null,
          sideImageID: null,
          leftImageID: null,
          rightImageID: null,
          topImageID: null,
          bottomImageID: null,
          transparent: false,
          frontTransparent: false,
          backTransparent: false,
          leftTransparent: false,
          rightTransparent: false,
          bottomTransparent: false,
          topTransparent: false,
          x_Offset: null,
          y_Offset: null
        },
        showModal: false,
        hideImages: false
      };
    },
    methods: {
      mirrorSides(side) {
        let self = this
        console.log("mirrorSides", side);
        self.$refs.YesNoModal.show("Are you sure you want to mirror sides", value => {
          if (value) {
            switch (side) {
              case "Right":
                self.form.leftImageID = self.form.rightImageID
                self.form.leftTransparent = self.form.rightTransparent
                self.form.leftColor = self.form.rightColor
                break;

              case "Left":
                self.form.rightImageID = self.form.leftImageID
                self.form.rightTransparent = self.form.leftTransparent
                self.form.rightColor = self.form.leftColor
                break;

              case "Top":
                self.form.bottomImageID = self.form.topImageID
                self.form.bottomTransparent = self.form.topTransparent
                self.form.bottomColor = self.form.topColor
                break;

              case "Bottom":
                self.form.topImageID = self.form.bottomImageID
                self.form.topTransparent = self.form.bottomTransparent
                self.form.topColor = self.form.bottomColor
                break;

              case "Back":
                self.form.frontImageID = self.form.backImageID
                self.form.frontTransparent = self.form.backTransparent
                self.form.frontColor = self.form.backColor
                break;

              case "Front":
                self.form.backImageID = self.form.frontImageID
                self.form.backTransparent = self.form.frontTransparent
                self.form.backColor = self.form.frontColor
                break;

              default:
                break;
            }
          }
        })
      },
      getRenderingTypes() {
        let self = this;
        axios
          .get(
            process.env.VUE_APP_API +
            `Renderings?db=CR-Devinspire&type=${self.form.type}&subType=${self.form.fixtureType}`
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
      getFixtureGroups(groupType) {
        let self = this;

        axios
          .get(process.env.VUE_APP_API + "FixtureGroup?db=CR-Devinspire&type=1")
          .then(r => {
            self.fixtureGroups = r.data;
          })
          .catch(e => {
            console.log(e);
          });
      },
      openAdd(type, group, afterAdd) {
        let self = this;
        self.selectedRenderingType0 = null;
        self.selectedRenderingType1 = null;
        self.selectedRenderingType2 = null;
        self.selectedRenderingType3 = null;
        self.selectedRenderingType4 = null;
        this.isAdd = true;
        this.afterEdit = afterAdd;

        self.getFixtureGroups();

        for (var prop in this.form) {
          this.form[prop] = null;
        }
        if (group != null) {
          self.form.fixtureGroupID = group.id;
        }
        this.form.color = {
          hex: "#fff"
        };

        this.form.frontColor = {
          hex: "#fff"
        };

        this.form.backColor = {
          hex: "#fff"
        };

        this.form.topColor = {
          hex: "#fff"
        };

        this.form.bottomColor = {
          hex: "#fff"
        };

        this.form.leftColor = {
          hex: "#fff"
        };

        this.form.rightColor = {
          hex: "#fff"
        };

        this.form.pegHoleColor = {
          hex: "#000"
        };

        this.form.wireMesh = false;
        this.form.type = type;

        // this.$refs.changeImage.src = "";
        // this.$refs.changeImageBar.src = "";

        if (type == 5) this.form.rendering = true;

        this.dialog = true;
      },
      getSelectedRenderings() {
        let self = this;
        axios
          .get(
            process.env.VUE_APP_API +
            `FixtureRenderingLink?db=CR-Devinspire&Fixture_ID=${self.form.id}`
          )
          .then(r => {
            // self.form.image = r.data;
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
      openEdit(fixture, groupType, afterEdit) {
        let self = this;
        self.selectedRenderingType0 = null;
        self.selectedRenderingType1 = null;
        self.selectedRenderingType2 = null;
        self.selectedRenderingType3 = null;
        self.selectedRenderingType4 = null;
        self.getFixtureGroups(groupType);
        // self.getFixtureImage(fixture.id);

        for (var prop in this.form) {
          this.form[prop] = fixture[prop];
        }

        console.log("form", this.form);
        self.getRenderingTypes();
        self.getSelectedRenderings();

        this.form.color = {
          hex: fixture.color
        };

        this.form.frontColor = {
          hex: fixture.frontColor
        };

        this.form.backColor = {
          hex: fixture.backColor
        };

        this.form.topColor = {
          hex: fixture.topColor
        };

        this.form.bottomColor = {
          hex: fixture.bottomColor
        };

        this.form.leftColor = {
          hex: fixture.leftColor
        };

        this.form.rightColor = {
          hex: fixture.rightColor
        };

        this.form.pegHoleColor = {
          hex: fixture.color
        };
        if (self.form.squish == true) {
          self.form.spreadProducts = "L2R";
        }
        if (self.form.squish != null && self.form.spreadProducts != null) {
          self.form.squish == false;
        }
        self.form.pegDiameter = self.form.pegRadius * 2;

        // if (fixture.image != undefined && fixture.image != null)
        //   self.$refs.changeImage.src = 'data:image/png;base64,' + fixture.image;
        // else
        //   self.$refs.changeImage.src = '../../../../static/img/image-placeholder.png';

        // if (fixture.barImage != undefined && fixture.barImage != null)
        //   self.$refs.changeImageBar.src = 'data:image/png;base64,' + fixture.barImage;
        // else
        //   self.$refs.changeImageBar.src = '../../../../static/img/image-placeholder.png';

        this.isAdd = false;
        this.afterEdit = afterEdit;

        this.dialog = true;
      },
      openFileExplorer() {
        let self = this;
        self.$refs.fileInput.value = null;
        self.$refs.fileInput.click();
      },
      openFileExplorerBar() {
        let self = this;
        self.$refs.fileInputBar.value = null;
        self.$refs.fileInputBar.click();
      },
      imageChangeBar(e) {
        let self = this;

        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          self.$refs.changeImageBar.src = url;
          self.blobToArrayBuffer(file, result => {
            self.form.barImage = Array.from(new Uint8Array(result));
          });
        });
      },
      imageChange(e) {
        let self = this;

        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          self.$refs.changeImage.src = url;
          self.blobToArrayBuffer(file, result => {
            self.form.image = Array.from(new Uint8Array(result));
          });
        });
      },
      getFixtureImage(id) {
        let self = this;

        axios
          .get(process.env.VUE_APP_API + "FixtureImage?db=CR-Devinspire&id=" + id)
          .then(r => {
            // self.form.image = r.data;

            if (r.data != undefined && r.data != null)
              self.$refs.changeImage.src = "data:image/png;base64," + r.data;
          })
          .catch(e => {
            console.log(e);
          });
      },
      blobToArrayBuffer(blob, callback) {
        var a = new FileReader();
        a.onload = function (e) {
          callback(a.result);
        };
        a.readAsArrayBuffer(blob);
      },
      blobToDataUrl(blob, callback) {
        var a = new FileReader();
        a.onload = function (e) {
          callback(a.result);
        };
        a.readAsDataURL(blob);
      },
      handleRenderingLinks(callback) {
        let self = this;
        let allRenderingArr = [];
        if (self.selectedRenderingType0 != null) {
          allRenderingArr.push({
            Fixture_ID: self.form.id,
            Rendering_Fixture_ID: self.selectedRenderingType0
          });
        }
        if (self.selectedRenderingType1 != null) {
          allRenderingArr.push({
            Fixture_ID: self.form.id,
            Rendering_Fixture_ID: self.selectedRenderingType1
          });
        }
        if (self.selectedRenderingType2 != null) {
          allRenderingArr.push({
            Fixture_ID: self.form.id,
            Rendering_Fixture_ID: self.selectedRenderingType2
          });
        }
        if (self.selectedRenderingType3 != null) {
          allRenderingArr.push({
            Fixture_ID: self.form.id,
            Rendering_Fixture_ID: self.selectedRenderingType3
          });
        }
        if (self.selectedRenderingType4 != null) {
          allRenderingArr.push({
            Fixture_ID: self.form.id,
            Rendering_Fixture_ID: self.selectedRenderingType4
          });
        }
        console.log("allRenderingArr", allRenderingArr);
        if (allRenderingArr.length > 0) {
          axios
            .post(
              process.env.VUE_APP_API + "FixtureRenderingLink?db=CR-Devinspire",
              allRenderingArr
            )
            .then(r => {
              console.log("allRenderingArr", allRenderingArr);

              callback();
            })
            .catch(e => {
              console.log(e);
              alert("error saving links");
              callback();
            });
        } else {
          callback();
        }
      },
      submit() {
        let self = this;

        self.form.color = self.form.color.hex == undefined ? "#fff" : self.form.color.hex;
        self.form.frontColor = self.form.frontColor.hex == undefined ? "#fff" : self.form.frontColor.hex;
        self.form.backColor = self.form.backColor.hex == undefined ? "#fff" : self.form.backColor.hex;
        self.form.leftColor = self.form.leftColor.hex == undefined ? "#fff" : self.form.leftColor.hex;
        self.form.rightColor = self.form.rightColor.hex == undefined ? "#fff" : self.form.rightColor.hex;
        self.form.topColor = self.form.topColor.hex == undefined ? "#fff" : self.form.topColor.hex;
        self.form.bottomColor = self.form.bottomColor.hex == undefined ? "#fff" : self.form.bottomColor.hex;
        self.form.pegHoleColor = self.form.pegHoleColor.hex == undefined ? "#000" : self.form.pegHoleColor.hex;

        if (this.isAdd) {
          axios
            .post(process.env.VUE_APP_API + "Fixture?db=CR-Devinspire", self.form)
            .then(r => {
              if (r.data == null) {
                alert("Failed to save")
              } else {
                self.handleRenderingLinks(cb => {
                  this.afterEdit(self.form);
                  this.dialog = false;
                });
              }
            })
            .catch(e => {});
        } else {
          axios
            .put(process.env.VUE_APP_API + "Fixture?db=CR-Devinspire", self.form)
            .then(r => {
              console.log("edit resp", r);

              self.handleRenderingLinks(cb => {
                this.afterEdit(self.form);
                this.dialog = false;
              });
            })
            .catch(e => {});
        }
      },
      setDiameter() {
        this.form.pegDiameter = this.form.pegRadius * 2;
      },
      setRadius() {
        this.form.pegRadius = this.form.pegDiameter / 2;
      },
      // New Image Work
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
            self.checkSideImageChange(r.data.id);

            axios
              .put(
                process.env.VUE_APP_API + "Fixture?db=CR-Devinspire",
                self.form
              )
              .then(fr => {
                axios
                  .post(
                    process.env.VUE_APP_API +
                    "FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=" +
                    r.data.id,
                    file
                  )
                  .then(image => {
                    self.checkSideImageChange(r.data.id);
                    self.hideImages = false;
                  });
              })
              .catch(e => {});
          })
          .catch(e => {});
      },
      checkSideImageChange(imageID) {
        let self = this

        switch (self.changingSide) {
          case 'front': {
            self.form.frontImageID = imageID;

            if (self.frontBackMirror) {
              self.form.backImageID = imageID;
            }
          }
          break;
        case 'back': {
          self.form.backImageID = imageID;

          if (self.frontBackMirror) {
            self.form.frontImageID = imageID;
          }
        }
        break;
        case 'top': {
          self.form.topImageID = imageID;

          if (self.topBottomMirror) {
            self.form.bottomImageID = imageID;
          }
        }
        break;
        case 'bottom': {
          self.form.bottomImageID = imageID;

          if (self.topBottomMirror) {
            self.form.topImageID = imageID;
          }
        }
        break;
        case 'left': {
          self.form.leftImageID = imageID;

          if (self.leftRightMirror) {
            self.form.rightImageID = imageID;
          }
        }
        break;
        case 'right': {
          self.form.rightImageID = imageID;

          if (self.leftRightMirror) {
            self.form.leftImageID = imageID;
          }
        }
        break;
        }
      },
      openFileDialog(side) {
        let self = this;

        self.changingSide = side;

        self.$refs.imageInput.value = null;

        self.$refs.imageInput.click();
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
                self.form.backTransparent = self.form.frontTransparent;
              }
            }
            break;
          case "Back": {
            if (self.frontBackMirror) {
              self.form.frontTransparent = self.form.backTransparent;
            }
          }
          break;
          case "Left": {
            if (self.leftRightMirror) {
              self.form.rightTransparent = self.form.leftTransparent;
            }
          }
          break;
          case "Right": {
            if (self.leftRightMirror) {
              self.form.leftTransparent = self.form.rightTransparent;
            }
          }
          break;
          case "Top": {
            if (self.topBottomMirror) {
              self.form.bottomTransparent = self.form.topTransparent;
            }
          }
          break;
          case "Bottom": {
            if (self.topBottomMirror) {
              self.form.topTransparent = self.form.bottomTransparent;
            }
          }
          break;
          }
        })
      }
    },
    computed: {
      diameter() {
        return this.form.radius * 2;
      },
      calculateHolesX() {
        let self = this;
        if (
          self.form.xHoleSpacing == null ||
          self.form.pegDiameter == null ||
          self.form.width == null
        ) {
          return 0;
        } else {
          return Math.round(
            parseInt(self.form.width) /
            (parseInt(self.form.xHoleSpacing) + parseInt(self.form.pegDiameter))
          );
        }
      },
      calculateHolesY() {
        let self = this;
        if (
          self.form.yHoleSpacing == null ||
          self.form.pegDiameter == null ||
          self.form.height == null
        ) {
          return 0;
        } else {
          return Math.round(
            parseInt(self.form.height) /
            (parseInt(self.form.yHoleSpacing) + parseInt(self.form.pegDiameter))
          );
        }
      }
    }
  };
</script>

<style>
  .toolbar-title {
    text-align: center;
  }
</style>


<style scoped>
  .Modal {
    overflow-y: auto;
  }
</style>