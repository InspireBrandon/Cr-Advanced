<template>
  <div>
    <div v-for="(item, idx) in items" :key="idx">
      <div>
        <div
          class="subheading mt-1 pa-1 font-weight-bold"
          v-if="item.parentID == '0' && item.route == null"
        >
          <v-icon v-if="item.route == null">{{ open ? 'folder_open' : 'folder' }}</v-icon>
          {{item.title}}
        </div>
        <div
          class="subheading mt-1 pa-1 font-weight-bold"
          v-if="item.parentID == '0' && item.route != null"
        >
          <v-icon>link</v-icon>
          {{item.title}}
        </div>
        <div class="body-2 font-weight-regular" v-if="item.parentID != '0' && item.route == null">
          <v-icon v-if="item.route == null">{{ open ? 'folder_open' : 'folder' }}</v-icon>
          {{item.title}}
        </div>
        <div
          v-if="item.parentID != '0' && item.route != null"
          style="cursor: pointer;"
          class="body-1 font-weight-regular"
          @click="goTo(item.route)"
        >
          {{(idx + 1)}}.
          {{item.title}}
        </div>
      </div>
      <recursive-item style="margin-left: 15px;" :parentID="item.id"></recursive-item>
    </div>
  </div>
</template>


<script>
import RouteController from "@/components/Main/NewViewTesting/RoutesForTesting/route-controller";

export default {
  components: { RouteController },
  props: ["parentID"],
  name: "recursive-item",
  data() {
    return {
      items: [],
      open: [1, 2]
    };
  },
  created() {
    let self = this;

    let rc = new RouteController({
      userType: 0
    });

    self.items = rc.getRoutesByParentID(self.parentID);
    // route controller to get all items by parent id
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
