import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";
import {
  store
} from './store'
import "../node_modules/vue-wysiwyg/dist/vueWysiwyg.css";

import wysiwyg from "vue-wysiwyg";
import 'vue-croppa/dist/vue-croppa.css'
import VueKonva from 'vue-konva'

import Croppa from 'vue-croppa'

import {
  LicenseManager
} from "ag-grid-enterprise";
LicenseManager.setLicenseKey("Evaluation_License-_Not_For_Production_Valid_Until_25_May_2019__MTU1ODczODgwMDAwMA==156057ec2a5212d3fc17b2c425718067");

Vue.use(VueKonva)

Vue.use(Croppa);
Vue.use(wysiwyg, {});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')