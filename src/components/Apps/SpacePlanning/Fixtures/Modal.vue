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
                      label="Label order:">
                    </v-select>
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
                      label="Type:">
                    </v-select>
                    <v-select placeholder="please select" v-if="form.type == 2" :items="fixtureTypes"
                      v-model="form.fixtureType" label="Type:">
                    </v-select>
                    <v-select placeholder="please select" v-if="form.type == 3" :items="subTypes"
                      v-model="form.fixtureType" label="Subtype:">
                    </v-select>
                    <v-select placeholder="please select" v-if="form.type == 0  && form.rendering"
                      :items="renderingTypeGondola" v-model="form.renderingType" label="Rendering Type:">
                    </v-select>
                    <v-select placeholder="please select"
                      v-if="form.type == 2 && form.fixtureType == 1 || form.type == 3 && form.fixtureType == 4 && form.rendering"
                      :items="renderingTypeShelf" v-model="form.renderingType" label="Rendering Type:">
                    </v-select>

                    <v-select placeholder="please select"
                      v-if="form.type == 3 && form.fixtureType == 3 && form.rendering" :items="renderingTypeArea"
                      v-model="form.renderingType" label="Rendering Type:">
                    </v-select>

                    <v-select placeholder="please select"
                      v-if="form.type == 2 && form.fixtureType == 0 && form.rendering" :items="renderingTypeBase"
                      v-model="form.renderingType" label="Rendering Type:">
                    </v-select>
                    <v-select placeholder="please select"
                      v-if="form.type == 2 && form.fixtureType == 3 && form.rendering" :items="renderingTypePegBar"
                      v-model="form.renderingType" label="Rendering Type:">
                    </v-select>
                    <v-select placeholder="please select"
                      v-if="form.type == 3 && form.fixtureType == 1 && form.rendering" :items="renderingTypeBasket"
                      v-model="form.renderingType" label="Rendering Type:">
                    </v-select>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!form.rendering">
                    <v-select placeholder="please select"
                      v-if="(form.fixtureType == 2 || form.fixtureType == 3) && form.type == 2" :items="pegs"
                      v-model="form.defaultPeg" label="Default peg:">
                    </v-select>
                  </v-flex>
                  <v-flex lg8 md12 sm12 xs12 v-if="!form.rendering">
                    <v-select placeholder="please select" :items="SpreadProducts" v-model="form.spreadProducts"
                      label="Spread products:">
                    </v-select>
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
                  <v-flex lg8 md12 v-if="!form.rendering">
                    <v-text-field type="number" v-model="form.depth" label="Depth:" suffix="cm"></v-text-field>
                  </v-flex>
                  <!-- <v-flex lg8 md12 sm12 xs12
                    v-if="(form.fixtureType==1&&form.type==2||form.fixtureType==0&&form.type==2 ||form.fixtureType==1&&form.type==3 ||form.fixtureType==3&&form.type==2 || form.fixtureType==4&&form.type==3)">
                    <v-text-field type="number" v-model="form.height" suffix="cm"
                      label="Merchandising Offset:"></v-text-field>
                  </v-flex> -->
                  <v-flex lg8 md12
                    v-if="!form.rendering && (form.type == 2 && (form.fixtureType == 0 || form.fixtureType == 1))">
                    <v-text-field type="number" v-model="form.overhang" label="Overhang:" suffix="cm"></v-text-field>
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
                  </v-flex> -->
                  <!-- <v-flex lg8 md12
                    v-if="!form.rendering && (form.type == 2 && (form.fixtureType == 0 || form.fixtureType == 1))">
                    <v-text-field type="number" v-model="form.overhang" label="Overhang:" suffix="cm"></v-text-field>
                  </v-flex> -->
                  <!-- <v-flex lg8 md12 v-if="!form.rendering && form.fixtureType == 3">
                    <v-text-field type="number" v-model="form.productOffset" label="Product offset:" suffix="cm">
                    </v-text-field>
                  </v-flex> -->
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
              <v-container style="text-align: center;" grid-list-md>
                <v-layout row wrap>
                  <v-flex md3>
                    <div>Top</div>
                  </v-flex>
                  <v-flex lg12 md12 sm12 xs12>
                    <h3>Image</h3>
                    <v-card class="elevation-5" @click="openFileExplorer"
                      style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                      <img ref="changeImage" style="max-height: 150px; max-width: 150px;" src="" alt="">
                    </v-card>
                    <input ref="fileInput" style="display: none" @change="imageChange" type="file">
                  </v-flex>
                  <v-flex lg12 md12 sm12 xs12>
                    <div v-show="form.type == 2 && (form.fixtureType == 0 || form.fixtureType == 1) && !form.rendering">
                      <h3>Bar image</h3>
                      <v-card class="elevation-5" @click="openFileExplorerBar"
                        style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                        <img ref="changeImageBar" style="max-height: 150px; max-width: 150px;" src="" alt="">
                      </v-card>
                      <input ref="fileInputBar" style="display: none" @change="imageChangeBar" type="file">
                    </div>
                  </v-flex>
                  <v-flex lg12 md12 sm12 xs12>
                    <div v-if="!form.rendering">
                      <h3>Colour</h3>
                      <compact-picker style="margin: 0 auto;" v-model="form.color" />
                    </div>
                  </v-flex>
                  <v-flex lg12 md12 sm12 xs12>
                    <div v-if="form.type == 2 && form.fixtureType == 2 && !form.rendering">
                      <h3>Peg Hole Colour</h3>
                      <compact-picker style="margin: 0 auto;" v-model="form.pegHoleColor" />
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
  import axios from 'axios';
  import {
    Compact
  } from 'vue-color'

  export default {
    components: {
      'compact-picker': Compact
    },
    created() {
      let self = this;

      axios.get(process.env.VUE_APP_API + "Fixture?db=CR-Devinspire&type=3&subType=0")
        .then(r => {
          let pegs = r.data;

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
    name: 'FixturesModal',
    data() {
      return {
        fixtureGroups: [],
        isSubtype: false,
        dialog: false,
        afterEdit: null,
        afterAdd: null,
        isAdd: true,
        SpreadProducts: [{
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
            text: 'Share box',
            value: 4
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
          },
          {
            text: 'Label Holder',
            value: 4,
          }
        ],
        renderingTypeShelf: [{
            text: 'Label Holder',
            value: 0
          },
          {
            text: 'Shelf Edge',
            value: 1
          }, {
            text: 'Back Face',
            value: 2
          }
        ],
        renderingTypeBase: [{
            text: 'Label Holder',
            value: 0
          },
          {
            text: 'Back Face',
            value: 2
          }
        ],
        renderingTypeArea: [{
            text: 'Front Face',
            value: 3
          },
          {
            text: 'Back Face',
            value: 2
          }
        ],
        renderingTypeGondola: [{
          text: 'Front Face',
          value: 3
        }, ],
        renderingTypePegBar: [{
          text: 'Label Holder',
          value: 0
        }],
        renderingTypeBasket: [
          // {
          //   text: 'Back Face',
          //   value: 2
          // },
          {
            text: 'Front Face',
            value: 3
          },
        ],
        pegs: [],
        fixtureLabelOrders: [{
          text: "Top to bottom",
          value: 0
        }, {
          text: "Bottom to top",
          value: 1
        }],
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
          squishAmount: null
        },
        showModal: false
      }
    },
    methods: {
      getFixtureGroups() {
        let self = this;

        axios.get(process.env.VUE_APP_API + "FixtureGroup?db=CR-Devinspire")
          .then(r => {
            self.fixtureGroups = r.data;
          })
          .catch(e => {
            console.log(e);
          })
      },
      openAdd(type, afterAdd) {
        let self = this;

        this.isAdd = true;
        this.afterAdd = afterAdd;

        self.getFixtureGroups();

        for (var prop in this.form) {
          this.form[prop] = null;
        }

        this.form.color = {
          hex: "#fff"
        }

        this.form.pegHoleColor = {
          hex: "#000"
        }

        this.form.wireMesh = false;
        this.form.type = type;

        this.$refs.changeImage.src = '';
        this.$refs.changeImageBar.src = '';

        if (type == 5)
          this.form.rendering = true

        this.dialog = true;
      },
      openEdit(fixture, afterEdit) {
        let self = this;
        self.getFixtureGroups();
        self.getFixtureImage(fixture.id);

        for (var prop in this.form) {
          this.form[prop] = fixture[prop];
        }

        this.form.color = {
          hex: fixture.color
        }

        this.form.pegHoleColor = {
          hex: fixture.color
        }
        if (self.form.squish == true) {
          self.form.spreadProducts = 'L2R'
        }
        if (self.form.squish != null && self.form.spreadProducts != null) {
          self.form.squish == false
        }
        self.form.pegDiameter = self.form.pegRadius * 2;

        if (fixture.image != undefined && fixture.image != null)
          self.$refs.changeImage.src = 'data:image/png;base64,' + fixture.image;
        else
          self.$refs.changeImage.src = '../../../../static/img/image-placeholder.png';

        if (fixture.barImage != undefined && fixture.barImage != null)
          self.$refs.changeImageBar.src = 'data:image/png;base64,' + fixture.barImage;
        else
          self.$refs.changeImageBar.src = '../../../../static/img/image-placeholder.png';

        this.isAdd = false;
        this.afterEdit = afterEdit;
        this.dialog = true;
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
      imageChangeBar(e) {
        let self = this;

        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          self.$refs.changeImageBar.src = url;
          self.blobToArrayBuffer(file, result => {
            self.form.barImage = Array.from(new Uint8Array(result));
          })
        })
      },
      imageChange(e) {
        let self = this;

        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          self.$refs.changeImage.src = url;
          self.blobToArrayBuffer(file, result => {
            self.form.image = Array.from(new Uint8Array(result));
          })
        })
      },
      getFixtureImage(id) {
        let self = this;

        axios.get(process.env.VUE_APP_API + "FixtureImage?db=CR-Devinspire&id=" + id)
          .then(r => {
            // self.form.image = r.data;

            if (r.data != undefined && r.data != null)
              self.$refs.changeImage.src = 'data:image/png;base64,' + r.data;
          })
          .catch(e => {
            console.log(e);
          })
      },
      blobToArrayBuffer(blob, callback) {
        var a = new FileReader();
        a.onload = function (e) {
          callback(a.result);
        }
        a.readAsArrayBuffer(blob);
      },
      blobToDataUrl(blob, callback) {
        var a = new FileReader();
        a.onload = function (e) {
          callback(a.result);
        }
        a.readAsDataURL(blob);
      },
      submit() {
        let self = this;

        console.log(self.form.color);

        self.form.color = self.form.color.hex == undefined ? '#fff' : self.form.color.hex;
        self.form.pegHoleColor = self.form.pegHoleColor.hex == undefined ? "#000" : self.form.pegHoleColor.hex;

        console.log(this.isAdd)

        if (this.isAdd) {
          axios.post(process.env.VUE_APP_API + "Fixture?db=CR-Devinspire", self.form)
            .then(r => {
              this.afterAdd(r.data);
              this.dialog = false;
            })
            .catch(e => {

            })
        } else {
          axios.put(process.env.VUE_APP_API + "Fixture?db=CR-Devinspire", self.form)
            .then(r => {
              this.afterEdit(self.form);
              this.dialog = false;
            })
            .catch(e => {

            })
        }
      },
      setDiameter() {
        this.form.pegDiameter = this.form.pegRadius * 2;
      },
      setRadius() {
        this.form.pegRadius = this.form.pegDiameter / 2;
      }
    },
    computed: {
      diameter() {
        return this.form.radius * 2;
      },
      calculateHolesX() {
        let self = this;
        if (self.form.xHoleSpacing == null || self.form.pegDiameter == null || self.form.width == null) {
          return 0;
        } else {
          return Math.round((parseInt(self.form.width) / (parseInt(self.form.xHoleSpacing) + parseInt(self.form
            .pegDiameter))));
        }
      },
      calculateHolesY() {
        let self = this;
        if (self.form.yHoleSpacing == null || self.form.pegDiameter == null || self.form.height == null) {
          return 0;
        } else {
          return Math.round((parseInt(self.form.height) / (parseInt(self.form.yHoleSpacing) + parseInt(self.form
            .pegDiameter))));
        }
      }
    }
  }
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