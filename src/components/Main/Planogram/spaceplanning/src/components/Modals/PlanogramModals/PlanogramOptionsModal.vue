<template>
  <v-dialog persistent v-model="modalShow" max-width="50vw">
    <v-card>
      <v-card-title class="text-xs-center">Planogram Properties</v-card-title>
      <v-divider></v-divider>

      <!-- dimensions -->
      <v-container elevation-5 grid-list-md>
        <v-layout row wrap>
          <v-flex xs4>
            <v-select
              :items="LabelOptions"
              v-model="label_order"
              label="Label Order"
              @change="updateStore"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-container>

      <v-layout row wrap justify-end>
        <v-card-actions class>
          <v-btn color="primary" flat @click="save">Save</v-btn>
          <v-btn color="red" flat @click="destroy">Close</v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import EventBus from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js";
import CustomEmitter from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js";

export default {
  data() {
    return {
      modalShow: false,
      label_order: "T2B",
      LabelOptions: [
        {
          text: "Top to Bottom",
          value: "T2B"
        },
        {
          text: "Bottom To Top",
          value: "B2T"
        }
      ],
      type: null,
      id: null
    };
  },
  created() {
    EventBus.$on("MODAL_LOAD", this.open);
  },
  beforeDestroy() {
    EventBus.$off("MODAL_LOAD", this.open);
  },
  methods: {
    open(eventData) {
      let self = this;
      if (eventData.type.toUpperCase() === "PLANOGRAM") {
        self.modalShow = true;
        self.newData = eventData.data;
        self.id = eventData.id;
        self.type = eventData.type;
      }
    },
    updateStore() {
      this.$store.commit("setLabelConfigOrder", this.label_order);
    },
    save() {
      let self = this;
      // let event = new CustomEmitter();
      // event.modal_saved(EventBus, self.type, self.newData, self.id);
      this.$store.commit("setLabelConfigOrder", this.label_order);
      let ctrl_label = new LabelHelper();
      ctrl_label.SetNewLabelAndPositionNumbers(self.$store)

      self.destroy();
    },
    destroy() {
      let self = this;
      self.modalShow = false;
    },
    deleteGondola() {
      event.modal_load(EventBus, "GONDOLA", null, self.GondolaData, self.ID);
    }
  }
};
</script>

<style scoped>
</style>