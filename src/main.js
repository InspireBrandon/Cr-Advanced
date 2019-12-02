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

import VueHTMLEditor from 'vue-html-editor'

import 'vue-croppa/dist/vue-croppa.css'
import VueKonva from 'vue-konva'

import Croppa from 'vue-croppa'

import {
  LicenseManager
} from "ag-grid-enterprise";
LicenseManager.setLicenseKey("Evaluation_License-_Not_For_Production_Valid_Until_27_August_2019__MTU2Njg2MDQwMDAwMA==5ba3300c9715d7ce8777c4ff77198109");

import 'ag-grid-enterprise/chartsModule';

Vue.use(VueKonva)
Vue.use(VueHTMLEditor)

Vue.use(Croppa);
Vue.use(wysiwyg, {});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')