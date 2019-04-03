<template>
  <div>
    <v-card class="elevation-1" style="background: url('../../../static/img/banner.png'); background-size: cover; background-position: center;">
      <v-card-text style="height: 150px; position: relative; padding-top: 0px">
        <v-container class="container-height " grid-list-md absolute dark fab top>
          <v-tabs class="elevation-4" centered dark fixed-tabs justify-content: center>
            <v-tabs-slider color="white"></v-tabs-slider>

            <v-tab href="#tab-1" justify-content: center fixed-tabs>
              Gondola
            </v-tab>
            <v-tab href="#tab-2" justify-content: center fixed-tabs>
              Obstruction
            </v-tab>
            <v-tab href="#tab-3" justify-content: center fixed-tabs>
              Fixture
            </v-tab>
            <v-tab href="#tab-4" justify-content: center fixed-tabs>
              Sub Fixture
            </v-tab>
            <v-tab href="#tab-5" justify-content: center fixed-tabs>
              Palette
            </v-tab>
            <v-tab href="#tab-6" justify-content: center fixed-tabs>
              Renderings
            </v-tab>

            <v-tab-item id="tab-1" class="elevation-2" justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field v-model="searchGondola" append-icon="search" label="Search" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text>
                  <v-flex xs12>
                    <v-list dense>
                      <v-list-tile style="padding:2px">
                        <v-list-tile-content>
                          <v-list-tile-title>Image</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-content>
                          <v-list-tile-title>Name</v-list-tile-title>
                        </v-list-tile-content>
                        <v-spacer></v-spacer>
                        <v-list-tile-action>
                          <v-btn style="margin-bottom: 10px;" @click="$refs.fixturesModal.openAdd(0, afterAdd)" color="primary">
                            add
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <hr>
                      <template v-for="(item,index) in filteredgondolas">
                        <div :key="index">
                          <v-list-tile style="padding:2px">
                            <v-list-tile-avatar tile>
                              <img :src="'data:image/png;base64,' + item.image" alt="">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            </v-list-tile-content>

                            <v-spacer></v-spacer>
                            <v-list-tile-action>
                              <v-menu bottom offset-y transition="scale-transition">
                                <v-btn small slot="activator" flat>
                                  <v-icon>more_horiz</v-icon>
                                </v-btn>
                                <v-list>
                                  <v-list-tile @click="editItem(item, 'gondolas')">
                                    <v-list-tile-title>modify</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="remove('gondolas', item,index)">
                                    <v-list-tile-title>delete</v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                              </v-menu>
                            </v-list-tile-action>

                          </v-list-tile>
                          <v-divider></v-divider>
                        </div>
                      </template>

                    </v-list>

                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tab-2" class="elevation-2" justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field v-model="searchObstruction" append-icon="search" label="Search" single-line
                    hide-details></v-text-field>
                </v-card-title>
                <v-card-text>
                  <v-flex xs12>
                    
                    <v-list dense>
                      <v-list-tile style="padding:2px">
                        <v-list-tile-content>
                          <v-list-tile-title>Image</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-content>
                          <v-list-tile-title>Name</v-list-tile-title>
                        </v-list-tile-content>
                        <v-spacer></v-spacer>
                        <v-list-tile-action>
                          <v-btn @click="$refs.fixturesModal.openAdd(1, afterAdd)" color="primary">
                        Add
                      </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <hr>
                      <template v-for="(item,index) in filteredObstruction">
                        <div :key="index">
                          <v-list-tile style="padding:2px">
                            <v-list-tile-avatar tile>
                              <img :src="'data:image/png;base64,' + item.image" alt="">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-spacer></v-spacer>
                            <v-list-tile-action>
                              <v-menu bottom offset-y transition="scale-transition">
                                <v-btn small slot="activator" flat>
                                  <v-icon>more_horiz</v-icon>
                                </v-btn>
                                <v-list>
                                  <v-list-tile @click="editItem(item, 'obstruction')">
                                    <v-list-tile-title>modify</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="remove('obstruction', item,index)">
                                    <v-list-tile-title>delete</v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                              </v-menu>
                            </v-list-tile-action>

                          </v-list-tile>
                          <v-divider></v-divider>
                        </div>
                      </template>

                    </v-list>

                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tab-3" class="elevation-2" justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field v-model="searchFixture" append-icon="search" label="Search" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text>
                  <v-flex xs12>
                    
                    <v-list dense>
                     
                      <v-list-tile style="padding:2px">
                        <v-list-tile-content>
                          <v-list-tile-title>Image</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-content>
                          <v-list-tile-title>Name</v-list-tile-title>
                        </v-list-tile-content>
                        <v-spacer></v-spacer>
                        <v-list-tile-action>
                          <v-btn @click="$refs.fixturesModal.openAdd(2, afterAdd)" color="primary">
                        Add
                      </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <hr>
                      <template v-for="(item,index) in filteredfixture">
                        <div :key="index">
                          <v-list-tile style="padding:2px">
                            <v-list-tile-avatar tile>
                              <img :src="'data:image/png;base64,' + item.image" alt="">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-spacer></v-spacer>
                            <v-list-tile-action>
                              <v-menu bottom offset-y transition="scale-transition">
                                <v-btn small slot="activator" flat>
                                  <v-icon>more_horiz</v-icon>
                                </v-btn>
                                <v-list>
                                  <v-list-tile @click="editItem(item, 'fixture')">
                                    <v-list-tile-title>modify</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="remove('fixture', item,index)">
                                    <v-list-tile-title>delete</v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                              </v-menu>
                            </v-list-tile-action>

                          </v-list-tile>
                          <v-divider></v-divider>
                        </div>
                      </template>

                    </v-list>

                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tab-4" class="elevation-2" justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field v-model="searchSubFixture" append-icon="search" label="Search" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text>
                  <v-flex xs12>
                    
                    <v-list dense>
                      <v-list-tile style="padding:2px">
                        <v-list-tile-content>
                          <v-list-tile-title>Image</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-content>
                          <v-list-tile-title>Name</v-list-tile-title>
                        </v-list-tile-content>
                        <v-spacer></v-spacer>
                        <v-list-tile-action>
                          <v-btn @click="$refs.fixturesModal.openAdd(3, afterAdd)" color="primary">
                        Add
                      </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <hr>
                      <template v-for="(item,index) in filteredSubFixture">

                        <div :key="index">
                          <v-list-tile style="padding:2px">
                            <v-list-tile-avatar tile>
                              <img :src="'data:image/png;base64,' + item.image" alt="">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-spacer></v-spacer>
                            <v-list-tile-action>
                              <v-menu bottom offset-y transition="scale-transition">
                                <v-btn small slot="activator" flat>
                                  <v-icon>more_horiz</v-icon>
                                </v-btn>
                                <v-list>
                                  <v-list-tile @click="editItem(item, 'subFixture')">
                                    <v-list-tile-title>modify</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="remove('subFixture', item,index)">
                                    <v-list-tile-title>delete</v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                              </v-menu>
                            </v-list-tile-action>

                          </v-list-tile>
                          <v-divider></v-divider>
                        </div>
                      </template>

                    </v-list>

                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tab-5" class="elevation-2" justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field v-model="searchPalette" append-icon="search" label="Search" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text>
                  <v-flex xs12>
                   
                    <v-list dense>
                      <v-list-tile style="padding:2px">
                        <v-list-tile-content>
                          <v-list-tile-title>Image</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-content>
                          <v-list-tile-title>Name</v-list-tile-title>
                        </v-list-tile-content>
                        <v-spacer></v-spacer>
                        <v-list-tile-action>
                          <v-btn @click="$refs.fixturesModal.openAdd(4, afterAdd)" color="primary">
                        Add
                      </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <hr>
                      <template v-for="(item,index) in filteredpalette">

                        <div :key="index">
                          <v-list-tile style="padding:2px">
                            <v-list-tile-avatar tile>
                              <img :src="'data:image/png;base64,' + item.image" alt="">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-spacer></v-spacer>
                            <v-list-tile-action>
                              <v-menu bottom offset-y transition="scale-transition">
                                <v-btn small slot="activator" flat>
                                  <v-icon>more_horiz</v-icon>
                                </v-btn>
                                <v-list>
                                  <v-list-tile @click="editItem(item, 'palette')">
                                    <v-list-tile-title>modify</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="remove('palette', item,index)">
                                    <v-list-tile-title>delete</v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                              </v-menu>
                            </v-list-tile-action>

                          </v-list-tile>
                          <v-divider></v-divider>
                        </div>
                      </template>

                    </v-list>

                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tab-6" class="elevation-2" justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field v-model="searchRenderings" append-icon="search" label="Search" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text>
                  <v-flex xs12>
                  
                    <v-list dense>
                      <v-list-tile style="padding:2px">
                        <v-list-tile-content>
                          <v-list-tile-title>Image</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-content>
                          <v-list-tile-title>Name</v-list-tile-title>
                        </v-list-tile-content>
                        <v-spacer></v-spacer>
                        <v-list-tile-action>
                          <v-btn @click="$refs.fixturesModal.openAdd(5, afterAdd)" color="primary">
                        Add
                      </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <hr>
                      <template v-for="(item,index) in filteredrendering">

                        <div :key="index">
                          <v-list-tile style="padding:2px">
                            <v-list-tile-avatar tile>
                              <img :src="'data:image/png;base64,' + item.image" alt="">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-spacer></v-spacer>
                            <v-list-tile-action>
                              <v-menu bottom offset-y transition="scale-transition">
                                <v-btn small slot="activator" flat>
                                  <v-icon>more_horiz</v-icon>
                                </v-btn>
                                <v-list>
                                  <v-list-tile @click="editItem(item, 'rendering')">
                                    <v-list-tile-title>modify</v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile @click="remove('rendering', item,index)">
                                    <v-list-tile-title>delete</v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                              </v-menu>
                            </v-list-tile-action>

                          </v-list-tile>
                          <v-divider></v-divider>
                        </div>
                      </template>

                    </v-list>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-container>
      </v-card-text>
    </v-card>
    <Dialog ref="dialog"></Dialog>
    <FixturesModal ref="fixturesModal"></FixturesModal>
  </div>
