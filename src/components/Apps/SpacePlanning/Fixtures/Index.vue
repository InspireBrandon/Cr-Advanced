<template>
  <div>
    <v-card
      class="elevation-1"
      style="background: url('../../../static/img/banner.png'); background-size: cover; background-position: center;"
    >
      <v-card-text style="height: 150px; position: relative; padding-top: 0px">
        <v-container class="container-height" grid-list-md absolute dark fab top>
          <v-tabs class="elevation-4" centered dark fixed-tabs justify-content: center>
            <v-tabs-slider color="white"></v-tabs-slider>

            <v-tab href="#tab-main" justify-content: center fixed-tabs>Fixtures</v-tab>

            <v-tab href="#tab-images" justify-content: center fixed-tabs>Images</v-tab>

            <v-tab href="#tab-floorplan" justify-content: center fixed-tabs>Floorplan</v-tab>

            <v-tab href="#tab-6" justify-content: center fixed-tabs>Custom</v-tab>

            <v-tab-item id="tab-main" class="elevation-2" justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-btn @click="addNewGroup" color="primary">Add Group</v-btn>
                </v-card-title>
                <v-card-text>
                  <v-flex xs12>
                    <v-divider class="mx-2"></v-divider>
                  </v-flex>
                  <v-flex xs12>
                    <FixtureRecursive
                      :addGroup="addGroup"
                      :editGroup="editGroup"
                      :deleteGroup="deleteGroup"
                      v-for="(fg, idx) in fixtureGroups"
                      :key="idx"
                      :fixtureGroup="fg"
                      :parentArr="fixtureGroups"
                      :editFixture="editFixture"
                      :deleteFixture="deleteFixture"
                      :type="1"
                      :openMenuAdd="openMenuAdd"
                      :isEdit="true"
                      :selectedItem="dragPlaceHolder"
                      :selectLibraryItem="dragPlaceHolder"
                      :dragStart="dragPlaceHolder"
                      :dragMove="dragPlaceHolder"
                      :clearDrag="dragPlaceHolder"
                      :toggleFloorPlan="toggleFloorPlan"
                    ></FixtureRecursive>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item id="tab-images" class="elevation-2" justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-btn @click="addNewGroup" color="primary">Add Group</v-btn>
                </v-card-title>
                <v-card-text>
                  <v-flex xs12>
                    <v-divider class="mx-2"></v-divider>
                  </v-flex>
                  <v-flex xs12>
                    <FixtureRecursive
                      :addGroup="addGroup"
                      :editGroup="editGroup"
                      :deleteGroup="deleteGroup"
                      v-for="(fg, idx) in fixtureGroups"
                      :key="idx"
                      :fixtureGroup="fg"
                      :parentArr="fixtureGroups"
                      :editFixture="editFixture"
                      :deleteFixture="deleteFixture"
                      :type="2"
                      :openMenuAdd="openMenuAdd"
                      :isEdit="true"
                      :selectedItem="dragPlaceHolder"
                      :selectLibraryItem="dragPlaceHolder"
                      :dragStart="dragPlaceHolder"
                      :dragMove="dragPlaceHolder"
                      :clearDrag="dragPlaceHolder"
                    ></FixtureRecursive>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item id="tab-floorplan" class="elevation-2" justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-btn @click="addNewGroup" color="primary">Add Group</v-btn>
                </v-card-title>
                <v-card-text>
                  <v-flex xs12>
                    <v-divider class="mx-2"></v-divider>
                  </v-flex>
                  <v-flex xs12>
                    <FixtureRecursive
                      :addGroup="addGroup"
                      :editGroup="editGroup"
                      :deleteGroup="deleteGroup"
                      v-for="(fg, idx) in fixtureGroups"
                      :key="idx"
                      :fixtureGroup="fg"
                      :parentArr="fixtureGroups"
                      :editFixture="editFixture"
                      :deleteFixture="deleteFixture"
                      :type="3"
                      :openMenuAdd="openMenuAdd"
                      :isEdit="true"
                      :selectedItem="dragPlaceHolder"
                      :selectLibraryItem="dragPlaceHolder"
                      :dragStart="dragPlaceHolder"
                      :dragMove="dragPlaceHolder"
                      :clearDrag="dragPlaceHolder"
                      :selectFixture="selectFixture"
                    ></FixtureRecursive>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item id="tab-6" class="elevation-2" justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-title>
                  <v-spacer></v-spacer>
                  <div style="width: 300px;">
                    <v-text-field
                      v-model="searchRenderings"
                      append-icon="search"
                      label="Search"
                      single-line
                      hide-details
                    ></v-text-field>
                  </div>
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
                        <v-list-tile-content></v-list-tile-content>
                      </v-list-tile>
                      <hr />
                      <template v-for="(item, index) in floorPlans">
                        <div :key="index">
                          <v-list-tile style="padding:2px">
                            <v-list-tile-content>
                              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-spacer></v-spacer>
                            <v-list-tile-action>
                              <v-menu bottom offset-y transition="scale-transition">
                                <v-btn small slot="activator" flat>
                                  <v-icon>more_horiz</v-icon>
                                </v-btn>
                                <v-list dense>
                                  <v-list-tile>
                                    <v-list-tile-title>Assign</v-list-tile-title>
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
    <Prompt ref="prompt"></Prompt>
    <YesNoModal ref="yesNo"></YesNoModal>
    <FixtureSelector ref="fixtureSelector"></FixtureSelector>
  </div>
