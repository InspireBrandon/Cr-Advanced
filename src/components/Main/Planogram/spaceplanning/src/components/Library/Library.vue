<template>
  <v-layout row>
    <v-chip draggable="true" @drag="dragMove" @dragstart="dragStart('CHIP')" @dragend="clearDrag"
      class="scrolling-text">
      <div v-if="selectedItem != null">{{ selectedItem.data.name }}</div>
      <div v-else>NOTHING SELECTED</div>
    </v-chip>
    <v-divider vertical></v-divider>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="100" offset-y>
      <v-btn small slot="activator" @click="log">Library</v-btn>
      <v-card width="1000">
        <v-tabs centered color="primary" dark icons-and-text>
          <v-tabs-slider color="white"></v-tabs-slider>

          <v-tab href="#tab-gondola">Fixtures
            <v-icon>format_align_center</v-icon>
          </v-tab>

          <!-- <v-tab v-if="!isFloorplan" href="#tab-fixture">Fixtures
            <v-icon>toc</v-icon>
          </v-tab>

          <v-tab v-if="!isFloorplan" href="#tab-subfixture">Sub Fixtures
            <v-icon>view_quilt</v-icon>
          </v-tab>

          <v-tab href="#tab-obstruction">Obstructions
            <v-icon>no_sim</v-icon>
          </v-tab>

          <v-tab href="#tab-palette">Palettes
            <v-icon>web</v-icon>
          </v-tab> -->

          <v-tab v-if="!isFloorplan" href="#tab-misc">Miscellaneous
            <v-icon>extension</v-icon>
          </v-tab>

          <v-tab href="#tab-custom">Custom
            <v-icon>extension</v-icon>
          </v-tab>

          <v-tab href="#tab-planogram">Planograms
            <v-icon>extension</v-icon>
          </v-tab>

          <!-- GONDOLAS TAB -->
          <v-tab-item value="tab-gondola" class="list-item">
            <v-card flat>
              <FixtureRecursive :addGroup="''" :editGroup="''" :deleteGroup="''" v-for="(fg, idx) in fixtureGroups"
                :key="idx" :fixtureGroup="fg" :parentArr="fixtureGroups" :editFixture="''" :deleteFixture="''" :type="1"
                :openMenuAdd="''" :isEdit="false" :selectedItem="selectedItem" :selectLibraryItem="selectLibraryItem"
                :dragStart="dragStart" :dragMove="dragMove" :clearDrag="clearDrag" :isFloorplan="isFloorplan">
              </FixtureRecursive>
            </v-card>
          </v-tab-item>

          <v-tab-item value="tab-fixture">
            <v-card flat>
              <v-tabs centered color="primary" dark icons-and-text>
                <v-tabs-slider color="white"></v-tabs-slider>
                <v-tab href="#tab-fixture-base">Base
                  <v-icon>remove</v-icon>
                </v-tab>
                <v-tab href="#tab-fixture-shelf">Shelf
                  <v-icon>drag_handle</v-icon>
                </v-tab>
                <v-tab href="#tab-fixture-pegboard">Pegboard
                  <v-icon>border_clear</v-icon>
                </v-tab>
                <v-tab href="#tab-fixture-pegbar">Pegbar
                  <v-icon>border_top</v-icon>
                </v-tab>
                <v-tab href="#tab-fixture-sharebox">Sharebox
                  <v-icon>horizontal_split</v-icon>
                </v-tab>

                <v-tab-item value="tab-fixture-base" class="list-item">
                  <v-list style="max-height: 300px;">
                    <template v-for="(item, index) in fixtureDataArray">
                      <div v-if="item.fixtureType == 0" :key="index">
                        <v-list-tile :key="index" @click="selectLibraryItem(item)"
                          :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                          draggable="true" @drag="dragMove" @dragstart="dragStart('LIBRARY', item)"
                          @dragend="clearDrag">
                          <v-list-tile-content>
                            <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              possible description :
                              {{item.name}}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </div>
                    </template>
                  </v-list>
                </v-tab-item>
                <v-tab-item value="tab-fixture-shelf" class="list-item">
                  <v-list>
                    <template v-for="(item, index) in fixtureDataArray">
                      <div v-if="item.fixtureType == 1" :key="index">
                        <v-list-tile :key="index" @click="selectLibraryItem(item)"
                          :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                          draggable="true" @drag="dragMove" @dragstart="dragStart('LIBRARY', item)"
                          @dragend="clearDrag">
                          <v-list-tile-content>
                            <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              possible description :
                              {{item.name}}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </div>
                    </template>
                  </v-list>
                </v-tab-item>
                <v-tab-item value="tab-fixture-pegboard" class="list-item">
                  <v-list>
                    <template v-for="(item, index) in fixtureDataArray">
                      <div v-if="item.fixtureType == 2" :key="index">
                        <v-list-tile @click="selectLibraryItem(item)"
                          :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                          draggable="true" @drag="dragMove" @dragstart="dragStart('LIBRARY', item)"
                          @dragend="clearDrag">
                          <v-list-tile-content>
                            <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              possible description :
                              {{item.name}}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </div>
                    </template>
                  </v-list>
                </v-tab-item>
                <v-tab-item value="tab-fixture-pegbar" class="list-item">
                  <v-list>
                    <template v-for="(item, index) in fixtureDataArray">
                      <div v-if="item.fixtureType == 3" :key="index">
                        <v-list-tile :key="index" @click="selectLibraryItem(item)"
                          :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                          draggable="true" @drag="dragMove" @dragstart="dragStart('LIBRARY', item)"
                          @dragend="clearDrag">
                          <v-list-tile-content>
                            <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              possible description :
                              {{item.name}}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </div>
                    </template>
                  </v-list>
                </v-tab-item>
                <v-tab-item value="tab-fixture-sharebox" class="list-item">
                  <v-list>
                    <template v-for="(item, index) in fixtureDataArray">
                      <div v-if="item.fixtureType == 4" :key="index">
                        <v-list-tile :key="index" @click="selectLibraryItem(item)"
                          :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                          draggable="true" @drag="dragMove" @dragstart="dragStart('LIBRARY', item)"
                          @dragend="clearDrag">
                          <v-list-tile-content>
                            <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>
                              possible description :
                              {{item.name}}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </div>
                    </template>
                  </v-list>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </v-tab-item>

          <v-tab-item value="tab-subfixture" class="list-item">
            <v-card flat>
              <template v-for="(item, index) in subfixtureDataArray">
                <v-list-tile :key="index" @click="selectLibraryItem(item)"
                  :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                  draggable="true" @drag="dragMove" @dragstart="dragStart('LIBRARY', item)" @dragend="clearDrag">
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      possible description :
                      {{item.name}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-card>
          </v-tab-item>

          <v-tab-item value="tab-obstruction" class="list-item">
            <v-card flat>
              <template v-for="(item, index) in obstructionDataArray">
                <v-list-tile :key="index" @click="selectLibraryItem(item)"
                  :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                  draggable="true" @drag="dragMove" @dragstart="dragStart('LIBRARY', item)" @dragend="clearDrag">
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      possible description :
                      {{item.name}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-card>
          </v-tab-item>

          <v-tab-item value="tab-palette" class="list-item">
            <v-card flat>
              <template v-for="(item, index) in paletteDataArray">
                <v-list-tile :key="index" @click="selectLibraryItem(item)"
                  :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                  draggable="true" @drag="dragMove" @dragstart="dragStart('LIBRARY', item)" @dragend="clearDrag">
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      possible description :
                      {{item.name}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-card>
          </v-tab-item>

          <v-tab-item value="tab-misc" class="list-item">
            <v-card flat>
              <template v-for="(item, index) in miscArray">
                <v-list-tile :key="index" @click="selectLibraryItem(item)"
                  :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                  draggable="true" @drag="dragMove" @dragstart="dragStart('LIBRARY', item)" @dragend="clearDrag">
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      possible description :
                      {{item.name}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-card>
          </v-tab-item>

          <v-tab-item value="tab-custom" class="list-item">
            <v-card flat>
              <v-toolbar dense flat>
                <v-spacer></v-spacer>
                <v-text-field v-model="customSearch" style="width:200px" append-icon="search"></v-text-field>
              </v-toolbar>
              <template v-for="(item, index) in filteredCustomFixtures">
                <v-list-tile :key="index" @click="selectLibraryItem(item)"
                  :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                  draggable="true" @drag="dragMove" @dragstart="dragCustomStart('LIBRARY', item, 'CUSTOM')"
                  @dragend="clearDrag">
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      possible description :
                      {{item.name}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-card>
          </v-tab-item>

          <v-tab-item value="tab-planogram">

            <v-card flat class="list-item">
              <v-toolbar dense flat>
                <v-spacer></v-spacer>
                <v-text-field v-model="searchText" style="width:200px" append-icon="search"></v-text-field>
              </v-toolbar>
              <template v-for="(item, index) in filteredSpacePlans">
                <v-list-tile :key="index" @click="selectLibraryItem(item)"
                  :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                  draggable="true" @drag="dragMove" @dragstart="dragCustomStart('LIBRARY', item, 'CUSTOM_PLANOGRAM')"
                  @dragend="clearDrag">
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      possible description :
                      {{item.name}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-menu>
    <!-- <v-card @click="selectLibraryItem(item)" v-for="(item, idx) in miscArray" draggable :dragStart="dragStart('LIBRARY', item)" :dragMove="dragMove" :clearDrag="clearDrag"
      style="width: 80px; text-align: center; height: 25px; padding-top: 2px;" class="mt-2" :key="idx">Text</v-card> -->
  </v-layout>
</template>
<script>
  import axios from "axios";
  import FixtureRecursive from '@/components/Apps/SpacePlanning/Fixtures/FixtureRecursive.vue'


  export default {
    components: {
      FixtureRecursive
    },
    props: ["isFloorplan", "floorplanFilters"],
    data: () => ({
      fixtureGroups: [],
      fav: true,
      menu: false,
      message: false,
      hints: true,
      gondolaDataArray: [],
      fixtureDataArray: [],
      obstructionDataArray: [],
      subfixtureDataArray: [],
      paletteDataArray: [],
      miscArray: [],
      selectedItem: null,
      customFixtures: [],
      planograms: [],
      searchText: null,
      customSearch: null,
    }),
    mounted() {
      let self = this;
      self.getFixtureGroups();
      self.getLibraryData();
      self.getFixtures();
      self.getPlanograms();
    },
    computed: {
      filteredSpacePlans() {
        if (this.floorplanFilters  == null) {
          return this.planograms.filter(item => {
            if (!this.searchText) return this.planograms;
            return (item.name.toLowerCase().includes(this.searchText.toLowerCase()))
          });
        } else {
          let filterList = this.planograms.filter(item => {
            return (item.name.toLowerCase().includes(this.floorplanFilters.text.toLowerCase()))
          })
          return filterList.filter(item => {
            if (!this.searchText) return filterList;
            return (item.name.toLowerCase().includes(this.searchText.toLowerCase()))
          });
        }

      },
      filteredCustomFixtures() {
        return this.customFixtures.filter(item => {
          if (!this.customSearch) return this.customFixtures;
          return (item.name.toLowerCase().includes(this.customSearch.toLowerCase()))
        });
      }
    },
    methods: {
      log(){
        let self = this
        console.log("isFloorplan",self.isFloorplan);
      },
      getFixtureGroups() {
        let self = this;

        axios.get(process.env.VUE_APP_API + `FixtureGroup?db=CR-Devinspire&parentID=${null}&type=1`)
          .then(r => {
            self.fixtureGroups = [];

            console.log(r.data)

            r.data.fixtureGroups.forEach(fg => {
              self.fixtureGroups.push(new FixtureGroup(fg));
            });
          })
          .catch(e => {
            console.log(e);
          })
      },
      dragCustomStart(where, item, type) {
        let self = this;
        if (where == "CHIP") {
          if (self.selectedItem == null) {
            alert("Please select a library item");
          }
        } else if (where == "LIBRARY") {
          self.selectedItem = {
            type: type,
            data: item
          };
        }

        window.library = self.selectedItem;
      },
      dragStart(where, item) {
        let self = this;
        if (where == "CHIP") {
          if (self.selectedItem == null) {
            alert("Please select a library item");
          }
        } else if (where == "LIBRARY") {
          self.selectLibraryItem(item);
        }

        window.library = self.selectedItem;
      },
      dragMove(ev) {
        ev.currentTarget.style.border = "dashed";
      },
      clearDrag(ev) {
        ev.currentTarget.style.border = "none";
        window.library = null;
      },
      getLibraryData() {
        let self = this;

        axios
          .get(process.env.VUE_APP_API + "fixtureAdvanced?db=cr-devinspire")
          .then(result => {
            // console.log(result);
            if (result.data == null) {
              console.error("[Library] Failed to get library data");
              return;
            }

            self.$store.commit('setFixtures', result.data);

            this.gondolaDataArray = [];
            this.fixtureDataArray = [];
            this.obstructionDataArray = [];
            this.subfixtureDataArray = [];
            this.paletteDataArray = [];

            result.data.forEach(libraryItem => {
              switch (libraryItem.type) {
                case 0: {
                  // gondola
                  self.gondolaDataArray.push(libraryItem);
                }
                break;
              case 1: {
                // obstruction
                self.obstructionDataArray.push(libraryItem);
              }
              break;
              case 2: {
                // fixture
                self.fixtureDataArray.push(libraryItem);
              }
              break;
              case 3: {
                // subfixture
                self.subfixtureDataArray.push(libraryItem);
              }
              break;
              case 4: {
                // subfixture
                self.paletteDataArray.push(libraryItem);
              }
              case 5: {
                // subfixture
                self.subfixtureDataArray.push(libraryItem);
              }
              break;
              }
            });

            self.miscArray.push({
                type: "textheader",
                id: 9999,
                name: 'Text header',
                description: 'Free transform text header',
                width: 100,
                height: 20,
                depth: 100,
                color: 'transparent'
              },
              /*{
                type:"area",
                id: 99991,
                name:'Area',
                description: 'A container that allows for grouping fixtures',
                width: 91.4,
                height: 100,
                depth: 100,
                color: 'red'
              }*/
            )
          });
      },
      selectLibraryItem(item) {
        let self = this;
        let strType = "";

        switch (item.type) {
          case 0: {
            // gondola
            strType = "GONDOLA";
          }
          break;
        case 1: {
          // Obstruction
          strType = "OBSTRUCTION";
        }
        break;
        case 2: {
          // fixture
          switch (item.fixtureType) {
            case 0: {
              // base
              strType = "BASE";
            }
            break;
          case 1: {
            // shelf
            strType = "SHELF";
          }
          break;
          case 2: {
            // pegboard
            strType = "PEGBOARD";
          }
          break;
          case 3: {
            // pegbar
            strType = "PEGBAR";
          }
          break;
          case 4: {
            // sharebox
            strType = "SHAREBOX";
          }
          break;
          }
        }
        break;
        case 3: {
          // sub fixture
          switch (item.fixtureType) {
            case 0: {
              // base
              strType = "PEG";
            }
            break;
          case 1: {
            // shelf
            strType = "BASKET";
          }
          break;
          case 3: {
            // shelf
            strType = "AREA";
          }
          break;
          case 4: {
            // label holder
            strType = "LABELHOLDER";
          }
          break;
          }
        }
        break;
        case 4: {
          // palettes
          strType = "PALETTE";
        }
        break;
        }

        if (item.type == "textheader") {
          strType = "TEXTHEADER"
        }

        self.selectedItem = {
          type: strType,
          data: item
        };
      },
      getFixtures() {
        let self = this;

        self.spaceData = [];

        axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=FIXTURES")
          .then(r => {
            self.customFixtures = r.data;
          })
          .catch(e => {
            alert("Failed to get data...");
          })
      },
      getPlanograms() {
        let self = this;

        self.spaceData = [];

        axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Space Planning")
          .then(r => {
            self.planograms = r.data;
            console.log("self.planograms ", self.planograms);
          })
          .catch(e => {
            alert("Failed to get data...");
          })
      },
    }

  };

  function FixtureGroup(params) {
    let self = this;
    self.id = params.id;
    self.parentID = params.parentID;
    self.name = params.name;
    self.type = params.type;
    self.children = [];
    self.fixtures = params.fixtures;
    self.showChildren = false;
  }
</script>
<style scoped>
  .active-item {
    background-color: #b0efb0;
  }

  .inactive-item {
    background-color: white;
  }

  .list-item {
    max-height: 300px;
    overflow-x: auto;
  }
</style>

<style>
  .scrolling-text {
    width: 150px;
    overflow: hidden;
    position: relative;
  }

  .scrolling-text div {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    line-height: 2.5em;
    text-align: center;
    /* Starting position */
    -moz-transform: translateX(100%);
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    /* Apply animation to this element */
    -moz-animation: scroll-left 7s linear infinite;
    -webkit-animation: scroll-left 7s linear infinite;
    animation: scroll-left 7s linear infinite;
  }

  /* Move it (define the animation) */
  @-moz-keyframes scroll-left {
    0% {
      -moz-transform: translateX(100%);
    }

    100% {
      -moz-transform: translateX(-100%);
    }
  }

  @-webkit-keyframes scroll-left {
    0% {
      -webkit-transform: translateX(100%);
    }

    100% {
      -webkit-transform: translateX(-100%);
    }
  }

  @keyframes scroll-left {
    0% {
      -moz-transform: translateX(100%);
      /* Browser bug fix */
      -webkit-transform: translateX(100%);
      /* Browser bug fix */
      transform: translateX(100%);
    }

    100% {
      -moz-transform: translateX(-100%);
      /* Browser bug fix */
      -webkit-transform: translateX(-100%);
      /* Browser bug fix */
      transform: translateX(-100%);
    }
  }
</style>