<template>
  <div>
    <v-layout v-if="ProductSelected">
      <v-btn @click="DeleteItem()">Delete</v-btn>
      <v-select :items="productControls" v-model="selectedControl" label="Control" style="height: 50px;"></v-select>
      <v-btn icon flat small @click="IncreaseInputControlX"
        v-if="selectedControl == 'FACING' || selectedControl == 'POSITION'">
        <v-icon>arrow_right</v-icon>
      </v-btn>
      <v-btn icon flat small @click="DecreaseInputControlX"
        v-if="selectedControl == 'FACING' || selectedControl == 'POSITION'">
        <v-icon>arrow_left</v-icon>
      </v-btn>
      <v-btn icon flat small @click="IncreaseInputControlY" v-if="selectedControl == 'FACING'">
        <v-icon>arrow_drop_up</v-icon>
      </v-btn>
      <v-btn icon flat small @click="DecreaseInputControlY" v-if="selectedControl == 'FACING'">
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
      <v-btn flat small @click="RotateProductFacings">
        <v-icon dark>rotate_right</v-icon>Rotate
      </v-btn>
      <v-flex xs3>
        <v-select :items="productOrientationItems" v-model="selectedOrientation" label="Orientation"
          style="height: 50px;" @change="ChangeOrientation"></v-select>
        <!-- <v-overflow-btn
          :items="productOrientationItems"
          v-model="selectedOrientation"
          editable
          label="Orientation"
          hide-details
          class="pa-0"
          overflow
          small
          dense
          @change="ChangeOrientation"
        ></v-overflow-btn>-->
      </v-flex>
      <v-btn-toggle class="transparent" v-model="CapButtonToggle">
        <v-btn flat outline @click="toggleCaps">
          <v-icon>keyboard_capslock</v-icon>Cap
        </v-btn>
      </v-btn-toggle>
      <!-- <v-btn flat outline small @click="CapProduct">
        <v-icon dark>keyboard_capslock</v-icon>Cap
      </v-btn>-->
      <v-btn icon flat small @click="IncreaseCapFacings">
        <v-icon>arrow_drop_up</v-icon>
      </v-btn>
      <v-btn icon flat small @click="DecreaseCapFacings">
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>

    </v-layout>
    <YesNoModal ref="yesNoModal"></YesNoModal>
  </div>
</template>
<script>
  import CustomEmitter from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js';
  import EventBus from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js";
  import YesNoModal from '@/components/Common/YesNoModal';


  export default {
    data() {
      return {
        productOrientationItems: ["front", "side", "top"],
        selectedOrientation: "front",
        CapButtonToggle: null,
        bCapsOn: false,
        productControls: [{
            text: "Facings",
            value: "FACING"
          }
          // {
          //   text: "Position",
          //   value: "POSITION"
          // }
        ],
        selectedControl: "FACING"
      };
    },
    mounted() {},
    components: {
      YesNoModal
    },
    computed: {
      ProductSelected() {
        return this.$parent.$parent.$parent.ProductSelected;
      }
    },
    methods: {
      DeleteItem() {
        let self = this
        let stage = self.$parent.$parent.$parent;
        let event = new CustomEmitter();
        console.log(stage.selectionData);

        if ((stage.selectionData.selectedGondola != undefined && stage.selectionData.selectedGondola != null) || (stage
          .selectionData.selectedProductGroup != undefined && stage.selectionData
          .selectedProductGroup)) {
          let event = new CustomEmitter();
          self.$refs.yesNoModal.show('Are you sure you want to delete this fixture?', value => {
            if (value) {


              if (stage.selectionData.selectedGondola != undefined && stage.selectionData.selectedGondola != null) {
                let selectedFixture = stage.selectionData.selectedGondola;

                if (selectedFixture.Type == "GONDOLA") {
                  event.delete_gondola(EventBus, selectedFixture.Data, selectedFixture);
                } else {
                  event.delete_gondola(EventBus, selectedFixture.Data, selectedFixture);
                }
              }
              if (stage.selectionData.selectedProductGroup != undefined && stage.selectionData
                .selectedProductGroup) {
                let selectedProduct = stage.selectionData.selectedProductGroup;
                event.delete_product(EventBus, selectedProduct.Data, selectedProduct);
              }
            }
          })
        }


      },
      IncreaseInputControlX() {
        if (this.selectedControl == "FACING") {
          this.$parent.$parent.$parent.IncreaseFacingsX();
        } else if (this.selectedControl == "POSITION") {
          this.$parent.$parent.$parent.ChangePosition();
        }
      },
      DecreaseInputControlX() {
        if (this.selectedControl == "FACING") {
          this.$parent.$parent.$parent.DecreaseFacingsX();
        } else if (this.selectedControl == "POSITION") {
          this.$parent.$parent.$parent.ChangePosition();
        }
      },
      IncreaseInputControlY() {
        if (this.selectedControl == "FACING") {
          this.$parent.$parent.$parent.IncreaseFacingsY();
        }
      },
      DecreaseInputControlY() {
        if (this.selectedControl == "FACING") {
          this.$parent.$parent.$parent.DecreaseFacingsY();
        }
      },
      RotateProductFacings() {
        this.$parent.$parent.$parent.RotateProductFacings();
      },
      ChangeOrientation() {
        var self = this;
        self.$nextTick(function () {
          if (self.selectedOrientation == "side") {
            self.$parent.$parent.$parent.ChangeOrientation("left");
          } else {
            self.$parent.$parent.$parent.ChangeOrientation(
              self.selectedOrientation
            );
          }
        })
      },
      toggleCaps() {
        this.bCapsOn = !this.bCapsOn;
        this.$parent.$parent.$parent.ToggleCapsOnOff(this.bCapsOn);
      },
      IncreaseCapFacings() {
        this.$parent.$parent.$parent.IncreaseCaps();
      },
      DecreaseCapFacings() {
        this.$parent.$parent.$parent.DecreaseCaps();
      }
    }
  };
</script>