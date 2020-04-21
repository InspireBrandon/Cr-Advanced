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
      <v-container class="mx-0" style="height: calc(100vh - 65px); overflow-x: auto; max-width: 100%;" grid-list-md>
        <v-layout row wrap>
          <v-flex lg4 md12>
            <v-card class="elevation-5">
              <v-toolbar dense>
                <v-toolbar-title class="toolbar-title">Properties</v-toolbar-title>
              </v-toolbar>
              <v-container grid-list-md class="card-height">
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
                  <v-flex lg8 md12 sm12 xs12
                    v-if="!newData.rendering && !(newData.fixtureType == 0 && newData.type == 3)">
                    <v-select placeholder="please select" :items="spreadProducts" v-model="newData.spreadProducts"
                      label="Spread products:">
                    </v-select>
                  </v-flex>

                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering && newData.fixtureType==4&&newData.type==3">
                    <v-checkbox hide-details label="Float" v-model="newData.float"></v-checkbox>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering && newData.type == 2">
                    <v-checkbox hide-details label="Border" v-model="newData.border"></v-checkbox>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!newData.rendering && newData.type == 2">
                    <v-checkbox hide-details label="Stackable" v-model="newData.stackable"></v-checkbox>
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
                    <v-checkbox hide-details label="Reject Products" v-model="newData.rejectProducts"></v-checkbox>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 class="mt-3">
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
              <v-container grid-list-md class="card-height">
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
                  <v-flex lg8 md12 sm12 xs12
                    v-if="(newData.fixtureType==1&&newData.type==2||newData.fixtureType==0&&newData.type==2 ||newData.fixtureType==1&&newData.type==3 ||newData.fixtureType==3&&newData.type==2 || newData.fixtureType==4&&newData.type==3 || newData.fixtureType==0&&newData.type==3)">
                    <v-text-field type="number" v-model="newData.merchandisingOffset" suffix="cm"
                      label="Merchandising Offset:"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12
                    v-if="!newData.rendering && (newData.type == 2 && (newData.fixtureType == 0 || newData.fixtureType == 1))">
                    <v-text-field type="number" v-model="newData.overhang" label="Overhang:" suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12
                    v-if="!newData.rendering && ((newData.fixtureType == 4 || newData.fixtureType == 3 || newData.fixtureType == 0 || newData.fixtureType == 1) && (newData.type == 2 || newData.type == 3))">
                    <v-text-field type="number" v-model="newData.productOffset" label="Product offset:" suffix="cm">
                    </v-text-field>
                  </v-flex>
                  <v-flex lg8 md12
                    v-if="!newData.rendering && ((newData.fixtureType == 4 || newData.fixtureType == 3 || newData.fixtureType == 0 || newData.fixtureType == 1) && (newData.type == 2 || newData.type == 3))">
                    <v-text-field type="number" v-model="newData.x_Offset" label="X Offset:" suffix="cm">
                    </v-text-field>
                  </v-flex>
                  <v-flex lg8 md12
                    v-if="!newData.rendering && ((newData.fixtureType == 4 || newData.fixtureType == 3 || newData.fixtureType == 0 || newData.fixtureType == 1) && (newData.type == 2 || newData.type == 3))">
                    <v-text-field type="number" v-model="newData.z_Offset" label="Z Offset:" suffix="cm">
                    </v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="!newData.rendering && (newData.fixtureType == 0 && newData.type == 3)">
                    <v-text-field type="number" v-model="newData.productCascade" label="Product cascade:" suffix="cm">
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
                  <v-flex lg8 md12 v-if="newData.fixtureType == 2 && !newData.rendering">
                    <v-text-field type="number" v-model="newData.facingOffsetX" label="Facing Offset Horizontal:"
                      suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 v-if="newData.fixtureType == 2 && !newData.rendering">
                    <v-text-field type="number" v-model="newData.facingOffsetY" label="Facing Offset Vertical:"
                      suffix="cm"></v-text-field>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12
                    v-if="newData.spreadProducts!='SFE'&&(!newData.rendering && newData.type == 2 && newData.fixtureType != 2 || newData.fixtureType==4&&newData.type==3)">
                    <v-checkbox hide-details label="Squish" v-model="newData.squish"></v-checkbox>
                  </v-flex>

                  <v-flex lg8 md12 sm12 xs12
                    v-if="(!newData.rendering && newData.squish) && (newData.type == 2 && newData.fixtureType != 2 || newData.fixtureType==4&&newData.type==3)">
                    <v-checkbox hide-details label="Auto Squish" v-model="newData.autoSquish"></v-checkbox>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12
                    v-if="(!newData.rendering && newData.squish && !newData.autoSquish) && (newData.type == 2 && newData.fixtureType != 2 || newData.fixtureType==4&&newData.type==3)">
                    <v-text-field hide-details v-if="!newData.rendering" v-model="newData.squishAmount"
                      label="Squish Amount:"></v-text-field>
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
                  <v-flex v-if="!newData.rendering && renderingType0.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select @change="onRenderingChange(0)" return-object item-text="name" placeholder="please select"
                      :items="renderingType0" v-model="newData.RenderingsItems.LabelHolder" label="Label Holder:">
                    </v-select>
                    <div style="display: flex">
                      <div style="width: 25%;">
                        <v-text-field type="number" v-if="newData.RenderingsItems.LabelHolder != null" label="Height"
                          v-model="newData.RenderingsItems.LabelHolder.height"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.LabelHolder != null" label="Width"
                          v-model="newData.RenderingsItems.LabelHolder.width"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.LabelHolder != null" label="Depth"
                          v-model="newData.RenderingsItems.LabelHolder.depth"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.LabelHolder != null" label="Y Offset"
                          v-model="newData.RenderingsItems.LabelHolder.yOffset"></v-text-field>
                      </div>
                    </div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex v-if="!newData.rendering &&renderingType1.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select return-object item-text="name" placeholder="please select" :items="renderingType1"
                      v-model="newData.RenderingsItems.ShelfEdge" label="Shelf Edge:"></v-select>
                    <div style="display: flex">
                      <div style="width: 25%;">
                        <v-text-field type="number" v-if="newData.RenderingsItems.ShelfEdge != null" label="Height"
                          v-model="newData.RenderingsItems.ShelfEdge.height"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.ShelfEdge != null" label="Width"
                          v-model="newData.RenderingsItems.ShelfEdge.width"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.ShelfEdge != null" label="Depth"
                          v-model="newData.RenderingsItems.ShelfEdge.depth"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.ShelfEdge != null" label="Y Offset"
                          v-model="newData.RenderingsItems.ShelfEdge.yOffset"></v-text-field>
                      </div>
                    </div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex v-if="!newData.rendering &&renderingType2.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select return-object item-text="name" placeholder="please select" :items="renderingType2"
                      v-model="newData.RenderingsItems.Back" label="Back Face:"></v-select>
                    <div style="display: flex">
                      <div style="width: 25%;">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Back != null" label="Height"
                          v-model="newData.RenderingsItems.Back.height"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Back != null" label="Width"
                          v-model="newData.RenderingsItems.Back.width"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Back != null" label="Depth"
                          v-model="newData.RenderingsItems.Back.depth"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Back != null" label="Y Offset"
                          v-model="newData.RenderingsItems.Back.yOffset"></v-text-field>
                      </div>
                    </div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex v-if="!newData.rendering &&renderingType3.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select return-object item-text="name" placeholder="please select" :items="renderingType3"
                      v-model="newData.RenderingsItems.Front" label="Front Face:"></v-select>
                    <div style="display: flex">
                      <div style="width: 25%;">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Front != null" label="Height"
                          v-model="newData.RenderingsItems.Front.height"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Front != null" label="Width"
                          v-model="newData.RenderingsItems.Front.width"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Front != null" label="Depth"
                          v-model="newData.RenderingsItems.Front.depth"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Front != null" label="Y Offset"
                          v-model="newData.RenderingsItems.Front.yOffset"></v-text-field>
                      </div>
                    </div>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex v-if="!newData.rendering &&renderingType4.length>1" lg8 md12 sm12 xs12 class="px-3">
                    <v-select return-object item-text="name" placeholder="please select" :items="renderingType4"
                      v-model="newData.RenderingsItems.Side" label="Side Face:"></v-select>
                    <div style="display: flex">
                      <div style="width: 25%;">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Side != null" label="Height"
                          v-model="newData.RenderingsItems.Side.height"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Side != null" label="Width"
                          v-model="newData.RenderingsItems.Side.width"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Side != null" label="Depth"
                          v-model="newData.RenderingsItems.Side.depth"></v-text-field>
                      </div>
                      <div style="width: 25%;" class="ml-1">
                        <v-text-field type="number" v-if="newData.RenderingsItems.Side != null" label="Y Offset"
                          v-model="newData.RenderingsItems.Side.yOffset"></v-text-field>
                      </div>
                    </div>
                    <v-divider></v-divider>
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
        segments: [],
        generalPanel: [true],
        renderingPanel: [false],
        renderingPanel2: [false],
        renderingPanel3: [false],
        renderingPanel4: [false],
        renderingPanel5: [false],
        modalShow: false,
        newData: null,
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
          },
          {
            text: 'Label Holder',
            value: 4,
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
          },
          {
            text: 'Area',
            value: 3
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
      getRenderingTypes() {
        let self = this;
        axios
          .get(
            process.env.VUE_APP_API +
            `Renderings?db=CR-Devinspire&type=${self.newData.type}&subType=${self.newData.fixtureType}`
          )
          .then(r => {
            self.renderingType0 = [{
              name: "none",
              id: -1
            }];
            self.renderingType1 = [{
              name: "none",
              id: -1
            }];
            self.renderingType2 = [{
              name: "none",
              id: -1
            }];
            self.renderingType3 = [{
              name: "none",
              id: -1
            }];
            self.renderingType4 = [{
              name: "none",
              id: -1
            }];

            r.data.forEach(rendering => {
              switch (rendering.renderingType) {
                case 0: {
                  self.renderingType0.push(rendering);
                }
                break;
              case 1: {
                self.renderingType1.push(rendering);
              }
              break;
              case 2: {
                self.renderingType2.push(rendering);
              }
              break;
              case 3: {
                self.renderingType3.push(rendering);
              }
              break;

              case 4: {
                self.renderingType4.push(rendering);
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

        // axios.get(process.env.VUE_APP_API + `FixtureRenderingLink?db=CR-Devinspire&Fixture_ID=${self.newData.id}`)
        //   .then(r => {
        //     // self.newData.image = r.data;
        //     r.data.forEach(item => {
        //       switch (item.renderingType) {
        //         case 0: {
        //           self.selectedRenderingType0 = item.id;
        //         }
        //         break;
        //       case 1: {
        //         self.selectedRenderingType1 = item.id;
        //       }
        //       break;
        //       case 2: {
        //         self.selectedRenderingType2 = item.id;
        //       }
        //       break;
        //       case 3: {
        //         self.selectedRenderingType3 = item.id;
        //       }
        //       break;
        //       case 4: {
        //         self.selectedRenderingType4 = item.id;
        //       }
        //       break;
        //       default:
        //         break;
        //       }
        //     });
        //   })
        //   .catch(e => {
        //     console.log(e);
        //   });
      },
      addSegment() {
        let self = this;

        self.segments.push(new Segment(self.newData.height, self.newData.width, self.segments.length));
      },
      removeSegment(segment) {
        let self = this;

        self.segments.splice(self.segments.indexOf(segment), 1);
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
          self.newData.uploadSide = false
          self.newData.uploadTop = false

          self.newData.labelsOn = self.newData.labelsOn == undefined || self.newData.labelsOn == null ? true : self
            .newData
            .labelsOn;

          self.getRenderingTypes()
          self.getSelectedRenderings()

          if (self.newData.squish != null && self.newData.spreadProducts != null) {
            self.newData.squish == false
          }
          if (self.newData.squish == true) {
            self.newData.spreadProducts = 'L2R'
          }

          if (self.newData.productRenderingMargin == undefined || self.newData.productRenderingMargin == null) {
            self.newData.productRenderingMargin = 15;
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
          if (self.newData.merchandisingOffset == null || self.newData.merchandisingOffset == undefined) {
            self.newData.merchandisingOffset = 0
          }
          // self.newData.countsAs = {};
          // self.newData.countsAs.description = self.newData.name
          // self.newData.countsAs.value = 1
          self.newData.color = {
            hex: self.newData.color == undefined ? "#fff" : self.newData.color
          }
          self.newData.pegHoleColor = {
            hex: self.newData.color == undefined ? "#fff" : self.newData.color
          }

          self.newData.frontColor = {
            hex: self.newData.frontColor == undefined ? "#fff" : self.newData.frontColor
          }

          self.newData.backColor = {
            hex: self.newData.backColor == undefined ? "#fff" : self.newData.backColor
          }

          self.newData.topColor = {
            hex: self.newData.topColor == undefined ? "#fff" : self.newData.topColor
          }

          self.newData.bottomColor = {
            hex: self.newData.bottomColor == undefined ? "#fff" : self.newData.bottomColor
          }

          self.newData.leftColor = {
            hex: self.newData.leftColor == undefined ? "#fff" : self.newData.leftColor
          }

          self.newData.rightColor = {
            hex: self.newData.rightColor == undefined ? "#fff" : self.newData.rightColor
          }

          self.$nextTick(() => {
            // if (self.newData.fixtureType == 1 && self.newData.type == 3) {
            //   if (self.newData.RenderingsItems.Front.image != undefined && self.newData.RenderingsItems.Front .image != null)
            //     self.$refs.changeRenderImage.src = 'data:image/png;base64,' + self.newData.RenderingsItems.Front .image;
            //   else
            //     self.$refs.changeRenderImage.src = '';
            // }

            // if (self.newData.image != undefined && self.newData.image != null)
            //   self.$refs.changeImage.src = 'data:image/png;base64,' + self.newData.image;
            // else
            //   self.$refs.changeImage.src = '';

            // if (self.newData.barImage != undefined && self.newData.barImage != null)
            //   self.$refs.changeImageBar.src = 'data:image/png;base64,' + self.newData.barImage;
            // else

            //   self.$refs.changeImageBar.src = '';
            // if (self.newData.fixtureType == 1 && self.newData.type == 2 || self.newData.fixtureType == 3 && self
            //   .newData
            //   .type == 2 ||
            //   self.newData.fixtureType == 0 && self.newData.type == 2) {
            //   if (self.newData.RenderingsItems.LabelHolder.image != undefined && self.newData.RenderingsItems
            //     .LabelHolder
            //     .image != null)
            //     self.$refs.changeImageLabel.src = 'data:image/png;base64,' + self.newData.RenderingsItems
            //     .LabelHolder
            //     .image;
            //   else

            //     self.$refs.changeImageLabel.src = '';
            // }

            // if (self.newData.fixtureType == 1 && self.newData.type == 2) {
            //   if (self.newData.RenderingsItems.ShelfEdge.image != undefined && self.newData.RenderingsItems
            //     .ShelfEdge
            //     .image != null)
            //     self.$refs.changeImageShelfEdge.src = 'data:image/png;base64,' + self.newData.RenderingsItems
            //     .ShelfEdge
            //     .image;
            //   else

            //     self.$refs.changeImageShelfEdge.src = '';
            // }

            // if (self.newData.fixtureType == 1 && self.newData.type == 3 || self.newData.fixtureType == 1 && self
            //   .newData
            //   .type == 2 ||
            //   self.newData.fixtureType == 0 && self.newData.type == 2) {
            //   if (self.newData.RenderingsItems.Back.image != undefined && self.newData.RenderingsItems.Back.image !=
            //     null)
            //     self.$refs.RenderBackImage.src = 'data:image/png;base64,' + self.newData.RenderingsItems.Back.image;
            //   else
            //     self.$refs.RenderBackImage.src = '';
            // }

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

        if (self.newData.fixtureType == 2 || self.newData.fixtureType == 3) {
          if (self.tmpPegs != null && self.tmpPegs.length > 0) {
            self.tmpPegs.forEach(element => {
              if (element.id == self.newData.defaultPeg) {
                self.newData.defaultPegDetails = element;
              }
            });
          }
        }
        if (self.newData.merchandisingOffset == null || self.newData.merchandisingOffset == undefined) {
          self.newData.merchandisingOffset = 0
        }
        self.newData.merchandisingOffset = returnFloat(self.newData.merchandisingOffset);
        self.newData.height = returnFloat(self.newData.height);
        self.newData.width = returnFloat(self.newData.width);
        self.newData.depth = returnFloat(self.newData.depth);
        self.newData.fixtureSpacing = returnFloat(self.newData.fixtureSpacing);
        self.newData.merchHeight = returnFloat(self.newData.merchHeight);
        self.newData.xHoleSpacing = returnFloat(self.newData.xHoleSpacing);
        self.newData.yHoleSpacing = returnFloat(self.newData.yHoleSpacing);
        self.newData.overhang = returnFloat(self.newData.overhang);
        self.newData.productOffset = returnFloat(self.newData.productOffset);
        self.newData.productCascade = returnFloat(self.newData.productCascade);
        self.newData.squishAmount = returnFloat(self.newData.squishAmount);
        self.newData.facingOffsetX = returnFloat(self.newData.facingOffsetX);
        self.newData.facingOffsetY = returnFloat(self.newData.facingOffsetY);
        self.newData.rejectProducts = self.newData.rejectProducts;
        self.newData.z_Offset = self.newData.z_Offset;
        self.newData.x_Offset = self.newData.x_Offset;

        if (self.newData.productRenderingMargin == undefined || self.newData.productRenderingMargin == null) {
          self.newData.productRenderingMargin = 15;
        }

        var fixtureObj = {
          fixtureConfig: self.config,
          fixtureData: self.newData
        };

        event.modal_saved(EventBus, self.type, self.subType, self.newData, self.id, self.fixtureObj);

        self.destroy();
      },
      imgsrc(type) {
        let self = this
        if (self.floorplanFixture != null) {
          return process.env.VUE_APP_API + `FloorplanFixture?mapImageID=${self.floorplanFixture.id}&type=${type}`
        } else {
          return ''
        }

      },
      deleteFixture() {

        let self = this;
        self.$refs.yesNo.show('Delete this Fixture?', goThrough => {
          if (goThrough) {
            let event = new CustomEmitter();
            event.delete_gondola(EventBus, self.newData, self.fixtureObj);
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
      onRenderingChange(rendering) {
        let self = this;

        self.$nextTick(() => {
          switch (rendering) {
            case 0: {

            }
            break;
          }
        })
      }
    }
  }

  function Segment(totalHeight, width, segmentCount) {
    let self = this;
    self.height = totalHeight / (segmentCount + 2);
    self.width = width;
  }
</script>

<style scoped>
  .card-height {
    height: calc(100vh - 170px);
    overflow: auto;
  }
</style>