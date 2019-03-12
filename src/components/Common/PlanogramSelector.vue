<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent width="80vw">
        <v-card dark>
          <v-card-title style="text-align: center; display: block;" class="headline">{{ title }}</v-card-title>
          <v-card-text style="text-align: center;">
            <v-btn-toggle v-model="toggle_asc">
              <v-btn color="primary">
                Active
              </v-btn>
              <v-btn color="primary">
                New
              </v-btn>
              <v-btn color="primary">
                De-Listed
              </v-btn>
              <v-btn style="display: none;" color="primary">
                De-Listed
              </v-btn>
              <v-btn color="primary">
                Active And New
              </v-btn>
            </v-btn-toggle>
            <v-form v-if="toggle_asc == 0" @submit.prevent="returnText">
              <v-text-field label="Search" append-icon="search" v-model="filterText"></v-text-field>
              <v-card height="300" style="overflow: auto;">
                <v-layout row>
                  <v-flex overflow-y-hidden>
                    <v-list hover dense v-for="Planogram in filteredActiveItems" :key="Planogram.ID" v-model="Planogram.active">
                      <v-divider></v-divider>
                      <v-list-tile :class="{ 'highlighted': selectedPlanogram == Planogram  }" active-class="highlighted"
                        @click="addSelected(Planogram)">
                        <v-list-tile-content>
                          <v-list-tile-title>{{ Planogram.displayname }}
                          </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-form>
            <v-form v-if="toggle_asc == 1" @submit.prevent="returnText">
              <v-text-field label="Search" append-icon="search" v-model="filterText"></v-text-field>
              <v-card height="300" style="overflow: auto;">
                <v-layout row>
                  <v-flex overflow-y-hidden>
                    <v-list hover dense v-for="Planogram in filteredNewItems" :key="Planogram.ID" v-model="Planogram.active">
                      <v-divider></v-divider>
                      <v-list-tile :class="{ 'highlighted': selectedPlanogram == Planogram  }" active-class="highlighted"
                        @click="addSelected(Planogram)">
                        <v-list-tile-content>
                          <v-list-tile-title>{{ Planogram.displayname }}
                          </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-form>
            <v-form v-if="toggle_asc == 2" @submit.prevent="returnText">
              <v-text-field label="Search" append-icon="search" v-model="filterText"></v-text-field>
              <v-card height="300" style="overflow: auto;">
                <v-layout row>
                  <v-flex overflow-y-hidden>
                    <v-list hover dense v-for="Planogram in filteredDeListedItems" :key="Planogram.ID" v-model="Planogram.active">
                      <v-divider></v-divider>
                      <v-list-tile :class="{ 'highlighted': selectedPlanogram == Planogram  }" active-class="highlighted"
                        @click="addSelected(Planogram)">
                        <v-list-tile-content>
                          <v-list-tile-title>{{ Planogram.displayname }}
                          </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-form>
            <v-form v-if="toggle_asc == 4" @submit.prevent="returnText">
              <v-text-field label="Search" append-icon="search" v-model="filterText"></v-text-field>
              <v-card height="300" style="overflow: auto;">
                <v-layout row>
                  <v-flex overflow-y-hidden>
                    <v-list hover dense v-for="Planogram in filteredActiveAndNewItems" :key="Planogram.ID" v-model="Planogram.active">
                      <v-divider></v-divider>
                      <v-list-tile :class="{ 'highlighted': selectedPlanogram == Planogram  }" active-class="highlighted"
                        @click="addSelected(Planogram)">
                        <v-list-tile-content>
                          <v-list-tile-title>{{ Planogram.displayname }}
                          </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-form>
          </v-card-text>
          <v-card-actions style="text-align: right; display: block;">
            <v-spacer></v-spacer>
            <v-btn color="error" @click.native="dialog = false">Cancel</v-btn>
            <v-btn color="primary" @click.native="returnText">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  import Axios from 'axios';
  export default {
    data() {
      return {
        PlanogramsActive: [],
        PlanogramsDeListed: [],
        PlanogramsNew: [],
        PlanogramsActiveAndNew: [],
        dialog: false,
        afterRuturn: null,
        title: 'Planogram Selector',
        filterText: "",
        selectedPlanogram: null,
        label: 'Planogram',
        toggle_asc: 0,
        showGroup: true
      }
    },

    mounted() {
      this.getPlanograms(() => {})
    },
    methods: {
      getPlanograms(callback) {
        let self = this;
        self.PlanogramsActive = [];
        self.PlanogramsDeListed = [];
        self.PlanogramsNew = [];
        self.PlanogramsActiveAndNew = [];

        Axios.get(process.env.VUE_APP_API + "PlanogramActiveShopCode").then(Response => {

          self.PlanogramsActive = Response.data.planogramActiveList;
          self.PlanogramsDeListed = Response.data.planogramDeListedList;
          self.PlanogramsNew = Response.data.planogramNewItemList;
          self.PlanogramsActiveAndNew = Response.data.planogramActiveAndNewList;

          callback();
        })
      },
      addSelected(Planogram) {
        var self = this
        self.selectedPlanogram = Planogram;
      },
      show(showGroup, afterRuturn) {
        let self = this;
        this.getPlanograms(() => {
          self.showGroup = showGroup;
          self.toggle_asc = 0;
          self.selectedPlanogram = null;
          self.filterText = "";
          self.afterRuturn = afterRuturn;
          self.dialog = true;
        });
      },
      returnText() {
        let self = this;
        if (self.toggle_asc == 0 && self.selectedPlanogram == null) {
          alert("Please select a planogram")
        } else {
          self.afterRuturn(self.selectedPlanogram, self.toggle_asc);
          self.dialog = false;
        }
      }
    },
    computed: {
      filteredActiveItems() {
        let self = this;
        let retval = [];

        self.PlanogramsActive.forEach(element => {

          if (element.displayname.toUpperCase().indexOf(self.filterText.toUpperCase()) > -1)
            retval.push(element);
        });

        return retval;
      },
      filteredNewItems() {
        let self = this;
        let retval = [];

        self.PlanogramsNew.forEach(element => {

          if (element.displayname.toUpperCase().indexOf(self.filterText.toUpperCase()) > -1)
            retval.push(element);
        });

        return retval;
      },
      filteredDeListedItems() {
        let self = this;
        let retval = [];

        self.PlanogramsDeListed.forEach(element => {

          if (element.displayname.toUpperCase().indexOf(self.filterText.toUpperCase()) > -1)
            retval.push(element);
        });

        return retval;
      },
      filteredActiveAndNewItems() {
        let self = this;
        let retval = [];

        self.PlanogramsActiveAndNew.forEach(element => {

          if (element.displayname.toUpperCase().indexOf(self.filterText.toUpperCase()) > -1)
            retval.push(element);
        });

        return retval;
      }
    }
  }

</script>
<style>
  .highlighted {
    background-color: #1976d2;
  }

</style>
