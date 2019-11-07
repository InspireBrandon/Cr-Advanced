<template>
  <div>
    <div v-for="(item, idx) in routeController.getRoutesByParentID(parentID)" :key="idx">
      <div v-if="item.allowedAccessLevels.includes(parseInt(accessType))">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="overline font-weight-regular no-wrap" style="cursor: pointer;"
              v-if="item.route == null" @click="item.showChildren =  !item.showChildren">
              <v-icon v-if="item.route == null">{{ item.showChildren ? 'folder_open' : 'folder' }}</v-icon>
              <span>{{item.title}}</span>
              <span v-if="item.showChildrenCount">{{counter(item)}}</span>
              <span>{{ item.extraDetails }}</span>
            </div>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <div v-on="on" v-if="item.route != null" style="cursor: pointer;"
              class="overline font-weight-regular no-wrap" @click="goTo(item.route)">
              <v-icon v-if="item.routeType == 0">folder</v-icon>
              <v-icon v-if="item.routeType == 1">insert_drive_file</v-icon>
              <v-icon v-if="item.routeType == 2">build</v-icon>
              <span>{{item.title}}</span>
              <span v-if="item.showChildrenCount">{{counter(item)}}</span>
              <span>{{ item.extraDetails }}</span>
            </div>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
      </div>
      <recursive-item v-if="routeController != null" :routeController="routeController" v-show="item.showChildren"
        style="margin-left: 20px;" :parentID="item.id"></recursive-item>
    </div>
  </div>
</template>


<script>
  // import RouteController from "@/components/Main/NewViewTesting/RoutesForTesting/route-controller";

  export default {
    props: ["parentID", "routeController"],
    name: "recursive-item",
    data() {
      return {
        items: [],
        open: [1, 2],
        accessType: -1
      };
    },
    created() {
      let self = this;
      setTimeout(() => {
        self.accessType = sessionStorage.accessType;
      }, 2000);
    },
    methods: {
      goTo(route) {
        this.$router.push(route);
      },
      counter(item) {
        let self = this;

        var tmp = 0;
        if ((item.showChildrenCount = true)) {
          tmp = `(${self.routeController.getRoutesByParentID(item.id).length})`;
        }
        return tmp;
      }
    }
  };
</script>

<style>
  .no-wrap {
    white-space: nowrap;
    overflow: hidden;
  }

  .overline {
    font-size: 14px;
  }
</style>