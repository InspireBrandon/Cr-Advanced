import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: { // all data
    gondolas: [],
    planogramProperties: {
      LabelConfig: {
        Order: "T2B",
        Position: 'left'
      },
      PriceLabels: {
        Enabled: false
      }
    },
    fixutreCount: {
      shelfCount: 0,
      pegboardCount: 0,
      pegbarCount: 0,
    },
    gondolaFixutreCount: 0,
    gondolaCount: 0,
    allPlanogramItems: [],
    fixtures: [],
    subFixtures: [],
    productGroups: [],
    allProducts: [], // WAREHOUSE USAGE
    fullScreen: false,
    activePlanogramProducts: [], // PLANOGRAM USAGE,
    CtrlDown: false,
    CloneItem: null,
    planogramName: null,
    clusterName: null,
    clusterType: null,
    clusterID: null,
    storeID:null,
    storeName:null,
    rangeID: null,
    categoryCluster:null,
    daysBetween: 0
  },
  mutations: {
    setCtrlDown(state, data) {
      state.CtrlDown = data;
    },
    setCloneItem(state, data) {
      state.CloneItem = data;
    },
    addPlanogramItem(state, data) {
      state.allPlanogramItems.push(data);
    },
    addActivePlanogramProduct(state, data) {
      // var test = state.activePlanogramProducts.filter(el => {
      //   return el.Barcode == data.Barcode
      // })

      // if (test.length == 0) {
      state.activePlanogramProducts.push(data);
      // }
    },
    setFullScreen(state, value) {
      state.fullScreen = value;
    },
    setLabelConfigOrder(state, order) {
      state.planogramProperties.LabelConfig.Order = order;
    },
    setPlanogramProperties(state, data) {
      state.planogramProperties = data;
    },
    removeActivePlanogramProduct(state, data) {
      var index = state.activePlanogramProducts.indexOf(data);
      if (index > -1) {
        state.activePlanogramProducts.splice(index, 1);
      }
    },
    removePlanogramItem(state, data) {
      var index = state.allPlanogramItems.indexOf(data);
      if (index > -1) {
        state.allPlanogramItems.splice(index, 1);
      }
    },
    resetStore(state) {
      console.log("[STORE] RESET");
      state.activePlanogramProducts = []; // PLANOGRAM USAGE,
      state.allPlanogramItems = []; // PLANOGRAM USAGE,
      state.CtrlDown = false;
      state.CloneItem = null;
      state.gondolas = [];
      // state.fixtures = [];
      state.productGroups = [];
      state.allProducts = [];
      state.subFixtures = [];
    },
    setPlanogramName(state, name) {
      state.planogramName = name;
    },
    setClusterName(state, name) {
      state.clusterName = name;
    },
    setClusterType(state, clusterType) {
      state.clusterType = clusterType;
    },
    setClusterID(state, clusterID) {
      state.clusterID = clusterID;
    },
    setRangeID(state, rangeID) {
      state.rangeID = rangeID;
    },
    setStoreID(state, storeID) {
      state.storeID = storeID;
    },
    setStoreName(state, storeName) {
      state.storeName = storeName;
    },
    setCategoryCluster(state, categoryCluster) {
      state.categoryCluster = categoryCluster;
    },
    setDaysBetween(state, days) {
      state.daysBetween = days;
    },
    setProductData(state, data) {
      state.activePlanogramProducts.forEach(el => {
        if (el.Data.barcode == data.data.barcode) {
          el.Data.height = data.data.height;
          el.Data.width = data.data.width;
          el.Data.depth = data.data.depth;

          el.Data.tray_Barcode = data.data.tray_Barcode;
          el.Data.tray_Qty = data.data.tray_Qty;
          el.Data.tray_Height = data.data.tray_Height;
          el.Data.tray_Width = data.data.tray_Width;
          el.Data.tray_Depth = data.data.tray_Depth;

          el.Data.case_Barcode = data.data.case_Barcode;
          el.Data.case_Qty = data.data.case_Qty;
          el.Data.case_Height = data.data.case_Height;
          el.Data.case_Width = data.data.case_Width;
          el.Data.case_Depth = data.data.case_Depth;

          el.Data.shrink_Barcode = data.data.shrink_Barcode;
          el.Data.shrink_Qty = data.data.shrink_Qty;
          el.Data.shrink_Height = data.data.shrink_Height;
          el.Data.shrink_Width = data.data.shrink_Width;
          el.Data.shrink_Depth = data.data.shrink_Depth;

          el.Data.pallet_Barcode = data.data.pallet_Barcode;
          el.Data.pallet_Qty = data.data.pallet_Qty;
          el.Data.pallet_Height = data.data.pallet_Height;
          el.Data.pallet_Width = data.data.pallet_Width;
          el.Data.pallet_Depth = data.data.pallet_Depth;
        }
      })

      state.activePlanogramProducts.forEach(el => {
        if (el.Type == "PRODUCT") {
          if (el.Data.barcode == data.barcode) {
            el.Data.height = data.data.height;
            el.Data.width = data.data.width;
            el.Data.depth = data.data.depth;

            el.Data.tray_Barcode = data.data.tray_Barcode;
            el.Data.tray_Qty = data.data.tray_Qty;
            el.Data.tray_Height = data.data.tray_Height;
            el.Data.tray_Width = data.data.tray_Width;
            el.Data.tray_Depth = data.data.tray_Depth;

            el.Data.case_Barcode = data.data.case_Barcode;
            el.Data.case_Qty = data.data.case_Qty;
            el.Data.case_Height = data.data.case_Height;
            el.Data.case_Width = data.data.case_Width;
            el.Data.case_Depth = data.data.case_Depth;

            el.Data.shrink_Barcode = data.data.shrink_Barcode;
            el.Data.shrink_Qty = data.data.shrink_Qty;
            el.Data.shrink_Height = data.data.shrink_Height;
            el.Data.shrink_Width = data.data.shrink_Width;
            el.Data.shrink_Depth = data.data.shrink_Depth;

            el.Data.pallet_Barcode = data.data.pallet_Barcode;
            el.Data.pallet_Qty = data.data.pallet_Qty;
            el.Data.pallet_Height = data.data.pallet_Height;
            el.Data.pallet_Width = data.data.pallet_Width;
            el.Data.pallet_Depth = data.data.pallet_Depth;
          }
        }
      })
    },
    setFixtures(state, data) {
      state.fixtures = data;
    }
  },
  getters: {
    getCtrlDown: (state) => {
      return state.CtrlDown;
    },
    getCloneItem: (state) => {
      return state.CloneItem;
    },
    getAllPlanogramItems: (state) => {
      return state.allPlanogramItems;
    },
    getAllPlanogramActiveProducts: (state) => {
      return state.activePlanogramProducts;
    },
    getPlanogramActiveProductById: (state) => (productID) => {
      var found = state.activePlanogramProducts.find(function (el) {
        return el.Data.productID == productID;
      })

      if (found == null || found == undefined) {
        console.warn("[STORE] Failed to get getPlanogramActiveProductById By ID", productID)
        return null;
      }

      return found;
    },
    getLabelConfig: (state) => {
      return state.planogramProperties.LabelConfig;
    },
    getPlanogramProperties: (state) => {
      return state.planogramProperties;
    },
    getPlanogramItemById: (state) => (id) => {
      var found = state.allPlanogramItems.find(function (el) {
        return el.ID == id;
      })

      if (found == null || found == undefined) {
        console.warn("[STORE] Failed to get PlanogramItem By ID", id)
      }

      return found;
    },
    getClusterData: (state) => {
      return {
        rangeID: state.rangeID,
        planogramName: state.planogramName,
        clusterName: state.clusterName,
        clusterType: state.clusterType,
        clusterID: state.clusterID,
        storeID : state.storeID,
        storeName:state.storeName,
        categoryCluster:state.categoryCluster
      }
    },
    getFixtures: (state) => {
      return state.fixtures;
    }
  }
});
