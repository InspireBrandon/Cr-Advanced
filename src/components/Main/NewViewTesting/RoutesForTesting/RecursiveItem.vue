<template>
  <div>
    <div v-for="(item, idx) in routeController.getRoutesByParentID(parentID)" :key="idx">
      <div>
        <div
          class="subheading mt-1 pa-1 font-weight-bold"
          v-if="item.parentID == '0' && item.route == null"
          style="cursor: pointer;"
          @click="item.showChildren = !item.showChildren"
        >
          <v-icon v-if="item.route == null">{{ item.showChildren ? 'folder_open' : 'folder' }}</v-icon>
          {{item.title}} 
        </div>
        <div
          class="subheading mt-1 pa-1 font-weight-bold"
          style="cursor: pointer;"
          v-if="item.parentID == '0' && item.route != null"
          @click="goTo(item.route)"
        >
          <v-icon>{{ item.showChildren ? 'folder_open' : 'folder' }}</v-icon>
          {{item.title}}
        </div>
        <div
          class="body-2 font-weight-regular"
          style="cursor: pointer;"
          v-if="item.parentID != '0' && item.route == null"
          @click="item.showChildren =  !item.showChildren"
        >
          <v-icon v-if="item.route == null">{{ item.showChildren ? 'folder_open' : 'folder' }}</v-icon>
          {{item.title}}
        </div>
        <div>
          <div
            v-if="item.parentID != '0' && item.route != null"
            style="cursor: pointer;"
            class="body-1 font-weight-regular"
            @click="goTo(item.route)"
          >
            <v-icon v-if="item.routeType == 0">folder</v-icon>
            <v-icon v-if="item.routeType == 1">insert_drive_file</v-icon>
            <v-icon v-if="item.routeType == 2">stars</v-icon>
            {{item.title}}
          </div>
        </div>
      </div>
      <recursive-item v-if="routeController != null" :routeController="routeController" v-show="item.showChildren" style="margin-left: 15px;" :parentID="item.id"></recursive-item>
    </div>
  </div>
</template>


<script>
// import RouteController from "@/components/Main/NewViewTesting/RoutesForTesting/route-controller";

export default {
  props: ["parentID", 'routeController'],
  name: "recursive-item",
  data() {
    return {
      items: [],
      open: [1, 2]
    };
  },
  created() {
    let self = this;
  },
  methods: {
    goTo(route) {
      this.$router.push(route);
    },
    counter(item) {
      let self = this;

      var tmp = 0;

      tmp = items.length;
      return tmp;
    }
  }
};
</script>