<template>
  <div>
    <div v-for="(item, idx) in routeController.getRoutesByParentID(parentID)" :key="idx">
      <div v-if="item.allowedAccessLevels.includes(parseInt(accessType))">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="overline font-weight-regular no-wrap" style="cursor: pointer;"
              v-if="item.route == null" @click="handleClickEvent(item)">
              <v-icon v-if="item.route == null">{{ item.showChildren ? 'folder_open' : 'folder' }}</v-icon>
              <span>{{item.title}}</span>
              <span>{{ item.extraDetails }}</span>
            </div>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <div v-on="on" v-if="item.route != null" style="cursor: pointer;"
              class="overline font-weight-regular no-wrap" @click="handleClickEvent(item)">
              <v-icon v-if="item.routeType == 0">folder</v-icon>
              <v-icon v-if="item.routeType == 1">insert_drive_file</v-icon>
              <v-icon v-if="item.routeType == 2">build</v-icon>
              <span>{{item.title}}</span>
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
  import RouteItem from "@/components/Main/NewViewTesting/RoutesForTesting/route-item";
  import Axios from 'axios';

  export default {
    props: ["parentID", "routeController", "clickHandler"],
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
      self.accessType = sessionStorage.accessType;
    },
    methods: {
      goTo(route) {
        this.$router.push(route);
      },
      handleClickEvent(item) {
        let self = this;

        self.routeController.closeAll

        switch (item.group) {
          case "SOFTWARE": {
            self.$router.push(item.route);
          }
          break;
        case "FOLDER": {
          item.showChildren = !item.showChildren;
        }
        break;
        case "DYNAMIC_PLANOGRAM_TASK": {
          item.showChildren = !item.showChildren;
        }
        break;
        case "DYNAMIC_PLANOGRAM_STORE": {
          item.showChildren = !item.showChildren;
        }
        break;
        }
      },
    }
  };

  const accessTypes = {
    SuperUser: 0,
    Buyer: 1,
    Supplier: 2,
    Store: 3,
  }

  const RouteType = {
    Folder: 0,
    File: 1,
    Software: 2
  }
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