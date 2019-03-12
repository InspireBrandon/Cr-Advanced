<template>
  <v-layout row>
    <v-chip
      draggable="true"
      @drag="dragMove"
      @dragstart="dragStart('CHIP')"
      @dragend="clearDrag"
      class="scrolling-text"
    >
      <div v-if="selectedItem != null">{{ selectedItem.data.name }}</div>
      <div v-else>NOTHING SELECTED</div>
    </v-chip>
    <v-divider vertical></v-divider>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
      <v-btn small slot="activator">Library</v-btn>
      <v-card>
        <v-tabs centered color="primary" dark icons-and-text>
          <v-tabs-slider color="white"></v-tabs-slider>

          <v-tab href="#tab-gondola">Gondolas
            <v-icon>format_align_center</v-icon>
          </v-tab>

          <v-tab href="#tab-fixture">Fixtures
            <v-icon>toc</v-icon>
          </v-tab>

          <v-tab href="#tab-subfixture">Sub Fixtures
            <v-icon>view_quilt</v-icon>
          </v-tab>

          <v-tab href="#tab-obstruction">Obstructions
            <v-icon>no_sim</v-icon>
          </v-tab>

          <v-tab href="#tab-palette">Palettes
            <v-icon>web</v-icon>
          </v-tab>
          
          <v-tab href="#tab-misc">Miscellaneous
            <v-icon>extension</v-icon>
          </v-tab>

          <!-- GONDOLAS TAB -->
          <v-tab-item value="tab-gondola" class="list-item">
            <v-card flat>
              <v-list>
                <template v-for="(item, index) in gondolaDataArray">
                  <v-list-tile
                    :key="index"
                    @click="selectLibraryItem(item)"
                    :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                    draggable="true"
                    @drag="dragMove"
                    @dragstart="dragStart('LIBRARY', item)"
                    @dragend="clearDrag"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>{{item.name}}</v-list-tile-title>
                      <v-list-tile-sub-title>
                        possible description :
                        {{item.name}}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-list>
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

                <v-tab-item value="tab-fixture-base" class="list-item">
                  <v-list style="max-height: 300px;">
                    <template v-for="(item, index) in fixtureDataArray">
                      <div v-if="item.fixtureType == 0" :key="index">
                        <v-list-tile
                          :key="index"
                          @click="selectLibraryItem(item)"
                          :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                          draggable="true"
                          @drag="dragMove"
                          @dragstart="dragStart('LIBRARY', item)"
                          @dragend="clearDrag"
                        >
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
                        <v-list-tile
                          :key="index"
                          @click="selectLibraryItem(item)"
                          :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                          draggable="true"
                          @drag="dragMove"
                          @dragstart="dragStart('LIBRARY', item)"
                          @dragend="clearDrag"
                        >
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
                        <v-list-tile
                          @click="selectLibraryItem(item)"
                          :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                          draggable="true"
                          @drag="dragMove"
                          @dragstart="dragStart('LIBRARY', item)"
                          @dragend="clearDrag"
                        >
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
                        <v-list-tile
                          :key="index"
                          @click="selectLibraryItem(item)"
                          :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                          draggable="true"
                          @drag="dragMove"
                          @dragstart="dragStart('LIBRARY', item)"
                          @dragend="clearDrag"
                        >
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
                <v-list-tile
                  :key="index"
                  @click="selectLibraryItem(item)"
                  :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                  draggable="true"
                  @drag="dragMove"
                  @dragstart="dragStart('LIBRARY', item)"
                  @dragend="clearDrag"
                >
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
                <v-list-tile
                  :key="index"
                  @click="selectLibraryItem(item)"
                  :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                  draggable="true"
                  @drag="dragMove"
                  @dragstart="dragStart('LIBRARY', item)"
                  @dragend="clearDrag"
                >
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
                <v-list-tile
                  :key="index"
                  @click="selectLibraryItem(item)"
                  :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                  draggable="true"
                  @drag="dragMove"
                  @dragstart="dragStart('LIBRARY', item)"
                  @dragend="clearDrag"
                >
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
                <v-list-tile
                  :key="index"
                  @click="selectLibraryItem(item)"
                  :class="{ 'active-item':(selectedItem != null && item.id == selectedItem.data.id), 'inactive-item' : (selectedItem == null || item.id != selectedItem.data.id)}"
                  draggable="true"
                  @drag="dragMove"
                  @dragstart="dragStart('LIBRARY', item)"
                  @dragend="clearDrag"
                >
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
  </v-layout>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
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
    selectedItem: null
  }),
  mounted() {
    let self = this;
    self.getLibraryData();
  },
  methods: {
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
        .get(process.env.ServerAddress + "fixtureAdvanced?db=cr-devinspire")
        .then(result => {
          // console.log(result);
          if (result.data == null) {
            console.error("[Library] Failed to get library data");
            return;
          }

          this.gondolaDataArray = [];
          this.fixtureDataArray = [];
          this.obstructionDataArray = [];
          this.subfixtureDataArray = [];
          this.paletteDataArray = [];

          result.data.forEach(libraryItem => {
            switch (libraryItem.type) {
              case 0:
                {
                  // gondola
                  self.gondolaDataArray.push(libraryItem);
                }
                break;
              case 1:
                {
                  // obstruction
                  self.obstructionDataArray.push(libraryItem);
                }
                break;
              case 2:
                {
                  // fixture
                  self.fixtureDataArray.push(libraryItem);
                }
                break;
              case 3:
                {
                  // subfixture
                  self.subfixtureDataArray.push(libraryItem);
                }
                break;
                case 4:
                {
                  // subfixture
                  self.paletteDataArray.push(libraryItem);
                }
                break;
            }
          });

          self.miscArray.push({
            type:"textheader",
            id: 9999,
            name:'Text header',
            description: 'Free transform text header',
            width: 100,
            height: 20,
            depth: 100,
            color: 'transparent'
          })
        });
    },
    selectLibraryItem(item) {
      let self = this;
      let strType = "";
      switch (item.type) {
        case 0:
          {
            // gondola
            strType = "GONDOLA";
          }
          break;
        case 1:
          {
            // Obstruction
            strType = "OBSTRUCTION";
          }
          break;
        case 2:
          {
            // fixture
            switch (item.fixtureType) {
              case 0:
                {
                  // base
                  strType = "BASE";
                }
                break;
              case 1:
                {
                  // shelf
                  strType = "SHELF";
                }
                break;
              case 2:
                {
                  // pegboard
                  strType = "PEGBOARD";
                }
                break;
              case 3:
                {
                  // pegbar
                  strType = "PEGBAR";
                }
                break;
            }
          }
          break;
        case 3:
          {
            // sub fixture
            switch (item.fixtureType) {
              case 0:
                {
                  // base
                  strType = "PEG";
                }
                break;
              case 1:
                {
                  // shelf
                  strType = "BASKET";
                }
                break;
            }
          }
          break;
        case 4:
          {
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
    }
  }
};
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
    -moz-transform: translateX(100%); /* Browser bug fix */
    -webkit-transform: translateX(100%); /* Browser bug fix */
    transform: translateX(100%);
  }
  100% {
    -moz-transform: translateX(-100%); /* Browser bug fix */
    -webkit-transform: translateX(-100%); /* Browser bug fix */
    transform: translateX(-100%);
  }
}
</style>
