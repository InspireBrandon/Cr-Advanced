<template>
  <div>
    <v-card dark tile>
      <v-toolbar flat dense dark>
        <v-btn-toggle v-model="toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat small @click="products_panel= [true]">
              <v-icon>store</v-icon>
            </v-btn>
            <span>Warehouse</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat small>
              <v-icon>assessment</v-icon>
            </v-btn>
            <span>Range</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat small>
              <v-icon>people</v-icon>
            </v-btn>
            <span>Strategy & Role</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat small>
              <v-icon>link</v-icon>
            </v-btn>
            <span>Merchandise Rules & Constraints</span>
          </v-tooltip>
          <!-- <v-tooltip bottom>
            <v-btn slot="activator" flat small>
              <v-icon>directions</v-icon>
            </v-btn>
            <span>CDT & Merch Flow</span>
          </v-tooltip> -->
          <v-tooltip bottom>
            <v-btn slot="activator" flat small>
              <v-icon>highlight</v-icon>
            </v-btn>
            <span>Life Of A Planogram</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat small>
              <v-icon>star</v-icon>
            </v-btn>
            <span>Promotions</span>
          </v-tooltip>
        </v-btn-toggle>
        <v-spacer></v-spacer>
        <v-menu dark left>
          <v-btn slot="activator" flat>
            File
          </v-btn>
          <v-list dense>
            <v-list-tile @click="openFile">
              <v-list-tile-title>Open</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="openFixture">
              <v-list-tile-title>Open Fixture</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="importRange">
              <v-list-tile-title>Select Range</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="saveFile(false)">
              <v-list-tile-title>Save</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="CheckExists()">
              <v-list-tile-title>Save New</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="saveFixture">
              <v-list-tile-title>Save As Fixture</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="rangeToPlanogram">
              <v-list-tile-title>Range To Planogram</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="planogramToRange">
              <v-list-tile-title>Planogram To Range</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="openJoinPlanogram">
              <v-list-tile-title>Join</v-list-tile-title>
            </v-list-tile>
            <!-- <v-list-tile
              v-if="PlanogramObject.status == null||PlanogramObject.status==0||PlanogramObject.status==1||PlanogramObject.status==3||PlanogramObject.status==6"
              @click="submitForApprovalPlano">
              <v-list-tile-title>Submit For Aproval</v-list-tile-title>
            </v-list-tile> -->
            <v-list-tile
              v-if="PlanogramObject.status==5||PlanogramObject.status==4||PlanogramObject.status==3||PlanogramObject.status==2||PlanogramObject.status==1"
              @click="RetractPlanogram">
              <v-list-tile-title>Retract Planogram</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="closeFile">
              <v-list-tile-title>Close</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-divider></v-divider>
      <v-layout v-if="toggle == 0" row wrap>
        <v-flex xs12>
          <v-expansion-panel v-model="details_panel">
            <v-expansion-panel-content>
              <div slot="header">Details</div>
              <v-card>
                <v-card-text>
                  <div v-if="rangingData!=null" class="details">Range Name: {{rangingData.planogramName}}
                    {{rangingData.tag}} {{ rangingData.monthsBetween }}MMA </div>
                  <div v-if="rangingData==null" class="details"> No range found, Please select one</div>
                  <div v-if="rangingData.planogramID != null" class="details">Planogram Name: {{
                    rangingData.planogramName
                    }}</div>
                  <div v-if="rangingData.planogramID != null" class="details">File Name Tag: {{
                    rangingData.tag.replace('-', "") }}</div>
                  <div v-if="rangingData.planogramID != null" class="details">Store Cluster: {{ getClusterName() }}
                  </div>
                  <div v-if="rangingData.planogramID != null" class="details">Category Cluster: XXX</div>
                  <div v-if="rangingData.planogramID != null">
                    <!-- <div v-if="rangingData.periodic" class="details">Range: </div> -->
                    <div v-if="rangingData.periodic" class="details">Period: {{ rangingData.dateFromString }} to {{ rangingData.dateToString
                      }}</div>
                  </div>
                  <v-container class="pa-0 mt-2" grid-list-md>
                    <v-layout row wrap style="overflow-y: auto;">
                      <table style="width: 100%;">
                        <thead>
                          <th style="min-width: 130px;">Name</th>
                          <th>Modules</th>
                          <th>Height (M)</th>
                          <th>Seg Width (CM)</th>
                          <th>Depth (CM)</th>
                          <th style="width: 50px;">Default</th>
                        </thead>
                        <tbody>
                          <tr v-for="(item, idx) in fixture_types" :key="idx">
                            <td>{{ item.displayName }}</td>
                            <td>
                              <input v-model="item.modules" style="width: 100%;" type="number">
                            </td>
                            <td>
                              <input v-model="item.height" style="width: 100%;" type="number">
                            </td>
                            <td>
                              <input v-model="item.segmentWidth" style="width: 100%;" type="number">
                            </td>
                            <td>
                              <input v-model="item.depth" style="width: 100%;" type="number">
                            </td>
                            <td style="text-align: center;">
                              <input v-model="item.isDefault" @change="handleDefault(item)"
                                style="width: 100%; text-align: right;" type="checkbox">
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
        <v-expansion-panel expand v-model="products_panel">
          <v-expansion-panel-content>
            <div slot="header">
              Products
            </div>
            <v-card>
              <v-layout row wrap>


                <v-flex xs2 v-if="rangingData.planogramID != null && gotData" md6 style="padding: 2px;">
                  <v-select light dense solo hide-details :items="HybridRanges" v-model="selectedHybridRange"
                    @change="onHybridChange"></v-select>
                </v-flex>
                <v-flex xs2 v-if="rangingData.planogramID != null && gotData" md3 style="padding: 2px;">
                  <v-btn small color="primary" @click="addHybridRange">add </v-btn>
                </v-flex>
                <v-flex xs2 v-if="rangingData.planogramID != null && gotData" md3 style="padding: 2px;">
                  <v-btn small color="error" @click="removeHybridRange">Delete </v-btn>
                </v-flex>
                <v-flex v-if="rangingData.planogramID != null" md6 style="padding: 2px;">

                  <v-select :disabled="!gotData" light placeholder="Clusters" @change="onClusterTypeChange" dense
                    :items="clusterTypes" v-model="selectedClusterType" solo hide-details></v-select>
                  <!-- <v-select :disabled="!gotData" light placeholder="Category Cluster" @change="onCategoryClusterChange" dense
            :items="categoryCluster" v-model="selectedCategoryCluster" solo hide-details></v-select> -->
                  <!-- v-if="showCategoryCluster==true" -->
                </v-flex>
                <v-flex v-if="rangingData.planogramID != null && gotData" md6 style="padding: 2px;">
                  <v-select light @change="onClusterOptionChange" v-if="selectedClusterType != null"
                    :placeholder="'Select ' + selectedClusterType + ' cluster'" dense
                    :items="clusterOptions[selectedClusterType]" v-model="selectedClusterOption" solo hide-details>
                  </v-select>
                </v-flex>
                <v-flex xs2 v-if="rangingData.planogramID != null && gotData" md6 style="padding: 2px;">
                  <v-checkbox hide-details label="Use Potential" v-model="$store.state.usePotential"></v-checkbox>
                </v-flex>
                <v-flex xs10 v-if="rangingData.planogramID != null && gotData" md6 style="padding: 2px;">
                  <h4>Active Items Selected</h4>
                  <div>
                    <div>Sales: R{{ ais_Sales }}</div>
                    <div>Sales Potential: R{{ ais_SalesPotential }}</div>
                  </div>
                </v-flex>

                <v-flex xs12 v-if="rangingData.planogramID != null">
                  <div>
                    <v-layout row wrap>
                      <v-flex md8>
                        <v-toolbar color="primary" dense>
                          <v-text-field dense solo flat hide-details label="Search" v-model="searchText"
                            prepend-inner-icon="search"></v-text-field>
                        </v-toolbar>
                      </v-flex>
                      <v-flex md4 style="text-align: center;">
                        <v-btn-toggle style="margin-top: 8px;" v-model="view_type" mandatory>
                          <v-btn color="primary">
                            <v-icon>list</v-icon>
                          </v-btn>
                          <v-btn color="primary">
                            <v-icon>grid_on</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </v-flex>

                      <v-flex md12 v-if="view_type == 0">
                        <v-list dark dense two-line
                          :class="{ 'details_closed': details_panel != 0, 'details_open': details_panel == 0 }"
                          class="scroll-y">
                          <template v-for="(item, index) in filteredItems">
                            <div :key="index">
                              <v-divider></v-divider>
                              <v-subheader :key="item.barcode">
                                <b>
                                  <u>BARCODE: {{ item.barcode }}</u>
                                </b>
                              </v-subheader>
                              <v-list-tile :key="index">
                                <v-img v-if="warehouse_data.imagesOn"
                                  style="width:50px !important; height:50px !important"
                                  :src="warehouseCtrl.getProductImageURL(item.barcode)" draggable="true"
                                  @drag="dragProduct" @dragstart="dragProductStart($event, item)" @dragend="clearDrag"
                                  contain></v-img>

                                <v-img v-else style="width:50px !important; height:50px !important"
                                  src="/static/img/image-placeholder.png" draggable="true" @drag="dragProduct"
                                  @dragstart="dragProductStart($event, item)" @dragend="clearDrag" contain></v-img>

                                <v-list-tile-content class="ml-2" style="width: 100%">
                                  <v-list-tile-title>{{item.description}}</v-list-tile-title>
                                  <v-list-tile-sub-title>
                                    Width: {{ numberify(item.width) }} Height: {{ numberify(item.height) }} Depth:
                                    {{ numberify(item.depth) }}
                                  </v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                  <v-menu absolute left dark>
                                    <v-btn slot="activator" small fab flat dark>
                                      <v-icon v-if="item.store_Range_Indicator == 'YES'" color="green">done</v-icon>
                                      <v-icon v-if="item.store_Range_Indicator == 'NO'" color="red">close</v-icon>
                                      <v-icon
                                        v-if="item.store_Range_Indicator == 'SELECTED' || item.store_Range_Indicator == 'SELECT'"
                                        color="blue">group_work</v-icon>
                                    </v-btn>
                                    <v-list>
                                      <v-list-tile @click="setProductIndicator('YES', item)">
                                        YES
                                      </v-list-tile>
                                      <v-list-tile @click="setProductIndicator('NO', item)">
                                        NO
                                      </v-list-tile>
                                      <v-list-tile @click="setProductIndicator('SELECTED', item)">
                                        SELECTED
                                      </v-list-tile>
                                      <v-list-tile @click="setProductIndicator('SELECT', item)">
                                        SELECT
                                      </v-list-tile>
                                    </v-list>
                                  </v-menu>
                                </v-list-tile-action>
                              </v-list-tile>
                            </div>
                          </template>
                        </v-list>
                      </v-flex>
                      <v-flex md12 v-if="view_type == 1">
                        <v-layout row wrap
                          :class="{ 'details_closed': details_panel != 0, 'details_open': details_panel == 0 }"
                          class="scroll-y">
                          <v-flex md4 v-for="(item, index) in filteredItems" :key="index">
                            <v-card>
                              <v-card-text style="text-align: center;">
                                <h4>{{ item.barcode }}</h4>
                                <v-img v-if="warehouse_data.imagesOn"
                                  style="width:50px !important; height:50px !important; margin: 0 auto;"
                                  :src="warehouseCtrl.getProductImageURL(item.barcode)" draggable="true"
                                  @drag="dragProduct" @dragstart="dragProductStart($event, item)" @dragend="clearDrag"
                                  contain></v-img>
                                <v-img v-else style="width:50px !important; height:50px !important; margin: 0 auto;"
                                  src="/static/img/image-placeholder.png" draggable="true" @drag="dragProduct"
                                  @dragstart="dragProductStart($event, item)" @dragend="clearDrag" contain></v-img>
                              </v-card-text>
                            </v-card>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-layout>
      <v-layout v-if="toggle == 1">
        <img src="static\img\tmp\strategy-real.PNG" style="height: calc(100vh - 85px);width: 100%;overflow-x: auto;"
          alt="">
      </v-layout>
      <v-layout v-if="toggle == 2" row wrap class="pa-3">
        <v-flex xs12>
          <h3>Category Characteristics</h3>
        </v-flex>
        <v-flex xs12>
          <table style="width: 100%;">
            <thead>
              <th>Measure</th>
              <th>Characteristic</th>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in categoryCharacteristics" :key="idx">
                <td>{{ item.name }}</td>
                <td>
                  <select :style="{ background: getSelectBackground(item) }" v-model="item.value" style="width: 100%;">
                    <option style="background: white;" value="H">H</option>
                    <option style="background: white;" value="M">M</option>
                    <option style="background: white;" value="L">L</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </v-flex>
        <v-flex xs12 class="mt-3">
          <h3>User Category Role</h3>
          <v-select light :items="categoryRoles" v-model="userCategoryRole" label="User Category Role" solo></v-select>
        </v-flex>
        <v-flex xs12>
          <h3>System Category Role</h3>
          <v-select light :items="categoryRoles" v-model="systemCategoryRole" label="System Category Role" solo>
          </v-select>
        </v-flex>
        <v-flex xs12 style="display: flex;">
          <h3>Note</h3>
          <v-btn style="margin-top: -8px;" @click="openHelpFileMaint" fab small color="primary">
            <v-icon>edit</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <v-card light style="height: 280px; overflow-y: auto;">
            <div v-html="note"></div>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout v-if="toggle == 3" row wrap class="pa-3">
        <v-flex xs12>
          <h3>Merchandise Principles</h3>
        </v-flex>
        <v-flex xs12>
          <table style="width: 100%;">
            <thead>
              <th>Priority</th>
              <th>Principle</th>
              <th>Select</th>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in merchandisePrinciples" :key="idx">
                <td style="width: 20px;">{{ idx + 1 }}</td>
                <td style="width: 200px;">{{ item.name }}</td>
                <td style="width: 50px;">
                  <div v-if="item.type == 'select'">
                    <select v-model="item.value" style="width: 100%;">
                      <option style="background: white;" value="Yes">Yes</option>
                      <option style="background: white;" value="No">No</option>
                    </select>
                  </div>
                  <div v-if="item.type == 'number'">
                    <input style="width: 100%;" type="number" v-model="item.value">
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </v-flex>
      </v-layout>
      <!-- <v-layout v-if="toggle == 4">
        <img src="static\img\tmp\cdt.PNG" style="height: calc(100vh - 85px);width: 100%;overflow-x: auto;" alt="">
      </v-layout> -->
      <v-layout v-if="toggle == 4" row wrap class="pa-3">
        <v-flex xs12>
          <h3>Life of a planogram</h3>
        </v-flex>
        <v-flex xs12 class="mt-3">
          <h4>Days of supply</h4>
          <v-text-field style="width: 150px;" hide-details solo light type="number"></v-text-field>
        </v-flex>
        <v-flex xs12 class="mt-3">
          <h4>New items: 20</h4>
        </v-flex>
        <v-flex xs12>
          <h4>Discontinued items: 5</h4>
        </v-flex>
        <v-flex xs12 style="display: flex;">
          <div style="width: 80%; height: 20px; background: green;"></div>
          <div style="width: 20%; height: 20px; background: red;"></div>
        </v-flex>
      </v-layout>
      <v-layout v-if="toggle == 5" row wrap class="pa-3">
        <v-container grid-list-xs class="ma-0 pa-0"
          style="height: calc(100vh - 100px); overflow-y: auto; overflow-x: hidden;">
          <v-layout row wrap>
            <v-flex xs12>
              <h2>Promotions</h2>
            </v-flex>
            <v-flex xs12>
              <h3>Title</h3>
              <v-text-field hide-details light solo></v-text-field>
            </v-flex>
            <v-flex xs12>
              <h3>Type</h3>
              <v-select light :items="promotionTypes" v-model="promotionType" solo>
              </v-select>
            </v-flex>
            <v-flex xs12>
              <h3>Store</h3>
              <v-select hide-details light :items="clusterOptions.stores" v-model="promotionStore" solo>
              </v-select>
            </v-flex>
            <v-flex xs4>
              <h3>Store Cluster</h3>
              <v-select light :items="clusterOptions.store" v-model="promotionStoreCluster" solo>
              </v-select>
            </v-flex>
            <v-flex xs4>
              <h3>Custom Cluster</h3>
              <v-select light :items="clusterOptions.custom" v-model="promotionCustomCluster" solo>
              </v-select>
            </v-flex>
            <v-flex xs4>
              <h3>Category Cluster</h3>
              <v-select light :items="clusterOptions.category" v-model="promotionCategoryCluster" solo>
              </v-select>
            </v-flex>
            <v-flex xs6>
              <h4>Pre Evaluation Start Date:</h4>
              <v-text-field hide-details v-model="preEvaluationStartDate" type="date" light solo></v-text-field>
            </v-flex>
            <v-flex xs6>
              <h4>Start Date:</h4>
              <v-text-field hide-details v-model="startDate" type="date" light solo></v-text-field>
            </v-flex>
            <v-flex xs6>
              <h4>Post Evaluation:</h4>
              <v-text-field hide-details v-model="postEvaluationDate" type="date" light solo></v-text-field>
            </v-flex>
            <v-flex xs6>
              <h4>End Date:</h4>
              <v-text-field hide-details v-model="endDate" type="date" light solo></v-text-field>
            </v-flex>
            <v-flex xs12>
              <h4>Total Promotion Days: {{ totalPromotionDays }}</h4>
            </v-flex>
            <v-flex xs8 class="mt-2">
              <h4>Enter Barcodes:</h4>
              <v-text-field hide-details solo light v-model="promoItemBarcode"></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-btn color="primary" @click="addPromotionItem" style="margin-top: 33px">add</v-btn>
            </v-flex>
            <v-flex xs12>
              <p>Number of items: {{ promoItemRefs.length }}</p>
            </v-flex>
            <!-- <v-flex xs12 class="mt-3" style="height: 350px; overflow: auto;">
              <table style="width: 100%;">
                <thead>
                  <th>Barcode</th>
                  <th>Media</th>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in promoItems" :key="idx">
                    <td>{{ item }}</td>
                    <td>SPRING PROMO PLANNED</td>
                  </tr>
                </tbody>
              </table>
            </v-flex> -->
          </v-layout>
        </v-container>
      </v-layout>
    </v-card>
    <RangeSelectorModal ref="rangeSelectorModal"></RangeSelectorModal>
    <SpacePlanSelector ref="spacePlanSelector"></SpacePlanSelector>
    <FixtureSelector ref="FixtureSelector"></FixtureSelector>
    <Spinner ref="spinner"></Spinner>
    <YesNoModal ref="yesNoModal"></YesNoModal>
    <PlanogramAprovalModal ref="PlanogramAprovalModal"></PlanogramAprovalModal>
    <PlanogramRetractionModal ref="PlanogramRetractionModal"></PlanogramRetractionModal>
    <JoinPlanogram ref="JoinPlanogram"></JoinPlanogram>
    <SizeLoader ref="SizeLoader" />
    <!-- <SaveDetailsModal ref="SaveDetailsModal" /> -->
    <Prompt ref="Prompt" />
    <HelpFileMaint ref="HelpFileMaint" />
  </div>
