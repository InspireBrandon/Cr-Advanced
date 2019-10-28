<template>
  <v-container fluid class="pa-0 ma-0" grid-list-md>
    <v-layout class="pa-0 ma-0" row wrap>
      <v-flex md2 class="pa-0 ma-0">
        <v-navigation-drawer
          permanent
          value="true"
          style="max-height: 850px"
          class="overflow-y-auto"
        >
          <v-divider></v-divider>
          <RecursiveItem parentID="0" />
        </v-navigation-drawer>
      </v-flex>
      <v-flex md10 class="pa-0 ma-0">
        <router-view />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import RouteController from "@/components/Main/NewViewTesting/RoutesForTesting/route-controller";
import RecursiveItem from "../NewViewTesting/RoutesForTesting/RecursiveItem";

export default {
  components: {
    RecursiveItem
  },
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
      console.log(rc.getRoutesByParentID("0"));
    },
    getChildren() {
      let self = this;

      let rc = new RouteController({
        userType: 0
      });

      self.planogramList[0].children = rc.getRoutesByParentID("1");
      // var planogramChildrenList = rc.getRoutesByParentID("1");
      self.planogramList[1].children = rc.getRoutesByParentID("2");
      self.planogramList[2].children = rc.getRoutesByParentID("3");
      self.planogramList[2].children[0].children = rc.getRoutesByParentID(
        "3.1"
      );
      self.planogramList[2].children[1].children = rc.getRoutesByParentID(
        "3.2"
      );
      self.planogramList[2].children[2].children = rc.getRoutesByParentID(
        "3.3"
      );
      self.planogramList[2].children[3].children = rc.getRoutesByParentID(
        "3.4"
      );
      self.planogramList[4].children = rc.getRoutesByParentID("5");
      self.planogramList[7].children = rc.getRoutesByParentID("8");

      console.log("PlanoRouteItem", self.planogramList);
      // console.log(self.planogramList);
    },
    goTo(route) {
      this.$router.push(route);
    }
  }
};
</script>