</template>


<script>
  import Axios from 'axios';
  import FixturesModal from './Modal';
  import Dialog from '@/components/Common/Dialog';

  export default {
    name: 'List',
    components: {
      FixturesModal,
      Dialog
    },
    data() {
      return {
        searchGondola: '',
        searchObstruction: '',
        searchFixture: '',
        searchSubFixture: '',
        searchPalette: '',
        searchRenderings: '',
        items: [],
        gondolas: [],
        obstruction: [],
        fixture: [],
        subFixture: [],
        palette: [],
        rendering: [],
        headers: [{
          text: "Image",
          value: "image",
          class: "image-header",
          sortable: false
        }, {
          text: 'Name',
          value: 'name'
        }]
      }
    },
    computed: {
      filteredObstruction() {
        return this.gondolas.filter(item => {
          if (!this.searchObstruction) return this.Obstruction;
          return (item.name.toLowerCase().includes(this.searchGondola.toLowerCase()))
        });
      },
      filteredgondolas() {
        return this.gondolas.filter(item => {
          if (!this.searchGondola) return this.gondolas;
          return (item.name.toLowerCase().includes(this.searchGondola.toLowerCase()))
        });

      },
      filteredfixture() {
        return this.fixture.filter(item => {
          if (!this.searchFixture) return this.fixture;
          return (item.name.toLowerCase().includes(this.searchFixture.toLowerCase()))
        });

      },
      filteredSubFixture() {
        return this.subFixture.filter(item => {
          if (!this.searchSubFixture) return this.subFixture;
          return (item.name.toLowerCase().includes(this.searchSubFixture.toLowerCase()))
        });
      },

      filteredpalette() {
        return this.palette.filter(item => {
          if (!this.searchPalette) return this.palette;
          return (item.name.toLowerCase().includes(this.searchPalette.toLowerCase()))
        });
      },

      filteredrendering() {
        return this.rendering.filter(item => {
          if (!this.searchRenderings) return this.rendering;
          return (item.name.toLowerCase().includes(this.searchRenderings.toLowerCase()))
        });
      },
    },
    mounted() {
      let self = this;

      Axios.get(process.env.VUE_APP_API + "Fixture?db=CR-Devinspire")
        .then(r => {

          for (var i = 0; i < r.data.length; i++) {
            let el = r.data[i];
            if (el.rendering) {
              self.rendering.push(el);
            } else {
              if (el.type == 0)
                self.gondolas.push(el);
              if (el.type == 1)
                self.obstruction.push(el);
              if (el.type == 2)
                self.fixture.push(el);
              if (el.type == 3)
                self.subFixture.push(el);
              if (el.type == 4)
                self.palette.push(el);
            }
          }
        })
    },
    methods: {
      afterAdd(el) {
        let self = this;

        if (el.rendering) {
          self.rendering.push(el);
        } else {
          if (el.type == 0)
            self.gondolas.push(el);
          if (el.type == 1)
            self.obstruction.push(el);
          if (el.type == 2)
            self.fixture.push(el);
          if (el.type == 3)
            self.subFixture.push(el);
          if (el.type == 4)
            self.palette.push(el);
        }
      },
      editItem(item, type) {
        let self = this;

        let idx = self[type].indexOf(item)

        self.$refs.fixturesModal.openEdit(item, function (newItem) {
          Axios.get(process.env.VUE_APP_API + `Fixture/${item.id}?db=CR-Devinspire`)
            .then(r => {
              self[type].splice(idx, 1);
              self[type].push(r.data);
            })
            .catch(e => {

            })
        })
      },
      remove(type, item, index) {
        let self = this;

        self.$refs.dialog.openDialog({
          headline: "Are you sure?",
          text: "Delete this fixture?",
          callback: () => {
            Axios.delete(process.env.VUE_APP_API + `Fixture/${item.id}?db=CR-Devinspire`)
              .then(r => {
                let idx = self[type].indexOf(item)

                self[type].splice(idx, 1);
              })
          }
        })
      }
    }
  }
</script>

<style>
  #tdName {
    width: 33%;
  }

  #tdActions {
    width: 33%;
  }

  .image-header {
    width: 60px;
  }

  .back-height {
    height: calc(100vh - 200px);
    overflow-y: auto;
  }
</style>