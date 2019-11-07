<template>
  <v-toolbar dense dark>
    <v-btn icon @click="$router.push('/Home')">
      <v-icon>home</v-icon>
    </v-btn>
    <library ref="library"></library>
    <v-divider class="mx-2" vertical></v-divider>
    <v-toolbar-items>
      <ProductControls ref="ProductControls"></ProductControls>
    </v-toolbar-items>
    <v-divider class="mx-2" vertical></v-divider>
    <PlanogramControls></PlanogramControls>
  </v-toolbar>
</template>
<script>
  import library from "@/components/Main/Planogram/spaceplanning/src/components/Library/Library";
  import ProductControls from "@/components/Main/Planogram/spaceplanning/src/components/ProductControls/ProductControls";
  import PlanogramControls from "@/components/Main/Planogram/spaceplanning/src/components/PlanogramControls/PlanogramControls";

  export default {
    components: {
      library,
      ProductControls,
      PlanogramControls
    }
  };
</script>