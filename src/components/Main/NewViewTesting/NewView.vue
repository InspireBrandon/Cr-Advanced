<template>
  <v-card tile>
    <v-toolbar dark flat>
      <v-toolbar-title>
        <span class="title ml-3 mr-5">Chain&nbsp;<span class="font-weight-light">Research</span></span>
      </v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer permanent value="true">
      <v-card>
        <v-treeview :items="planogramList" :open="open">
          <template v-slot:prepend="{ item, open }">
            <div>
              <div v-if="item.route == null">
                <v-icon v-if="item.route == null">{{ open ? 'folder_open' : 'folder' }}</v-icon>
                {{item.title}}
              </div>
              <div v-else @click="goTo(item.route)" style="cursor: pointer;">
                <v-icon v-if="item.route == null">{{ open ? 'folder_open' : 'folder' }}</v-icon>
                {{item.title}}
              </div>
            </div>
            <!-- <v-icon
              v-if="item.parentID"
              v-text="`${item.parentID == 0 ? 'home_variant' : 'folder_network'}`"
            ></v-icon>-->
          </template>
        </v-treeview>
      </v-card>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import RouteController from "@/components/Main/NewViewTesting/RoutesForTesting/route-controller";

export default {
  data() {
    return {
      admins: [["Planograms"], ["Settings"], ["Settings"], ["Settings"]],
      planogramList: [],
      open: [1, 2],
      search: null,
      count: 0
    };
  },
  computed: {},
  created() {
    let self = this;

    self.getRoutes();
    self.getChildren();
  },
  mounted() {
    let self = this;

    self.count = self.admins.length;
  },
  methods: {
    getRoutes() {
      let self = this;

      let rc = new RouteController({
        userType: 0
      });

      self.planogramList = rc.getRoutesByParentID("0");
      console.log("PlanoList", self.planogramList);
    },
    getChildren() {
      let self = this;

      let rc = new RouteController({
        userType: 0
      });

      // var planogramChildrenList = rc.getRoutesByParentID("1");
      self.planogramList[0].children = rc.getRoutesByParentID("1");
      self.planogramList[1].children = rc.getRoutesByParentID("2");
      self.planogramList[2].children = rc.getRoutesByParentID("3");
      self.planogramList[2].children[0].children = rc.getRoutesByParentID("3.1");

      console.log("PlanoRouteItem", self.planogramList);
      // console.log(self.planogramList);
    },
    goTo(route) {
      this.$router.push(route);
    }
  }
};
</script>