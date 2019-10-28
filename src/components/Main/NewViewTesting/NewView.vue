<template>
  <v-container fluid class="pa-0 ma-0" grid-list-md>
    <v-layout class="pa-0 ma-0" row wrap>
      <v-flex md2 class="pa-0 ma-0">
        <v-card class="scroll" height="calc(100vh - 64px)" tile>
          <RecursiveItem class="pa-0 ma-0" parentID="0" />
        </v-card>
      </v-flex>
      <v-flex md10 class="pa-0 ma-0">
        <v-card tile height="calc(100vh - 64px)">
        <router-view />
        </v-card>
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
    return {};
  }
};
</script>

<style scoped>
.scroll {
  overflow-y: auto;
}
</style>
  