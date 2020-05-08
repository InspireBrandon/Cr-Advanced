<template>
  <div>
    <!-- <v-btn small @click="ToggleImages">
      Toggle images
    </v-btn>-->
    <v-menu dark>
      <v-btn slot="activator" small color="primary">Options</v-btn>
      <v-list dense>
        <!-- <v-list-tile v-if="imagesOff" @click="ToggleImages">
          <v-icon color="black" class="mr-1">image</v-icon>
          <v-list-tile-title>Toggle Images</v-list-tile-title>
        </v-list-tile>-->
        <v-menu dark offset-x right open-on-hover>
          <v-list-tile slot="activator">
            <v-icon color="black" class="mr-1">image</v-icon>
            <v-list-tile-title>Toggle Images</v-list-tile-title>
            <v-list-tile-action class="justify-end">
              <v-icon>play_arrow</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list dense>
            <v-list-tile @click="ToggleImages(0)">
              <v-list-tile-title>Off</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="ToggleImages(2)">
              <v-list-tile-title>Low</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="ToggleImages(3)">
              <v-list-tile-title>Medium</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="ToggleImages(5)">
              <v-list-tile-title>High</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- PRODUCT GROUPS -->
        <!-- <v-list-tile v-if="groupsOff" @click="ToggleGroups">
          <v-icon color="black" class="mr-1">image</v-icon>
          <v-list-tile-title>Toggle Groups</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-else @click="ToggleGroups">
          <v-icon color="white" class="mr-1">image</v-icon>
          <v-list-tile-title>Toggle Groups</v-list-tile-title>
        </v-list-tile>-->
        <!-- PRODUCT LABELS -->
        <v-list-tile v-if="labelsOn == false" @click="ToggleProductLabels">
          <v-icon color="black" class="mr-1">label_off</v-icon>
          <v-list-tile-title>Toggle Product Labels</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-else @click="ToggleProductLabels">
          <v-icon color="white" class="mr-1">label</v-icon>
          <v-list-tile-title>Toggle Product Labels</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="ToggleHighlight">
          <v-icon color="black" class="mr-1">highlight</v-icon>
          <v-list-tile-title>Toggle Highlight</v-list-tile-title>
        </v-list-tile>
        <!--  -->
        <v-list-tile @click="resetStagePosition">
          <v-icon class="mr-1">refresh</v-icon>
          <v-list-tile-title>Reset Position</v-list-tile-title>
        </v-list-tile>
        <v-menu dark offset-x right open-on-hover>
          <v-list-tile slot="activator">
            <v-icon class="mr-1">cloud_download</v-icon>
            <v-list-tile-title>Download Image</v-list-tile-title>
            <v-list-tile-action class="justify-end">
              <v-icon>play_arrow</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list dense>
            <v-list-tile @click="downloadImage(2)">
              <v-list-tile-title>Low</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="downloadImage(3)">
              <v-list-tile-title>Medium</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="downloadImage(5)">
              <v-list-tile-title>High</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-list-tile @click="refreshLibrary">
          <v-icon class="mr-1">refresh</v-icon>
          <v-list-tile-title>Refresh Library</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="planogramProperties">
          <v-icon class="mr-1">settings</v-icon>
          <v-list-tile-title>Planogram Properties</v-list-tile-title>
        </v-list-tile>
        <!-- <v-list-tile @click="loadPlanogram">
          <v-icon>folder</v-icon>
          <v-list-tile-title>Load</v-list-tile-title>
        </v-list-tile>-->
      </v-list>
    </v-menu>
    <!-- <v-btn v-if="imagesOff" small icon @click="ToggleImages">
      <v-icon color="black">image</v-icon>
    </v-btn>
    <v-btn v-else small icon @click="ToggleImages">
      <v-icon color="white">image</v-icon>
    </v-btn>
    <v-btn small @click="resetStagePosition">Reset Position</v-btn>
    <v-btn small @click="downloadImage" icon>
      <v-icon>cloud_download</v-icon>
    </v-btn>-->
    <!-- <v-btn small v-if="selectionData.selectedGondola != null" @click="downloadSelectedGondola">Download Section
    Image</v-btn>-->
    <!-- <v-btn small @click="savePlanogram">Save</v-btn>
    <v-btn small @click="loadPlanogram">Load</v-btn>-->
  </div>
</template>
<script>
import CustomEmitter from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js";
import EventBus from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js";

export default {
  data() {
    return {
      fab: false
    };
  },
  computed: {
    imagesOff() {
      return this.$parent.$parent.$parent.ImagesOff;
    },
    groupsOff() {
      return this.$parent.$parent.$parent.GroupsOff;
    },
    labelsOn() {
      return this.$parent.$parent.$parent.labelsOn;
    }
  },
  methods: {
    ToggleImages(val) {
      let self = this;
      this.$parent.$parent.$parent.ToggleImages(val);
    },
    ToggleHighlight() {
      let self = this;
      this.$parent.$parent.$parent.ToggleHighlight();
    },
    ToggleGroups() {
      let self = this;
      this.$parent.$parent.$parent.ToggleGroups();
    },
    ToggleProductLabels() {
      let self = this;
      this.$parent.$parent.$parent.ToggleProductLabels();
    },
    resetStagePosition() {
      this.$parent.$parent.$parent.resetStagePosition();
    },
    downloadImage(ratio) {
      this.$parent.$parent.$parent.downloadImage(ratio);
    },
    savePlanogram() {
      this.$parent.$parent.$parent.savePlanogram();
    },
    loadPlanogram() {
      this.$parent.$parent.$parent.loadPlanogram();
    },
    redrawPlanogram() {
      this.$parent.$parent.$parent.redrawPlanogram();
    },
    refreshLibrary() {
      this.$parent.$parent.$parent.refreshLibrary();
    },
    planogramProperties() {
      let self = this;
      let event = new CustomEmitter();
      event.modal_load(EventBus, "PLANOGRAM", null, null, null);
    }
  }
};
</script>