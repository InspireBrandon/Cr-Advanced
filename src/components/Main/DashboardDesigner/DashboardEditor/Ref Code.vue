<template>
  <div>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md12>
          <div class="title">Create a new dashboard</div>
          <v-spacer></v-spacer>
          <v-text-field :label="'Dashboard Name'" v-model="form.Name" dense outlined hide-details>
          </v-text-field>
          <v-btn :disabled="form.Name.length == 0" color="success" class="mr-1 ml-2" @click="saveDashboard">Save</v-btn>
          <v-btn color="error" class="mr-5 ml-1">Cancel</v-btn>
        </v-flex>

        <v-flex md12>
          <grid-layout style="width:100%;height:100%" :layout.sync="Layout" :col-num="12" :row-height="30"
            :auto-size="true" :is-draggable="true" :is-resizable="true" :is-mirrored="false" :vertical-compact="true"
            :margin="[5, 5]" :use-css-transforms="true">
            <grid-item class="grid-item" v-for="(item, idx) in ReportItems" :x="item.ReportLayout.x"
              :y="item.ReportLayout.y" :w="item.ReportLayout.w" :h="item.ReportLayout.h" :i="item.ReportLayout.i"
              :key="item.ReportLayout.i">
              <v-flex no-gutters class="fill-height" align="center" justify="center">
                <v-card class="fill-height" height="100%" width="100%">
                  <v-toolbar dense>
                    {{item.Name}}
                    <v-spacer></v-spacer>
                    <v-btn icon color="red">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <ReportLoader :ReportData="item" :key="idx" :id="idx" style="height: calc(100% - 48px) !important;" />
                </v-card>
              </v-flex>
            </grid-item>
          </grid-layout>
        </v-flex>
      </v-layout>

    </v-container>
    <v-container class="fill-height">
      <v-col cols="12" class="report-main scroll" @dragover.prevent @drop="dragFinish($event)" @dblclick="addWidget">

      </v-col>
      <slide-x-right-transition>
        <v-card outline flat class="widget-container" v-if="showWidgets">
          <v-row class="fill-height" no-gutters>
            <div class="slider-button" @click="scrollPrev">
              <v-icon>mdi-chevron-left</v-icon>
            </div>
            <div class="job-card-slider" ref="widgetSlider">
              <v-card dark class="ml-2 mr-2" style="display:flex;" v-for="widget in widgets" :key="widget.ID"
                height="100%" width="250" draggable @dragstart="dragStart(widget, $event)" no-gutters>
                <v-card-text>
                  <v-row no-gutters justify="center">
                    <span>{{widget.Name}}</span>
                  </v-row>
                  <v-row>
                    <v-divider color="#ff7200"></v-divider>
                  </v-row>
                  <span>Short description goes here about the widget that you are selecting</span>
                </v-card-text>
              </v-card>
            </div>

            <div class="slider-button" @click="scrollNext">
              <v-icon>mdi-chevron-right</v-icon>
            </div>
          </v-row>
        </v-card>
      </slide-x-right-transition>
    </v-container>
  </div>
</template>

<script>
  import ReportLoader from "./report-loader";

  export default {
    data() {
      return {
        form: {
          Name: ""
        },
        tempKey: "TestWidget",
        ReportItems: [],
        Layout: [],
        widgets: [{
            Name: "Table",
            Key: "TestWidget"
          },
          {
            Name: "Graph",
            Key: "Graph"
          }
        ],
        draggedItem: null,
        showWidgets: true
      };
    },
    components: {
      ReportLoader
    },
    mounted() {
      let self = this;

      self.fetchWidgets();
    },
    computed: {
      SortedList() {
        let self = this;
        let retVal = self.ReportItems.sort((a, b) => (b.ReportLayout.y - a.ReportLayout.y))
        console.log(retVal)
        return retVal;
      }
    },
    methods: {
      fetchWidgets() {
        let self = this;

        //   self.get(`Tenant/ReportWidget`).then(r => {
        //     self.widgets = r.data;
        //   });
      },
      dragStart(which, ev) {
        let self = this;

        self.draggedItem = which;
      },
      dragFinish(ev) {
        let self = this;
        let firstItem = self.ReportItems.length == 0 ? true : false;
        let x = 0;
        let y = 0;
        let w = 2;
        let h = 10;

        if (firstItem == false) {
          let found = false;
          let lastY = 0;
          x = (self.ReportItems.length * w) % 12;
          y = self.SortedList[0].ReportLayout.y;
        }
        var obj = Object.assign({}, self.draggedItem);

        obj.key = self.draggedItem.Key;
        // var prevLayout = self.ReportItems[i - 1].ReportLayout;

        let layout = {
          x: x,
          y: y,
          w: w,
          h: h,
          // i: self.guid()
        };

        obj.ReportLayout = layout;
        self.Layout.push(layout);
        self.ReportItems.push(obj);
        //   self.widgets.splice(self.widgets.indexOf(self.draggedItem), 1);
      },
      scrollPrev() {
        let self = this;

        self.$refs.widgetSlider.scrollLeft -= 650;
      },
      scrollNext() {
        let self = this;

        self.$refs.widgetSlider.scrollLeft += 650;
      },
      guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return (
          s4() +
          s4() +
          "-" +
          s4() +
          "-" +
          s4() +
          "-" +
          s4() +
          "-" +
          s4() +
          s4() +
          s4()
        );
      },
      addWidget() {
        let self = this;
        let firstItem = self.ReportItems.length == 0 ? true : false;
        let x = 0;
        let y = 0;

        if (firstItem == false) {
          let itemsSorted = self.ReportItems.sort((a, b) => (a.x - b.x) && (a.y - b.y));
          console.log("SORT", itemsSorted)
        }

        let item = {
          x: x,
          y: y,
          w: 2,
          h: 10,
          i: self.guid()
        };
        self.ReportItems.push({
          ReportLayout: item,
          key: "Graph"
        });
        self.Layout.push(item);
      },
      saveDashboard() {
        let self = this;

        let retVal = [];

        self.ReportItems.forEach(element => {
          var objToPush = Object.assign({}, element);

          objToPush.ReportLayout = JSON.stringify(element.ReportLayout);

          retVal.push(objToPush);
        });

        let request = {
          ID: null,
          Name: self.form.Name,
          Widgets: retVal
        };

        console.log(request);

        self.post("Tenant/ReportDashboard", request).then(r => {
          self.$router.push("/Reports");
        });
      },
       
    }
  };
</script>

<style lang="css" scoped>
  .widget-container {
    position: fixed;
    height: 150px;
    width: 100%;
    bottom: 0;
    /* box-shadow: 0px -1px 20px #888; */
  }

  .grid-item {
    border: 1px dotted;
    background: lightgrey;
  }

  .job-card-slider {
    height: 100%;
    align-items: flex-end;
    display: flex;
    width: calc(100% - 52px);
    overflow: hidden;
    scroll-behavior: smooth;
    padding: 5px;
  }

  .slider-button {
    height: 100%;
    border: 1px solid;
    display: flex;
    background: lightgrey;
  }
</style>

<style lang="css">
  @media only screen and (max-width: 501px) {
    .vue-grid-item {
      height: fit-content !important;
      transform: none !important;
      position: relative !important;
      margin-bottom: 10px;
    }
  }
</style>

<style scoped>
  .scroll {
    top: 50px;
    position: absolute;
    background: #6aa5d1;
    height: calc(100vh - 240px);
    overflow-y: scroll;
    overflow-x: auto;
  }
</style>