</template>

<script>
  import axios from "axios";
  import WarehouseController from "@/components/Main/Planogram/spaceplanning/src/libs/Warehouse/warehouse-controller.js";
  import Konva from "konva";
  import CustomEmitter from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js";
  import EventBus from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js";
  import RangeSelectorModal from '@/components/Common/RangeSelectorModal';
  import SizeLoader from '@/components/Common/SizeLoader';
  import SpacePlanSelector from '@/components/Common/SpacePlanSelector';
  import FixtureSelector from '@/components/Common/FixtureSelector';
  import Spinner from '@/components/Common/Spinner';
  import RangingController from '@/components/Apps/RangePlanning/ranging-controller'
  import LoadSavePlanogramBase from '@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/LoadSavePlanogramBase'
  import YesNoModal from '@/components/Common/YesNoModal';
  import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
  import PlanogramAprovalModal from "@/components/Main/Planogram/spaceplanning/src/components/Modals/PlanogramAproval/PlanogramAprovalModal.vue";
  import PlanogramRetractionModal from "@/components/Main/Planogram/spaceplanning/src/components/Modals/PlanogramAproval/PlanogramRetractionModal.vue";
  import JoinPlanogram from "@/components/Main/Planogram/spaceplanning/src/components/Modals/JoinPlanogram/JoinPlanogram.vue";
  import Prompt from '@/components/Common/Prompt';
  import HelpFileMaint from '../../../../../HelpFile/HelpFileMaint'
  // import SaveDetailsModal from "@/components/Main/Planogram/spaceplanning/src/components/Modals/SaveDetails/SaveDetailsModal";


  function textValue(data) {
    let self = this;
    self.text = data.clusterName;
    self.value = data.clusterID;
  }

  function inIndex(term, search) {
    return term.toUpperCase().indexOf(search.toUpperCase()) > -1;
  }

  let pixelToCmRatio = 2;
  export default {
    components: {
      RangeSelectorModal,
      SpacePlanSelector,
      Spinner,
      YesNoModal,
      PlanogramAprovalModal,
      PlanogramRetractionModal,
      JoinPlanogram,
      SizeLoader,
      Prompt,
      FixtureSelector,
      HelpFileMaint
    },
    data() {
      let width = 0;
      width = window.innerWidth * 0.4;
      return {
        promoItemRefs: [],
        HybridRanges: [],
        selectedHybridRange: null,
        lastHybridLoaded: null,
        ais_Sales: 0,
        ais_SalesPotential: 0,
        storeCount: 1,
        fixture_types: [],
        planogramDetailsID: null,
        toggle: 0,
        spacePlanID: null,
        fixtureID: null,
        spacePlanName: null,
        fixtureName: null,
        modules: 0,
        height: 0,
        width: 0,
        displays: 0,
        pallettes: 0,
        supplierStands: 0,
        bins: 0,
        view_type: 0,
        searchText: "",
        rangingData: {
          dateFromString: null,
          dateToString: null,
          monthsBetween: null,
          periodic: null,
          periodic: null,
          planogramID: null,
          planogramName: null,
          tag: null
        },
        FixtureTypes: [
          "Standard",
          "Industrial",
          "Supplier Stand",
          "Till point",
          "Custom"
        ],
        selectedFixtureType: null,
        gotData: false,
        products: [],
        hybridProducts: [],
        PlanogramObject: {
          status: null,
        },
        categoryCluster: [],
        selectedCategoryCluster: null,
        showCategoryCluster: false,
        selectedClusterType: null,
        usePotential: false,
        clusterTypes: [{
            text: "All Stores Cluster",
            value: "allStores"
          },
          {
            text: "Select Stores",
            value: "stores"
          },
          {
            text: "Store Cluster",
            value: "store"
          },
          {
            text: "Department Cluster",
            value: "department"
          },
          {
            text: "Regional Cluster",
            value: "regional"
          },
          {
            text: "Custom Cluster",
            value: "custom"
          }
        ],
        selectedClusterOption: 'allStores',
        clusterOptions: {
          allStores: [],
          category: [],
          custom: [],
          department: [],
          regional: [],
          store: [],
          stores: [],
        },
        selectedPlanogram: 1,
        customEmitter: new CustomEmitter(),
        warehouseCtrl: null,
        warehouse_data: {
          productListSearch: [],
          productListOriginal: [],
          searchTermValue: "",
          imagesOn: false
        },
        warehouse_backplate: null,
        warehouseKonva: {
          width: width,
          height: 150,
          draggable: true,
          dragBoundFunc: function (pos) {
            let x = pos.x;
            let y = this.getAbsolutePosition().y;
            return {
              x: x,
              y: y
            };
          }
        },
        details_panel: null,
        products_panel: [true],
        categoryCharacteristics: [{
            name: 'Volume %',
            value: 'M'
          },
          {
            name: 'Sales %',
            value: 'M'
          },
          {
            name: 'Profit %',
            value: 'M'
          },
          {
            name: 'Margin %',
            value: 'M'
          },
          {
            name: 'Price',
            value: 'M'
          },
          {
            name: 'Promotional Frequency %',
            value: 'M'
          },
          {
            name: 'KVI %',
            value: 'M'
          },
          {
            name: 'Price Sensitivity',
            value: 'M'
          },
          {
            name: 'Impulse Nature',
            value: 'M'
          },
          {
            name: 'Seasonal',
            value: 'M'
          },
          {
            name: 'Housebrand %',
            value: 'M'
          }
        ],
        categoryRoles: [
          "Destination",
          "Key Routine",
          "Routine",
          "Seasonal/Occasional",
          "Convenience",
        ],
        systemCategoryRole: 'Destination',
        userCategoryRole: 'Destination',
        preEvaluationStartDate: null,
        startDate: null,
        endDate: null,
        postEvaluationDate: null,
        promoItemBarcode: '',
        promoItems: [],
        hml: ['H', "M", "L"],
        merchandisePrinciples: [{
            name: 'Top Shelf Level',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Gap between product and shelf above in cm',
            type: 'number',
            value: '0'
          },
          {
            name: 'Minimum Facings Per Product',
            type: 'number',
            value: '0'
          },
          {
            name: 'Minimum Facings = Shelf Edge Lable Width',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Small Packs above Large',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Merchandise by Horizontal Block',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Allow Strip Merchandising',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Allow Vertical Merchandising',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Group by Brand within Category',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Group by Brand within Sub-Category',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Group by Brand within Segment',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Allow Cross Merchandising',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'House Brand Next to Brand Leader',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Normal Brand Flow = Premium Brand, House Brand, Brand Leader, Price Fighter',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Merchandise from Premium to Economy',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Balance Space to Sales',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Balance Space to Profit',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Balance Space to Volume',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Maximum Days of Supply',
            type: 'number',
            value: '0'
          },
          {
            name: 'Maximise ROI',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Profit Generators to Eye Level',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Merchandise High Volume then High Value items for Hot Spots',
            type: 'select',
            value: 'Yes'
          },
          {
            name: 'Minimum 1 Case of Product On Shelf',
            type: 'select',
            value: 'Yes'
          }
        ],
        promotionTypes: [
          'Print Media',
          'Cross Merchandise',
          'Radio',
          'TV',
          'In Store'
        ],
        promotionType: 'Print Media',
        promotionStore: null,
        promotionStoreCluster: null,
        promotionCustomCluster: null,
        promotionCategoryCluster: null,
        note: ""
      };
    },
    created() {
      this.planogramHelper = new LoadSavePlanogramBase(process.env.VUE_APP_API, true, null);
    },
    mounted() {
      var self = this;
      this.Images_On = this.$ImagesOn;
      self.warehouseCtrl = new WarehouseController(
        pixelToCmRatio,
        self.warehouseKonva
      );

      self.getFixtureType();
    },
    computed: {
      totalPromotionDays() {
        let self = this;

        let start = new Date(self.startDate);
        let end = new Date(self.endDate);

        if (self.startDate != null && self.endDate != null) {
          const oneDay = 24 * 60 * 60 * 1000;

          return Math.round(Math.abs((end - start) / oneDay));
        } else {
          return 0;
        }
      },
      filteredItems() {
        let self = this;
        let tmp = [];
        let final = [];
        if (self.HybridRanges != null && self.HybridRanges != undefined) {

          if (self.HybridRanges.length == 0) {
            return
          }


          // todo add switch on selected hybrid
          if (self.HybridRanges != null && self.hybridRanges != undefined) {

          }
          if (self.selectedHybridRange == self.HybridRanges[0].value) {
            self.products.forEach(el => {
              if (el.height == undefined || el.height == null || parseFloat(el.height) <= 0)
                el.height = 10

              if (el.width == undefined || el.width == null || parseFloat(el.width) <= 0)
                el.width = 10

              if (el.depth == undefined || el.depth == null || parseFloat(el.depth) <= 0)
                el.depth = 10
            })

            if (self.searchText == "") {
              tmp = self.products;
            } else {
              self.products.forEach(product => {
                if (inIndex(product.description, self.searchText) || inIndex(product.barcode, self.searchText))
                  tmp.push(product);
              })
            }

            if (tmp.length > 0) {
              for (var i = 0; i < tmp.length; i++) {
                let element = tmp[i];
                if (!self.productInStore(element.productID)) {
                  final.push(element)
                }
              }
            }
          } else {


            if (self.selectedHybridRange == "Promotion items") {
              console.log("promoItems", self.promoItems);

              self.promoItems.forEach(el => {
                if (el.height == undefined || el.height == null || parseFloat(el.height) <= 0)
                  el.height = 10

                if (el.width == undefined || el.width == null || parseFloat(el.width) <= 0)
                  el.width = 10

                if (el.depth == undefined || el.depth == null || parseFloat(el.depth) <= 0)
                  el.depth = 10
              })

              if (self.searchText == "") {
                tmp = self.promoItems;
              } else {
                self.promoItems.forEach(product => {

                  if ((inIndex(product.description, self.searchText) || inIndex(product.barcode, self.searchText)))
                    tmp.push(product);
                })
              }

              if (tmp.length > 0) {
                for (var i = 0; i < tmp.length; i++) {
                  let element = tmp[i];
                  if (!self.productInStore(element.productID)) {
                    final.push(element)
                  }
                }
              }
            } else {
              self.hybridProducts.forEach(el => {
                if (el.height == undefined || el.height == null || parseFloat(el.height) <= 0)
                  el.height = 10

                if (el.width == undefined || el.width == null || parseFloat(el.width) <= 0)
                  el.width = 10

                if (el.depth == undefined || el.depth == null || parseFloat(el.depth) <= 0)
                  el.depth = 10
              })

              if (self.searchText == "") {
                tmp = self.hybridProducts;
              } else {
                self.hybridProducts.forEach(product => {

                  if ((inIndex(product.description, self.searchText) || inIndex(product.barcode, self
                    .searchText)) &&
                    product.store_Range_Indicator == "yes")
                    tmp.push(product);
                })
              }

              if (tmp.length > 0) {
                for (var i = 0; i < tmp.length; i++) {
                  let element = tmp[i];
                  if (!self.productInStore(element.productID) && element.store_Range_Indicator == "YES") {
                    final.push(element)
                  }
                }
              }
            }

          }
        }
        return final;
      }
    },
    watch: {
      "$store.state.allProducts"(productData) {
        this.warehouse_data.productListSearch = productData.slice(
          0,
          productData.length
        );
        this.warehouse_data.productListOriginal = productData.slice(
          0,
          productData.length
        );
      },
      "$store.state.activePlanogramProducts"(ProductArr) {
        if (ProductArr.length > 0) {
          this.FilterProducts(ProductArr);
        } else {
          this.warehouse_data.productListSearch = this.warehouse_data.productListOriginal.slice(
            0,
            this.warehouse_data.productListOriginal.length
          );
        }
      }
    },
    methods: {

      onHybridChange() {
        let self = this
        self.$nextTick(() => {

          if (self.selectedHybridRange == "Promotion items") {
            self.$refs.spinner.show()
            axios.post(process.env.VUE_APP_API + 'Product/ProductByBarcodes?db=CR-Hinterland-Live', self
                .promoItemRefs)
              .then(r => {
                console.log("[addPromotionItem]", r);
                self.promoItems = []
                r.data.forEach(item => {
                  item.store_Range_Indicator = "YES"
                  self.promoItems.push(item)
                })
                self.$refs.spinner.hide()
              })
          } else {
            if (self.selectedHybridRange != self.HybridRanges[0].value && self.selectedHybridRange != self
              .lastHybridLoaded) {
              self.$refs.spinner.show()
              self.lastHybridLoaded = self.selectedHybridRange
              axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${self.selectedHybridRange}`)
                .then(r => {

                  //todo add into self.hybridproducts after going through range controller

                  self.rangingController = new RangingController(r.data);

                  self.rangingController.getSalesMonthlyTotals(() => {
                    if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                      self.hybridProducts = self.rangingController.getSalesDataByCluster(self
                        .selectedClusterType,
                        self.selectedClusterOption);

                      self.hybridProducts.forEach(el => {
                        if (el.store_Range_Indicator == "YES") {
                          self.ais_Sales = (parseFloat(self.ais_Sales) + ((parseFloat(el.sales_Retail) /
                            4) / self.storeCount)).toFixed(2);
                          self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + ((parseFloat(el
                            .sales_potential) / 4)) / self.storeCount).toFixed(2);
                        }
                      })
                    }
                    self.$refs.spinner.hide()
                  })
                })
            }
          }
        })
      },
      removeHybridRange() {
        let self = this
        self.$refs.yesNoModal.show('Are you sure you would like to remove the selected range?', value => {
          if (value == true) {
            self.HybridRanges.forEach((item, idx) => {
              if (item.value == self.selectedHybridRange) {
                self.HybridRanges.splice(idx, 1)
                //todo:remove products from space plan 
              }
            })
          }
        })
      },
      addHybridRange() {
        let self = this
        let vscd = self.$store.getters.getClusterData;

        self.rangingData.rangeID
        self.$refs.rangeSelectorModal.show(fileID => {
          self.$refs.spinner.show()
          axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fileID}`)
            .then(r => {
              self.rangingController = new RangingController(r.data);

              self.rangingController.getSalesMonthlyTotals(() => {
                if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                  self.hybridProducts = self.rangingController.getSalesDataByCluster(self.selectedClusterType,
                    self.selectedClusterOption);

                  self.hybridProducts.forEach(el => {
                    if (el.store_Range_Indicator == "YES") {
                      self.ais_Sales = (parseFloat(self.ais_Sales) + ((parseFloat(el.sales_Retail) /
                        4) / self.storeCount)).toFixed(2);
                      self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + ((parseFloat(el
                        .sales_potential) / 4)) / self.storeCount).toFixed(2);
                    }
                  })
                }
              })
              self.HybridRanges.push({
                text: r.data.planogramName,
                value: fileID
              })
              self.selectedHybridRange = fileID
              self.$refs.spinner.hide()
            })

        })

      },
      openHelpFileMaint() {
        let self = this;

        let type = "SPACE-PLANNING"

        self.$refs.HelpFileMaint.show(type + " - " + self.spacePlanID, html => {
          self.note = html;
        })
      },
      getHelpFile() {
        let self = this;

        let type = "SPACE-PLANNING"

        axios.get(process.env.VUE_APP_API + "HelpFile?systemComponent=" + type + " - " + self.spacePlanID)
          .then(r => {
            if (r.data.success) {
              self.note = r.data.helpFile.html;
            } else {
              self.note = "";
            }

            self.dialog = true;
          })
      },
      addPromotionItem() {
        let self = this;
        console.log("self.promoItemRefs", self.promoItemRefs);
        if (self.promoItemRefs == undefined || self.promoItemRefs == null) {
          self.promoItemRefs = []
        }
        let promoItems = self.promoItemBarcode.split(" ");
        console.log("promoItems", promoItems);

        promoItems.forEach(element => {
          if (element != "") {
            self.promoItemRefs.push(element)
          }
        });

        let cancreate = true;
        self.HybridRanges.forEach(item => {
          if (item.text == "Promotion items") {
            cancreate = false
          }
        })
        if (cancreate = true) {
          self.HybridRanges.push({
            text: "Promotion items",
            value: "Promotion items"
          })
        }
        self.promoItemBarcode = "";
      },
      getSelectBackground(item) {
        let self = this;

        switch (item.value) {
          case "H": {
            return "red";
          }
          break;
        case "M": {
          return "orange";
        }
        break;
        case "L": {
          return "yellow";
        }
        break;
        }
      },
      handleDefault(item) {
        // handle default flag and set comparii9torsd for dist process
        let self = this

        self.$nextTick(() => {
          self.fixture_types.forEach(e => {
            if (e == item) {
              e.isDefault = true;
            } else {
              e.isDefault = false;
            }
          })
        })
      },
      getFixtureType() {
        let self = this;

        axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        axios.get(process.env.VUE_APP_API + "Fixture_Type/Get")
          .then(r => {
            self.fixture_types = [];

            r.data.fixture_TypeList.forEach((el, idx) => {
              el["modules"] = 0;
              el["height"] = 0;
              el["segmentWidth"] = 0;
              el["depth"] = 0;
              el["isDefault"] = idx == 0 ? true : false;
              self.fixture_types.push(el);
            })

            delete axios.defaults.headers.common["TenantID"];
          })
          .catch(er => {
            console.log("Error", er)
          });
      },
      openModal() {
        let self = this
        let cluster = self.getStoreName()
        // self.$refs.SaveDetailsModal.show(null, self.rangingData, cluster)

      },
      updateLoader(data) {

        let self = this
        // if (data.spaceplanID != 0) {
        //   self.spacePlanID = data.spaceplanID
        // }
        self.$refs.SizeLoader.updateLoader(data)

      },
      setPotentail() {
        let self = this
        // clusterData["storeCluster"] = self.usePotential;
        self.$store.commit("setUsepotential", self.usePotential);

      },
      RetractPlanogram() {
        let self = this
        self.$refs.PlanogramRetractionModal.show('Retract Planogram?', (value, notesModal, selectedUser) => {

          if (value == true) {

            let systemFileApproval = {
              systemFile_ID: self.spacePlanID,
              status: 6,
              transactionDateTime: new Date(),
              notes: notesModal,

            }
            self.PlanogramObject.status = 6

            // axios.put(process.env.VUE_APP_API+`SystemFileApproval?db=CR-Devinspire&buyerID=`+self.spacePlanID,{})
            let storeID = self.PlanogramObject.storeID
            let buyerID = self.PlanogramObject.buyerID
            if (storeID == null || storeID == undefined) {
              storeID = -1
            }
            axios.post(process.env.VUE_APP_API + "SystemFileApproval?db=CR-Devinspire&buyerID=" +
              buyerID + "&storeID=" +
              storeID, {
                systemFileApproval: systemFileApproval
              })
          }
        })
      },
      submitForApprovalPlano(item) {
        let self = this
        self.$refs.PlanogramAprovalModal.show('Submit planogram for aproval?', (value, notesModal, selectedUser) => {

          if (value == true) {

            let systemFileApproval = {
              systemFile_ID: self.spacePlanID,
              status: 2,
              transactionDateTime: new Date(),
              notes: notesModal,
              buyerID: selectedUser
            }

            // axios.put(process.env.VUE_APP_API+`SystemFileApproval?db=CR-Devinspire&buyerID=`+self.spacePlanID,{})
            let storeID = self.PlanogramObject.storeID
            self.PlanogramObject.status = 2
            if (storeID == null || storeID == undefined) {
              storeID = -1
            }
            axios.post(process.env.VUE_APP_API + "SystemFileApproval?db=CR-Devinspire&buyerID=" +
              selectedUser + "&storeID=" +
              storeID, {
                systemFileApproval: systemFileApproval
              })
          }
        })
      },
      rangeToPlanogram() {
        let self = this;
        let ctrl_store = new StoreHelper();
        let allProducts = self.products;

        let storeProducts = self.$store.state.activePlanogramProducts;

        allProducts.forEach(product => {
          storeProducts.forEach((storeProduct, idx) => {

            if (storeProduct.Data.barcode == product.barcode) {

              var needsDraw = false;

              if (storeProduct.Data.height != parseFloat(product.height) || storeProduct.Data.width !=
                parseFloat(product.width) || storeProduct.Data.depth != parseFloat(product.depth)) {
                needsDraw = true;
              }

              storeProduct.Data.height = parseFloat(product.height);
              storeProduct.Data.width = parseFloat(product.width);
              storeProduct.Data.depth = parseFloat(product.depth);

              if (storeProduct.Data.tray_Barcode != product.tray_Barcode ||
                storeProduct.Data.tray_Qty != parseFloat(product.tray_Qty) ||
                storeProduct.Data.tray_Height != parseFloat(product.tray_Height) ||
                storeProduct.Data.tray_Width != parseFloat(product.tray_Width) ||
                storeProduct.Data.tray_Depth != parseFloat(product.tray_Depth)) {
                needsDraw = true;
              }

              storeProduct.Data.tray_Barcode = product.tray_Barcode;
              storeProduct.Data.tray_Qty = parseFloat(product.tray_Qty);
              storeProduct.Data.tray_Height = parseFloat(product.tray_Height);
              storeProduct.Data.tray_Width = parseFloat(product.tray_Width);
              storeProduct.Data.tray_Depth = parseFloat(product.tray_Depth);

              if (storeProduct.Data.case_Barcode != product.case_Barcode ||
                storeProduct.Data.case_Qty != parseFloat(product.case_Qty) ||
                storeProduct.Data.case_Height != parseFloat(product.case_Height) ||
                storeProduct.Data.case_Width != parseFloat(product.case_Width) ||
                storeProduct.Data.case_Depth != parseFloat(product.case_Depth)) {
                needsDraw = true;
              }

              storeProduct.Data.case_Barcode = product.case_Barcode;
              storeProduct.Data.case_Qty = parseFloat(product.case_Qty);
              storeProduct.Data.case_Height = parseFloat(product.case_Height);
              storeProduct.Data.case_Width = parseFloat(product.case_Width);
              storeProduct.Data.case_Depth = parseFloat(product.case_Depth);

              if (storeProduct.Data.shrink_Barcode != product.shrink_Barcode ||
                storeProduct.Data.shrink_Qty != parseFloat(product.shrink_Qty) ||
                storeProduct.Data.shrink_Height != parseFloat(product.shrink_Height) ||
                storeProduct.Data.shrink_Width != parseFloat(product.shrink_Width) ||
                storeProduct.Data.shrink_Depth != parseFloat(product.shrink_Depth)) {
                needsDraw = true;
              }

              storeProduct.Data.shrink_Barcode = product.shrink_Barcode;
              storeProduct.Data.shrink_Qty = parseFloat(product.shrink_Qty);
              storeProduct.Data.shrink_Height = parseFloat(product.shrink_Height);
              storeProduct.Data.shrink_Width = parseFloat(product.shrink_Width);
              storeProduct.Data.shrink_Depth = parseFloat(product.shrink_Depth);

              if (storeProduct.Data.pallet_Barcode != product.pallet_Barcode ||
                storeProduct.Data.pallet_Qty != parseFloat(product.pallet_Qty) ||
                storeProduct.Data.pallet_Height != parseFloat(product.pallet_Height) ||
                storeProduct.Data.pallet_Width != parseFloat(product.pallet_Width) ||
                storeProduct.Data.pallet_Depth != parseFloat(product.pallet_Depth)) {
                needsDraw = true;
              }

              storeProduct.Data.pallet_Barcode = product.pallet_Barcode;
              storeProduct.Data.pallet_Qty = parseFloat(product.pallet_Qty);
              storeProduct.Data.pallet_Height = parseFloat(product.pallet_Height);
              storeProduct.Data.pallet_Width = parseFloat(product.pallet_Width);
              storeProduct.Data.pallet_Depth = parseFloat(product.pallet_Depth);

              if (storeProduct.Data.volume_potential != parseFloat(product.volume_potential) || storeProduct
                .Data
                .sales_potential != parseFloat(product.sales_potential)) {
                needsDraw = true;
              }

              storeProduct.Data.volume_potential = parseFloat(product.volume_potential);
              storeProduct.Data.sales_potential = parseFloat(product.sales_potential);

              if (needsDraw) {
                ctrl_store.setProductData(self.$store, storeProduct.Data, product.barcode);
                storeProduct.ChangeDimensions(storeProduct);
              }
            }
          })
        })
      },
      dimensionChange(planoProduct, rangeProduct) {
        if (planoProduct.height == rangeProduct.height && planoProduct.width == rangeProduct.width && planoProduct
          .depth ==
          rangeProduct.depth) {
          return false;
        } else {
          return true;
        }
      },
      planogramToRange() {
        let self = this;
        let ctrl_store = new StoreHelper();
        let storePlanogramItemProducts = ctrl_store.getAllPlanogramItemsByType(self.$store, "PRODUCT");
        let allProducts = self.rangingController.getAllRangeProducts();

        storePlanogramItemProducts.forEach(spip => {
          allProducts.forEach(ap => {

            ap.height = parseFloat(ap.height);
            ap.width = parseFloat(ap.width);
            ap.depth = parseFloat(ap.depth);

            ap.tray_Barcode = ap.tray_Barcode;
            ap.tray_Height = parseFloat(ap.tray_Height);
            ap.tray_Width = parseFloat(ap.tray_Width);
            ap.tray_Depth = parseFloat(ap.tray_Depth);

            ap.case_Barcode = ap.case_Barcode;
            ap.case_Height = parseFloat(ap.case_Height);
            ap.case_Width = parseFloat(ap.case_Width);
            ap.case_Depth = parseFloat(ap.case_Depth);

            ap.shrink_Barcode = ap.shrink_Barcode;
            ap.shrink_Height = parseFloat(ap.shrink_Height);
            ap.shrink_Width = parseFloat(ap.shrink_Width);
            ap.shrink_Depth = parseFloat(ap.shrink_Depth);

            ap.pallet_Barcode = ap.pallet_Barcode;
            ap.pallet_Height = parseFloat(ap.pallet_Height);
            ap.pallet_Width = parseFloat(ap.pallet_Width);
            ap.pallet_Depth = parseFloat(ap.pallet_Depth);

            if (ap.barcode == spip.Data.barcode) {
              ap.height = parseFloat(spip.Data.height);
              ap.width = parseFloat(spip.Data.width);
              ap.depth = parseFloat(spip.Data.depth);

              ap.tray_Barcode = spip.Data.tray_Barcode;
              ap.tray_Height = parseFloat(spip.Data.tray_Height);
              ap.tray_Width = parseFloat(spip.Data.tray_Width);
              ap.tray_Depth = parseFloat(spip.Data.tray_Depth);

              ap.case_Barcode = spip.Data.case_Barcode;
              ap.case_Height = parseFloat(spip.Data.case_Height);
              ap.case_Width = parseFloat(spip.Data.case_Width);
              ap.case_Depth = parseFloat(spip.Data.case_Depth);

              ap.shrink_Barcode = spip.Data.shrink_Barcode;
              ap.shrink_Height = parseFloat(spip.Data.shrink_Height);
              ap.shrink_Width = parseFloat(spip.Data.shrink_Width);
              ap.shrink_Depth = parseFloat(spip.Data.shrink_Depth);

              ap.pallet_Barcode = spip.Data.pallet_Barcode;
              ap.pallet_Height = parseFloat(spip.Data.pallet_Height);
              ap.pallet_Width = parseFloat(spip.Data.pallet_Width);
              ap.pallet_Depth = parseFloat(spip.Data.pallet_Depth);
            }
          });
        })

        alert("Planogram to range complete");
      },
      productInStore(productID) {
        let self = this;

        let retval = false;
        let products = self.$store.getters.getAllPlanogramActiveProducts;

        for (let index = 0; index < products.length; index++) {
          const element = products[index];
          if (element.Data.productID == productID)
            retval = true;
        }

        return retval;
      },
      getCategoryCluster(planogramID) {
        var self = this
        axios.get(process.env.VUE_APP_API + `Clusters/CategoryCluster?planogramID=${planogramID}`).then(r => {

          r.data.forEach(element => {
            self.categoryCluster.push({
              text: element.displayname,
              value: element.id,
            })
          })

        }).catch(e => {
          console.log(e);
        })

      },
      importRange() {
        let self = this;

        self.products = [];

        self.$refs.rangeSelectorModal.show(fileID => {
          self.$store.commit("setRangeID", fileID);
          axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fileID}`)
            .then(r => {
              if (r.data) {
                self.getCategoryCluster(r.data.planogramID)
                self.rangingData.dateFromString = r.data.dateFromString;
                self.rangingData.dateToString = r.data.dateToString;
                self.rangingData.monthsBetween = r.data.monthsBetween;
                self.rangingData.periodic = r.data.periodic;
                self.rangingData.planogramID = r.data.planogramID;
                self.rangingData.planogramName = r.data.planogramName;
                self.rangingData.tag = r.data.tag;
                self.$store.commit("setPlanogramName", r.data.planogramName);
                self.setRangingClusterData(r.data.clusterData);

                self.rangingController = new RangingController(r.data);

                self.rangingController.getSalesMonthlyTotals(() => {
                  if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                    self.products = self.rangingController.getSalesDataByCluster(self.selectedClusterType,
                      self.selectedClusterOption);

                    self.ais_Sales = 0;
                    self.ais_SalesPotential = 0;

                    self.products.forEach(el => {
                      if (el.store_Range_Indicator == "YES") {
                        self.ais_Sales = (parseFloat(self.ais_Sales) + ((parseFloat(el.sales_Retail) /
                          4) / self.storeCount)).toFixed(2);
                        self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + ((parseFloat(el
                          .sales_potential) / 4)) / self.storeCount).toFixed(2);
                      }
                    })

                    self.storeCount = self.rangingController.getStoreCountByCluster(self.selectedClusterType,
                      self
                      .selectedClusterOption);
                    self.$store.commit("setCurrentStoreCount", self.storeCount);
                  }
                  self.gotData = true;
                })
              } else {
                alert("Failed to get Range Data.");
              }
            })
            .catch(e => {
              alert("Failed to get range data. " + e)
            })
        })
      },
      getFixtureDetails(spacePlanID) {
        let self = this;

        axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        axios.get(process.env.VUE_APP_API +
          `Planogram_Details_Simple?SystemFileID=${spacePlanID}&name=${self.generateName(self.fixture_types)}`).then(
          r => {
            self.fixture_types = [];

            delete axios.defaults.headers.common["TenantID"];

            let hasDefault = false;

            r.data.planogramDetails_fixtures.forEach(el => {
              if (el.isDefault == true)
                hasDefault = true;
            })

            if (!hasDefault)
              r.data.planogramDetails_fixtures[0].isDefault = true;

            self.fixture_types = r.data.planogramDetails_fixtures;
          })
      },
      openFile() {
        let self = this;

        self.$refs.spacePlanSelector.show((spacePlanID, item) => {

          setTimeout(() => {
            self.PlanogramObject = item

            self.planogramHelper.setCreate(false);
            let stage = self.$parent.$children[0].$children[2].getStage();
            stage.destroyChildren(); // destroy first
            self.$parent.$children[0].createNewLayer("LoadInit");
            let masterLayer = self.$parent.$children[0].MasterLayer;

            let pxlRatio = 3; // TODO: Figure out why this is 1 and not 3, perhaps a timing issue?

            // self.$refs.spinner.show();
            self.$refs.SizeLoader.show()
            self.spacePlanID = spacePlanID;
            self.fixtureID = null;

            self.getHelpFile();

            self.getFixtureDetails(self.spacePlanID);

            self.planogramHelper.loadPlanogram(spacePlanID, self.$store, masterLayer, stage, pxlRatio, self
              .setClusterAndDimensionData,
              self.$refs.SizeLoader.close, self.updateLoader, () => {
                self.rangeToPlanogram();

                // if (self.HybridRanges.length == 0) {
                  self.HybridRanges = []
                  let vscd = self.$store.getters.getClusterData;
                  self.HybridRanges.push({
                    text: self.rangingData.planogramName + " (PRIMARY)",
                    value: vscd.rangeID
                  })
                // }
                self.selectedHybridRange = self.HybridRanges[0].value

              });
            //initialising hybrid range selector

          }, 1000);
        })
      },
      openFixture() {
        let self = this;

        self.$refs.FixtureSelector.show((fixtureID, item) => {

          setTimeout(() => {
            self.PlanogramObject = item

            self.planogramHelper.setCreate(false);
            let stage = self.$parent.$children[0].$children[2].getStage();
            stage.destroyChildren(); // destroy first
            self.$parent.$children[0].createNewLayer("LoadInit");
            let masterLayer = self.$parent.$children[0].MasterLayer;

            let pxlRatio = 3; // TODO: Figure out why this is 1 and not 3, perhaps a timing issue?

            self.fixtureID = fixtureID;
            self.spacePlanID = null;

            self.planogramHelper.loadFixture(fixtureID, self.$store, masterLayer, stage, pxlRatio, data => {
              self.fixtureName = data.jsonObject.name
            });
          }, 1000);
        })
      },
      setClusterAndDimensionData(clusterData, hybridRanges, promoItemRefs, dimension, spacePlanName,
        updatePlanoDataCallback) {
        let self = this;

        self.spacePlanName = spacePlanName == undefined ? "" : spacePlanName;
        self.HybridRanges = hybridRanges
        if (promoItemRefs == null || promoItemRefs == undefined) {
          self.promoItemRefs = []
        } else {
          self.promoItemRefs = promoItemRefs
        }

        self.modules = dimension == undefined || dimension.modules == undefined ? 0 : dimension.modules;
        self.height = dimension == undefined || dimension.height == undefined ? 0 : dimension.height;
        self.width = dimension == undefined || dimension.width == undefined ? 0 : dimension.width;
        self.displays = dimension == undefined || dimension.displays == undefined ? 0 : dimension.displays;
        self.pallettes = dimension == undefined || dimension.pallettes == undefined ? 0 : dimension.pallettes;
        self.supplierStands = dimension == undefined || dimension.supplierStands == undefined ? 0 : dimension
          .supplierStands;
        self.bins = dimension == undefined || dimension.bins == undefined ? 0 : dimension.bins;
        self.selectedFixtureType = dimension == undefined || dimension.fixtureType == undefined ? 0 : dimension
          .fixtureType;

        if (clusterData.rangeID != null) {

          setTimeout(() => {
            self.updateLoader({
              currentFileSize: 0,
              FileTotalSize: 0,
            })
            var startTime = new Date()
            let config = {
              onDownloadProgress: progressEvent => {
                var currentFileSize = progressEvent.loaded * 0.000001
                var FileTotalSize = progressEvent.total * 0.000001
                var progress = (currentFileSize / FileTotalSize) * 100
                var TIME_TAKEN = new Date().getTime() - startTime.getTime()
                var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)
                self.updateLoader({
                  text1: "Downloading Range",
                  text2: "File Progress",
                  currentFileSize: currentFileSize,
                  FileTotalSize: FileTotalSize,
                  progress: progress / 2,
                  currentFile: 1,
                  totalFiles: 2,
                  DownloadSpeed: DownloadSpeed,
                })
              }
            }
            axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${clusterData.rangeID}`,
                config)
              .then(r => {
                self.updateLoader({
                  currentFile: 2,
                })

                self.$store.commit("setRangeID", clusterData.rangeID);
                self.$store.commit("setPlanogramName", r.data.planogramName);
                self.setRangingClusterData(r.data.clusterData);
                self.getCategoryCluster(r.data.planogramID)
                self.gotData = true;
                self.rangingController = new RangingController(r.data);

                self.rangingController.getSalesMonthlyTotals(() => {
                  self.selectedClusterType = clusterData.clusterType;
                  self.$store.commit("setClusterName", clusterData.storeCluster);
                  self.$store.commit("setClusterType", clusterData.clusterType);
                  self.$store.commit("setClusterID", clusterData.clusterID);
                  self.$store.commit("setDaysBetween", (r.data.monthsBetween * 30));

                  self.rangingData.dateFromString = clusterData.dateFromString;
                  self.rangingData.dateToString = clusterData.dateToString;
                  self.rangingData.monthsBetween = clusterData.monthsBetween;
                  self.rangingData.periodic = clusterData.periodic;
                  self.rangingData.planogramID = clusterData.planogramID;
                  self.rangingData.planogramName = clusterData.planogramName;
                  self.rangingData.tag = clusterData.tag;
                  self.selectedFixtureType = clusterData.fixtureType;

                  let rangingFileDetails = self.rangingController.getRangingFile();

                  if (rangingFileDetails.categoryCharacteristics != undefined && rangingFileDetails
                    .categoryCharacteristics != null) {
                    self.categoryCharacteristics.forEach(cc => {
                      for (var prop in rangingFileDetails.categoryCharacteristics) {

                        if (cc.name == prop) {
                          cc.value = rangingFileDetails.categoryCharacteristics[prop];
                        }
                      }
                    });

                    self.userCategoryRole = rangingFileDetails.categoryCharacteristics.userCategoryRole;
                    self.systemCategoryRole = rangingFileDetails.categoryCharacteristics.systemCategoryRole;
                  }

                  if (clusterData.storeID != null || clusterData.storeID != undefined) {

                    self.getStores()
                    self.selectedClusterType = "stores"
                    // self.clusterOptions[stores]=clusterData.storeID

                    self.selectedClusterOption = clusterData.storeID

                    self.onClusterOptionChange()
                  }

                  self.updateLoader({
                    text1: "Rendering Planogram"
                  })

                  setTimeout(() => {
                    if (clusterData.clusterType != null && clusterData.storeID == null || clusterData
                      .clusterType !=
                      undefined && clusterData.storeID == undefined) {
                      self.selectedClusterOption = clusterData.clusterID;

                      self.products = self.rangingController.getSalesDataByCluster(self
                        .selectedClusterType,
                        self
                        .selectedClusterOption);

                      self.storeCount = self.rangingController.getStoreCountByCluster(self
                        .selectedClusterType,
                        self.selectedClusterOption);
                      self.$store.commit("setCurrentStoreCount", self.storeCount);

                      self.ais_Sales = 0;
                      self.ais_SalesPotential = 0;

                      self.products.forEach(el => {
                        if (el.store_Range_Indicator == "YES") {
                          self.ais_Sales = (parseFloat(self.ais_Sales) + ((parseFloat(el
                              .sales_Retail) /
                            4) / self.storeCount)).toFixed(2);
                          self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + ((
                            parseFloat(el
                              .sales_potential) / 4)) / self.storeCount).toFixed(2);
                        }
                      })
                    }
                    self.$refs.SizeLoader.close()
                    updatePlanoDataCallback(self.products);
                  }, 2000)
                })
              })
              .catch(e => {
                alert("Failed to get range file from server");
                updatePlanoDataCallback(null)
                self.$refs.SizeLoader.close()
              })
          }, 1000);
        } else {
          self.$refs.SizeLoader.close()
          updatePlanoDataCallback(null);
        }
      },
      closeFile() {
        let self = this;

        // window.location.reload();

        let stage = self.$parent.$children[0].$children[2].getStage();
        stage.destroyChildren(); // destroy first
        self.$parent.$children[0].createNewLayer("LoadInit");
        let masterLayer = self.$parent.$children[0].MasterLayer;
        this.planogramHelper.resetStage(self.$store, masterLayer, stage);
        self.products = [];
        self.selectedClusterType = null;
        self.selectedClusterOption = null;
        self.rangingData.planogramID = null;
        for (var prop in self.rangingData) {
          self.rangingData[prop] = null
        }
        self.modules = 0
        self.height = 0
        self.width = 0
        self.displays = 0
        self.pallettes = 0
        self.supplierStands = 0
        self.bins = 0
        self.spacePlanID = null;
        self.fixtureID = null;

        self.fixture_types.forEach((el, idx) => {
          el.modules = 0;
          el.height = 0;
          el.segmentWidth = 0;
          el.depth = 0;
          el.isDefault = idx == 0 ? true : false;
        })
      },
      CheckExistsID() {
        let self = this

        let planogramName = self.generateName(self.fixture_types);

        let tmp = {
          systemFile: {
            systemUserID: 10,
            folder: "Space Planning",
            name: planogramName,
            isFolder: true,
            extension: "",
            id: self.spacePlanID,
          },
        }

        axios.post(process.env.VUE_APP_API + "SystemFile/ExistsID?db=cr-devinspire", tmp).then(
          r => {
            if (r.data == true) {
              self.$refs.yesNoModal.show('File already exists Would you like to overwrite it?', value => {
                if (value == true) {
                  self.saveFile(false)
                }
              })
            } else {
              self.saveNew(false)
            }
          })
      },
      CheckExists() {
        let self = this
        let planogramName = self.generateName(self.fixture_types);

        let tmp = {
          systemFile: {
            systemUserID: 10,
            folder: "Space Planning",
            name: planogramName,
            isFolder: true,
            extension: "",
            id: self.spacePlanID,
          },
        }
        axios.post(process.env.VUE_APP_API + "SystemFile/Exists?db=cr-devinspire", tmp).then(
          r => {
            if (r.data == true) {
              self.$refs.yesNoModal.show('File already exists Would  you like to overwrite it?', value => {
                if (value == true) {
                  self.saveFile(false)
                }
              })
            } else {
              self.saveNew(false)
            }
          })
      },
      saveFile(isNew) {
        let self = this;
        let parent = self.$parent.$children[0].$children[2];
        let stage = parent.getStage();

        let b64 = parent.$parent.getImageBytes(2);
        let image = parent.$parent.b64toBlob(b64, "image/png")

        let clusterData = self.rangingData;
        let vscd = self.$store.getters.getClusterData;

        clusterData["storeCluster"] = self.getClusterName();
        clusterData["clusterID"] = vscd.clusterID;
        clusterData["clusterType"] = vscd.clusterType;
        clusterData["fixtureType"] = self.selectedFixtureType;
        clusterData["clusterName"] = vscd.clusterName;
        clusterData["rangeID"] = vscd.rangeID;
        clusterData["storeID"] = vscd.storeID;
        clusterData["storeName"] = vscd.storeName;
        clusterData["categoryCluster"] = vscd.categoryCluster;

        let tmpSpacePlanID = self.spacePlanID

        self.saveRangeFile(vscd.rangeID, () => {
          self.$store.getters.getAllPlanogramActiveProducts.forEach(el => {
            self.rangingController.setAllProductData(el.Data);
          })

          let rangingFileUpdated = self.rangingController.getRangingFile();

          self.planogramHelper.setCreate(self.spacePlanID == null || isNew);

          if (self.spacePlanID == null) {

            self.$refs.SizeLoader.show()

            self.planogramHelper.save(self.$store, stage, clusterData, {
                modules: self.modules,
                height: self.height,
                width: self.width,
                displays: self.displays,
                pallettes: self.pallettes,
                supplierStands: self.supplierStands,
                bins: self.bins,
                FixtureType: self.selectedFixtureType
              }, self.spacePlanID, self.generateName(self.fixture_types), true, image, self.updateLoader, self
              .$refs.SizeLoader.close, self.fixture_types, self.storeCount, self.HybridRanges, self.promoItemRefs,
              data => {
                self.spacePlanID = data
              })
          } else {
            self.$refs.yesNoModal.show('Update file name with latest configuration?', value => {
              if (value == true) {
                self.$refs.SizeLoader.show()
                self.planogramHelper.save(self.$store, stage, clusterData, {
                    modules: self.modules,
                    height: self.height,
                    width: self.width,
                    displays: self.displays,
                    pallettes: self.pallettes,
                    supplierStands: self.supplierStands,
                    FixtureType: self.selectedFixtureType,
                    bins: self.bins
                  }, self.spacePlanID, self.generateName(self.fixture_types), value, image, self.updateLoader,
                  self
                  .$refs
                  .SizeLoader.close, self.fixture_types, self.storeCount, self.HybridRanges, self
                  .promoItemRefs, callback => {
                    self.spacePlanID = callback
                  })
              } else {
                self.$refs.SizeLoader.show()
                self.planogramHelper.save(self.$store, stage, clusterData, {
                    modules: self.modules,
                    height: self.height,
                    width: self.width,
                    displays: self.displays,
                    pallettes: self.pallettes,
                    supplierStands: self.supplierStands,
                    FixtureType: self.selectedFixtureType,
                    bins: self.bins
                  }, self.spacePlanID, self.spacePlanName, value, image, self.updateLoader, self.$refs
                  .SizeLoader.close, self.fixture_types, self.storeCount, self.HybridRanges, self
                  .promoItemRefs, callback => {
                    self.spacePlanID = callback
                  })
              }
            })
          }
        })
      },
      saveNew(isNew) {
        let self = this;
        let parent = self.$parent.$children[0].$children[2];
        let stage = parent.getStage();
        let b64 = parent.$parent.getImageBytes(2);
        let image = parent.$parent.b64toBlob(b64, "image/png")
        let clusterData = self.rangingData;
        let vscd = self.$store.getters.getClusterData;

        clusterData["storeCluster"] = self.getClusterName();
        clusterData["clusterID"] = vscd.clusterID;
        clusterData["clusterType"] = vscd.clusterType;
        clusterData["clusterName"] = vscd.clusterName;
        clusterData["rangeID"] = vscd.rangeID;
        clusterData["fixtureType"] = self.selectedFixtureType;
        clusterData["storeID"] = vscd.storeID;
        clusterData["storeName"] = vscd.storeName;
        clusterData["categoryCluster"] = vscd.categoryCluster;
        let tmpSpacePlanID = self.spacePlanID
        self.spacePlanID = null
        self.fixtureID = null

        self.saveRangeFile(vscd.rangeID, () => {
          self.$store.getters.getAllPlanogramActiveProducts.forEach(el => {
            self.planogramHelper.setCreate(self.spacePlanID == null || isNew);
          })

          if (self.spacePlanID == null) {

            self.$refs.SizeLoader.show()

            self.planogramHelper.save(self.$store, stage, clusterData, {
                modules: self.modules,
                height: self.height,
                width: self.width,
                displays: self.displays,
                pallettes: self.pallettes,
                supplierStands: self.supplierStands,
                FixtureType: self.selectedFixtureType,
                bins: self.bins
              }, self.spacePlanID, self.generateName(self.fixture_types), true, image, self.updateLoader,
              self
              .$refs
              .SizeLoader
              .close, self.fixture_types, self.storeCount, self.HybridRanges, self.promoItemRefs, data => {
                self.spacePlanID = data
              })
          }
        })
      },
      saveFixture() {
        let self = this;

        self.$refs.Prompt.show(self.fixtureName, "Enter a name for the fixture", 'Name', fixtureName => {
          let parent = self.$parent.$children[0].$children[2];
          let stage = parent.getStage();

          let b64 = parent.$parent.getImageBytes(2);
          let image = parent.$parent.b64toBlob(b64, "image/png")

          self.planogramHelper.setCreate(self.fixtureID == null);

          self.planogramHelper.saveFixture(self.$store, fixtureName, image, self.fixtureID, systemFileID => {
            console.log(systemFileID);
            self.spacePlanID = null;
            self.fixtureID = systemFileID;
            self.fixtureName = fixtureName;
          });
        })
      },
      saveRangeFile(rangeID, callback) {
        let self = this;

        if (rangeID != null) {
          self.$store.getters.getAllPlanogramActiveProducts.forEach(el => {
            self.rangingController.setAllProductData(el.Data);
          })

          let rangingFileUpdated = self.rangingController.getRangingFile();

          rangingFileUpdated.categoryCharacteristics = {}

          self.categoryCharacteristics.forEach(el => {
            rangingFileUpdated.categoryCharacteristics[el.name] = el.value;
          })

          rangingFileUpdated.categoryCharacteristics.userCategoryRole = self.userCategoryRole;
          rangingFileUpdated.categoryCharacteristics.systemCategoryRole = self.systemCategoryRole;

          console.log(rangingFileUpdated)

          axios.put(process.env.VUE_APP_API + "SystemFile/JSON/NoRename?db=CR-Devinspire&id=" + rangeID,
              rangingFileUpdated)
            .then(r => {
              callback();
            })

        } else {
          callback();
        }
      },
      setRangingClusterData(data) {
        let self = this;

        data.allStoresClusters.forEach(element => {
          self.clusterOptions.allStores.push(new textValue(element));
        });

        data.categoryClusters.forEach(element => {
          self.clusterOptions.category.push(new textValue(element));
        });

        data.customClusters.forEach(element => {
          self.clusterOptions.custom.push(new textValue(element));
        });

        data.departmentClusters.forEach(element => {
          self.clusterOptions.department.push(new textValue(element));
        });

        data.regionalClusters.forEach(element => {
          self.clusterOptions.regional.push(new textValue(element));
        });

        data.storeClusters.forEach(element => {
          self.clusterOptions.store.push(new textValue(element));
        });
      },
      numberify(string) {
        return parseFloat(string).toFixed(2);
      },
      FilterFromEvent(data) {
        let self = this;
        self.FilterProducts(data.data);
      },
      FilterProducts(products) {
        let self = this;

        var itemToAdd = self.contains(
          this.warehouse_data.productListOriginal,
          products,
          false
        );

        var itemToRemove = self.contains(
          this.warehouse_data.productListOriginal,
          products,
          true
        );

        if (itemToAdd.length > 0) {
          itemToAdd.forEach(item => {
            var found = self.warehouse_data.productListSearch.find(el => {
              return el == item;
            });

            if (found == undefined) {
              self.warehouse_data.productListSearch.push(item);
            }
          });
        }

        if (itemToRemove.length > 0) {
          itemToRemove.forEach(item => {
            var found = self.warehouse_data.productListSearch.find(el => {
              return el == item;
            });

            if (found != undefined) {
              self.warehouse_data.productListSearch.splice(
                self.warehouse_data.productListSearch.indexOf(item),
                1
              );
            }
          });
        }
      },
      contains(sourceArr, compareArr, include) {
        let self = this;
        var retVal = [];
        sourceArr.forEach(sourceItem => {
          compareArr.forEach(comapreItem => {
            if (include) {
              if (sourceItem.Barcode == comapreItem.Barcode) {
                retVal.push(sourceItem);
              }
            } else {
              if (sourceItem.Barcode != comapreItem.Barcode) {
                retVal.push(sourceItem);
              }
            }
          });
        });

        return retVal;
      },
      dragProductStart(ev, data) {
        let self = this
        console.log("dragProductStart", data);
        if (self.selectedHybridRange != self.HybridRanges[0].value) {
          data.isHybridProduct = true
        }

        window.warehouseDragData = data;
      },
      dragProduct(ev) {
        ev.currentTarget.style.border = "dashed";
      },
      clearDrag(ev) {
        ev.currentTarget.style.border = "none";
        window.warehouseDragData = null;
      },
      onClusterTypeChange() {
        let self = this;
        self.$nextTick(() => {

          if (self.selectedClusterType == "stores") {
            self.getStores()

          }
          self.selectedClusterOption = null;
          self.showCategoryCluster = false
        })
      },
      onCategoryClusterChange() {
        let self = this;

        self.$nextTick(() => {
          if (self.selectedClusterOption != null) {
            self.$store.commit("setCategoryCluster", self.selectedCategoryCluster)
          }
        })
      },
      onClusterOptionChange() {
        let self = this;

        self.$nextTick(() => {

          if (self.selectedClusterOption != null) {
            if (self.selectedClusterType != "stores") {
              self.storeCount = self.rangingController.getStoreCountByCluster(self.selectedClusterType, self
                .selectedClusterOption);
              self.$store.commit("setCurrentStoreCount", self.storeCount);

              self.products = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
                .selectedClusterOption);

              self.ais_Sales = 0;
              self.ais_SalesPotential = 0;

              self.products.forEach(el => {
                if (el.store_Range_Indicator == "YES") {
                  self.ais_Sales = (parseFloat(self.ais_Sales) + ((parseFloat(el.sales_Retail) /
                    4) / self.storeCount)).toFixed(2);
                  self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + ((parseFloat(el
                    .sales_potential) / 4)) / self.storeCount).toFixed(2);
                }
              })

              self.$store.commit("setClusterName", self.getClusterName());
              self.$store.commit("setClusterType", self.selectedClusterType);
              self.$store.commit("setClusterID", self.selectedClusterOption);
              self.$store.commit("setStoreID", null)
              self.$store.commit("setStoreName", null)

              let storeProducts = self.$store.state.activePlanogramProducts;

              if (storeProducts.length > 0) {
                storeProducts.forEach(storeProduct => {
                  self.products.forEach(product => {
                    if (storeProduct.Data.productID == product.productID) {
                      for (var prop in product) {
                        storeProduct.Data[prop] = product[prop];
                      }
                    }
                  })
                });
              }

              self.customEmitter.notify_cluster_change(EventBus);
            }

            if (self.selectedClusterType == "stores") {
              self.storeCount = 1;
              self.$store.commit("setCurrentStoreCount", self.storeCount);
              let store = []

              store.push({
                storeID: self.selectedClusterOption
              })

              self.$store.commit("setStoreID", self.selectedClusterOption)
              self.$store.commit("setStoreName", self.getStoreName())
              self.$store.commit("setClusterName", self.getClusterName());
              self.$store.commit("setClusterType", self.selectedClusterType);
              self.$store.commit("setClusterID", self.selectedClusterOption);

              let storeProducts = self.$store.state.activePlanogramProducts;

              self.products = self.rangingController.getSalesDataByStore(self.selectedClusterOption);

              if (storeProducts.length > 0) {
                storeProducts.forEach(storeProduct => {
                  self.products.forEach(product => {
                    if (storeProduct.Data.productID == product.productID) {
                      for (var prop in product) {
                        if (prop != "useAlternateBarcode" && prop != "alternateBarcode" && prop !=
                          "alternatePackingType" && prop != "cost_potential") {
                          storeProduct.Data[prop] = product[prop];
                        }
                      }
                    }
                  })
                });
              }

              self.customEmitter.notify_cluster_change(EventBus);

            }
            if (self.HybridRanges != null && self.HybridRanges != undefined) {
              if (self.HybridRanges.length == 0) {
                console.log("nohybrids");

                self.HybridRanges = []
                let vscd = self.$store.getters.getClusterData;
                self.HybridRanges.push({
                  text: self.rangingData.planogramName + " (PRIMARY)",
                  value: vscd.rangeID
                })
                self.selectedHybridRange = self.HybridRanges[0].value
              }
            }

          }
        })
      },
      getStores() {
        let self = this
        self.showCategoryCluster = true
        axios.get(process.env.VUE_APP_API + `Store?db=CR-Devinspire`).then(r => {
          r.data.forEach(store => {
            self.clusterOptions.stores.push({
              text: store.storeName,
              value: store.storeID,
            })
          })
        })
      },
      getStoreName() {
        let self = this;
        let clusters = self.clusterOptions[self.selectedClusterType];
        let retval = "";

        if (self.selectedClusterType != null && self.selectedClusterOption != null) {
          for (let index = 0; index < clusters.length; index++) {
            const element = clusters[index];
            if (element.value == self.selectedClusterOption)
              retval = element.text;
          }
        }

        return retval;
      },
      getClusterName() {
        let self = this;
        let clusters = self.clusterOptions[self.selectedClusterType];
        let retval = "";

        if (self.selectedClusterType != null && self.selectedClusterOption != null) {
          for (let index = 0; index < clusters.length; index++) {
            const element = clusters[index];
            if (element.value == self.selectedClusterOption)
              retval = element.text;
          }
        }

        return retval;
      },
      setProductIndicator(indicator, product) {
        let self = this;

        if (indicator != "SELECTED") {
          self.rangingController.setClusterIndicator(self.selectedClusterType, self.selectedClusterOption, product
            .productID,
            indicator);
          self.products = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
            .selectedClusterOption);

          self.ais_Sales = 0;
          self.ais_SalesPotential = 0;

          self.products.forEach(el => {
            if (el.store_Range_Indicator == "YES") {
              self.ais_Sales = (parseFloat(self.ais_Sales) + ((parseFloat(el.sales_Retail) /
                4) / self.storeCount)).toFixed(2);
              self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + ((parseFloat(el
                .sales_potential) / 4)) / self.storeCount).toFixed(2);
            }
          })

          self.storeCount = self.rangingController.getStoreCountByCluster(self.selectedClusterType, self
            .selectedClusterOption);
          self.$store.commit("setCurrentStoreCount", self.storeCount);
        } else {
          alert("This feature is still coming");
        }
      },
      openJoinPlanogram() {
        let self = this;

        self.$refs.JoinPlanogram.show(() => {

        })
      },
      generateName(rowdata) {
        let self = this
        let planogramName = ""
        let modules = 0
        let totalModules = 0
        // get total modules
        rowdata.forEach(element => {
          totalModules = totalModules + parseInt(element.modules)
        });

        rowdata.forEach(e => {
          modules = modules + parseInt(e.modules)
        })

        planogramName += self.rangingData.planogramName
        // get period
        if (self.rangingData.periodic != null) {
          if (self.rangingData.periodic)
            planogramName += " - " + self.rangingData.monthsBetween + "MMA";
          else
            planogramName += " - " + self.rangingData.dateFromString + " to " + self.rangingData
            .dateToString;
        }
        // // get TAg
        if (self.rangingData.tag != null && self.rangingData.tag != "")
          planogramName += self.rangingData.tag;

        // // get Cluster
        let cluster = self.getClusterName();

        if (cluster != null && cluster != undefined && cluster != "") {
          planogramName += " - " + cluster;
        }

        // // get StoreName
        // if (self.rangingData.storeName != null && self.rangingData.storeName != "") {
        //   planogramName += " - " + self.rangingData.storeName;
        // }

        if (planogramName != "")
          planogramName += " - XXX";
        // GetRowData Modules for each fixture Type
        planogramName += " - " + totalModules + " Module"

        rowdata.forEach(e => {

          if (parseInt(e.modules) != 0 && e.modules != null && e.modules != undefined) {
            planogramName += " - " + e.code + "(" + e.modules + " x " + e.height + "M)"
          }
        })
        if (self.HybridRanges != null && self.HybridRanges != undefined) {
          if (self.HybridRanges.length > 1) {
            planogramName += " - Mixed"

            let addpromo = false
            self.HybridRanges.forEach(range => {
              if (range.value == "Promotion items") {
                addpromo = true
              }
            })
            if (addpromo) {
              planogramName += " - Promotion"
            }
          }
        }


        return planogramName
      },
      getProductPotentailData(productID) {
        let self = this;
        let selectedProduct = null;

        self.products.forEach(el => {
          if (el.productID == productID)
            selectedProduct = el
        })

        return selectedProduct;
      }
    }
  }
</script>

<style scoped>
  .details {
    font-size: 12px;
  }

  .details_open {
    max-height: calc(100vh - 570px)
  }

  .details_closed {
    max-height: calc(100vh - 407px)
  }

  table {
    border-collapse: collapse;
  }

  table,
  td,
  th {
    border: 1px solid gray;
  }

  td {
    background: white;
    color: black;
  }

  th {
    text-align: left;
    background: black;
    color: white;
    padding: 2px;
    border: 1px solid gray;
  }
</style>