</template>


<script>
import Axios from "axios";
import FixturesModal from "./Modal";
import Dialog from "@/components/Common/Dialog";
import FixtureRecursive from "./FixtureRecursive.vue";
import Prompt from "@/components/Common/Prompt";
import YesNoModal from "@/components/Common/YesNoModal";
import FixtureSelector from '../../../Common/FixtureSelector.vue'

export default {
  name: "List",
  components: {
    FixturesModal,
    Dialog,
    FixtureRecursive,
    Prompt,
    YesNoModal,
    FixtureSelector
  },
  data() {
    return {
      floorPlans: [],
      fixtureGroups: [],
      searchGondola: "",
      searchObstruction: "",
      searchFixture: "",
      searchSubFixture: "",
      searchPalette: "",
      searchRenderings: "",
      items: [],
      gondolas: [],
      obstruction: [],
      fixture: [],
      subFixture: [],
      palette: [],
      rendering: [],
      headers: [
        {
          text: "Image",
          value: "image",
          class: "image-header",
          sortable: false
        },
        {
          text: "Name",
          value: "name"
        }
      ]
    };
  },
  computed: {
    filteredrendering() {
      if (this.searchRenderings == "") {
        return this.rendering.filter(item => {
          return item.fixtureGroupID == null;
        });
      }

      return this.rendering.filter(item => {
        return (
          item.name
            .toLowerCase()
            .includes(this.searchRenderings.toLowerCase()) &&
          item.fixtureGroupID == null
        );
      });
    }
  },
  mounted() {
    let self = this;

    self.getFixtureGroups();
    self.getFloorPlans();

    Axios.get(process.env.VUE_APP_API + "Fixture?db=CR-Devinspire").then(r => {
      for (var i = 0; i < r.data.length; i++) {
        let el = r.data[i];
        if (el.rendering) {
          self.rendering.push(el);
        } else {
          if (el.type == 0) self.gondolas.push(el);
          if (el.type == 1) self.obstruction.push(el);
          if (el.type == 2) self.fixture.push(el);
          if (el.type == 3) self.subFixture.push(el);
          if (el.type == 4) self.palette.push(el);
        }
      }
    });
  },
  methods: {
    dragPlaceHolder() {},
    getType(item) {
      let self = this;
      if (item.type == 0) return "Gondola";
      if (item.type == 1) return "Obstruction";
      if (item.type == 2) {
        switch (item.fixtureType) {
          case 0:
            return "Base";
            break;
          case 1:
            return "Shelf";
            break;
          case 2:
            return "Pegboard";
            break;
          case 3:
            return "Pegbar";
            break;
          case 4:
            return "ShareBox";
            break;

          default:
            break;
        }
      }
      if (item.type == 3) {
        switch (item.fixtureType) {
          case 0:
            return "Peg";
            break;
          case 1:
            return "Basket";
            break;
          case 2:
            return "Divider";
            break;
          case 3:
            return "Cabinet";
            break;
          default:
            break;
        }
      }
      if (item.type == 4) return "Palette";
    },
    getFixtureImage(id) {
      let self = this;

      Axios.get(
        process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&id=` + id
      )
        .then(r => {
          self.$refs[id][0].src = "data:image/png;base64," + r.data;
        })
        .catch(e => {
          return null;
        });
    },
    afterAdd(el, arr) {
      let self = this;

      arr.push(el);
    },
    editItem(item, type, groupType) {
      let self = this;

      let idx = self[type].indexOf(item);

      self.$refs.fixturesModal.openEdit(item, groupType, function(newItem) {
        Axios.get(
          process.env.VUE_APP_API + `Fixture/${item.id}?db=CR-Devinspire`
        )
          .then(r => {
            self[type].splice(idx, 1);
            self[type].push(r.data);
          })
          .catch(e => {});
      });
    },
    remove(type, item, index) {
      let self = this;

      self.$refs.dialog.openDialog({
        headline: "Are you sure?",
        text: "Delete this fixture?",
        callback: () => {
          Axios.delete(
            process.env.VUE_APP_API + `Fixture/${item.id}?db=CR-Devinspire`
          ).then(r => {
            let idx = self[type].indexOf(item);

            self[type].splice(idx, 1);
          });
        }
      });
    },
    getFixtureGroups() {
      let self = this;

      Axios.get(
        process.env.VUE_APP_API +
          `FixtureGroup?db=CR-Devinspire&parentID=${null}&type=1`
      )
        .then(r => {
          self.fixtureGroups = [];

          r.data.fixtureGroups.forEach(fg => {
            self.fixtureGroups.push(new FixtureGroup(fg));
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    openMenuAdd(type, group, arr) {
      let self = this;

      switch (type) {
        case "Gondola":
          {
            self.$refs.fixturesModal.openAdd(0, group, el => {
              self.afterAdd(el, arr);
            });
          }
          break;
        case "Obstruction":
          {
            self.$refs.fixturesModal.openAdd(1, group, el => {
              self.afterAdd(el, arr);
            });
          }
          break;
        case "Fixture":
          {
            self.$refs.fixturesModal.openAdd(2, group, el => {
              self.afterAdd(el, arr);
            });
          }
          break;
        case "SubFixture":
          {
            self.$refs.fixturesModal.openAdd(3, group, el => {
              self.afterAdd(el, arr);
            });
          }
          break;
        case "Palette":
          {
            self.$refs.fixturesModal.openAdd(4, group, el => {
              self.afterAdd(el, arr);
            });
          }
          break;
        case "Rendering":
          {
            self.$refs.fixturesModal.openAdd(5, group, el => {
              self.afterAdd(el, arr);
            });
          }
          break;
        default:
          break;
      }
    },
    addNewGroup() {
      let self = this;

      self.addGroup(null, newChild => {
        self.fixtureGroups.push(new FixtureGroup(newChild));
      });
    },
    addGroup(fixtureGroup, callback) {
      let self = this;

      self.$refs.prompt.show("", "Group name", "Name", groupName => {
        let request = {
          parentID: fixtureGroup == null ? null : fixtureGroup.id,
          name: groupName
        };

        Axios.post(
          process.env.VUE_APP_API + "FixtureGroup?db=CR-Devinspire",
          request
        )
          .then(r => {
            callback(r.data);
          })
          .catch(e => {
            console.log(e);
          });
      });
    },
    editGroup(fixtureGroup) {
      let self = this;

      self.$refs.prompt.show(
        fixtureGroup.name,
        "Group name",
        "Name",
        groupName => {
          fixtureGroup.name = groupName;

          Axios.put(
            process.env.VUE_APP_API + "FixtureGroup?db=CR-Devinspire",
            fixtureGroup
          )
            .then(r => {})
            .catch(e => {
              console.log(e);
            });
        }
      );
    },
    deleteGroup(fixtureGroup, parentArr) {
      let self = this;

      self.$refs.yesNo.show(
        "Would you like to delete this group?",
        goThrough => {
          if (goThrough) {
            Axios.delete(
              process.env.VUE_APP_API +
                "FixtureGroup?db=CR-Devinspire&fixtureGroupID=" +
                fixtureGroup.id
            )
              .then(r => {
                parentArr.splice(parentArr.indexOf(fixtureGroup), 1);
              })
              .catch(e => {
                console.log(e);
              });
          }
        }
      );
    },
    editFixture(item, groupType, arr) {
      let self = this;

      self.$refs.fixturesModal.openEdit(item, groupType, function(newItem) {
        for (var prop in item) {
          item[prop] = newItem[prop];
        }
      });
    },
    deleteFixture(item, parentArr) {
      let self = this;

      self.$refs.dialog.openDialog({
        headline: "Are you sure?",
        text: "Delete this fixture?",
        callback: () => {
          Axios.delete(
            process.env.VUE_APP_API + `Fixture/${item.id}?db=CR-Devinspire`
          ).then(r => {
            parentArr.splice(parentArr.indexOf(item), 1);
          });
        }
      });
    },
    getFloorPlans() {
      let self = this;

      Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&folder=FIXTURES`)
        .then(r => {
          self.floorPlans = r.data;
        })
        .catch(e => {

        })
    },
    selectFixture(callback) {
      let self = this;

      self.$refs.fixtureSelector.show((fixtureID, sp) => {
        callback(fixtureID, sp);
      })
    },
    toggleFloorPlan(fixture) {
      let self = this;

      self.$nextTick(() => {
        Axios.put(process.env.VUE_APP_API + "Fixture?db=CR-Devinspire", fixture)
          .then(r => {

          })
      })
    }
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
  self.systemFiles = params.systemFiles;
  self.showChildren = false;
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