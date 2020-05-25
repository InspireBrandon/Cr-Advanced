<template>
  <div>
    <v-dialog persistent v-model="dialog" width="800">
      <v-card>
        <v-toolbar dark flat color="primary">
          <v-toolbar-title>Auto Range Configuration - Role: {{ planogramRole }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-0" style="height: 600px; overflow-y: scroll;">
          <h3>Auto Range</h3>
          <h4 class="font-weight-light">Highlights</h4>
          <table>
            <tbody>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_sales_index" type="checkbox" style="width: 100%;" />
                </td>
                <td>Sales Index</td>
                <td style="text-align: center;">></td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.sales_index" style="width: 100%; text-align: right;" type="number" />
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_profit_index" type="checkbox" style="width: 100%;" />
                </td>
                <td>Profit Index</td>
                <td style="text-align: center;">></td>
                <td style="padding: 02px!important;">
                  <input v-model="data.profit_index" style="width: 100%; text-align: right;" type="number" />
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_volume_index" type="checkbox" style="width: 100%;" />
                </td>
                <td>Volume Index</td>
                <td style="text-align: center;">></td>
                <td style="padding: 02px!important;">
                  <input v-model="data.volume_index" style="width: 100%; text-align: right;" type="number" />
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_sales" type="checkbox" style="width: 100%;" />
                </td>
                <td>Sales</td>
                <td style="text-align: center;">Top</td>
                <td style="padding: 02px!important;">
                  <div style="display: flex;">
                    <input v-model="data.sales" style="width: 80%; text-align: right;" type="number" />
                    <div style="margin-left: 5px;">%</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_volume" type="checkbox" style="width: 100%;" />
                </td>
                <td>Volume</td>
                <td style="text-align: center;">Top</td>
                <td style="padding: 02px!important;">
                  <div style="display: flex;">
                    <input v-model="data.volume" style="width: 80%; text-align: right;" type="number" />
                    <div style="margin-left: 5px;">%</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_profit" type="checkbox" style="width: 100%;" />
                </td>
                <td>Profit</td>
                <td style="text-align: center;">Top</td>
                <td style="padding: 02px!important;">
                  <div style="display: flex;">
                    <input v-model="data.profit" style="width: 80%; text-align: right;" type="number" />
                    <div style="margin-left: 5px;">%</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_potential_sales" type="checkbox" style="width: 100%;" />
                </td>
                <td>Potential Sales</td>
                <td style="text-align: center;">Top</td>
                <td style="padding: 02px!important;">
                  <div style="display: flex;">
                    <input v-model="data.potential_sales" style="width: 80%; text-align: right;" type="number" />
                    <div style="margin-left: 5px;">%</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_potential_volume" type="checkbox" style="width: 100%;" />
                </td>
                <td>Potential Volume</td>
                <td style="text-align: center;">Top</td>
                <td style="padding: 02px!important;">
                  <div style="display: flex;">
                    <input v-model="data.potential_volume" style="width: 80%; text-align: right;" type="number" />
                    <div style="margin-left: 5px;">%</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_potential_profit" type="checkbox" style="width: 100%;" />
                </td>
                <td>Potential Profit</td>
                <td style="text-align: center;">Top</td>
                <td style="padding: 02px!important;">
                  <div style="display: flex;">
                    <input v-model="data.potential_profit" style="width: 80%; text-align: right;" type="number" />
                    <div style="margin-left: 5px;">%</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_inclusive_units" type="checkbox" style="width: 100%;" />
                </td>
                <td>Inclusive Units</td>
                <td style="text-align: center;">></td>
                <td style="padding: 02px!important;">
                  <input v-model="data.inclusive_units" style="width: 100%; text-align: right;" type="number" />
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <input v-model="data.use_minimum_units" type="checkbox" style="width: 100%;" />
                </td>
                <td>Minimum Units</td>
                <td style="text-align: center;">&lt;</td>
                <td style="padding: 02px!important;">
                  <input v-model="data.minimum_units" style="width: 100%; text-align: right;" type="number" />
                </td>
              </tr>
              <tr>
                <td style="padding: 02px!important;">
                  <!-- <input v-model="use_audit" type="checkbox" style="width: 100%;"> -->
                </td>
                <td>Audit</td>
                <td style="text-align: center;">On/Off</td>
                <td style="padding: 02px!important;">
                  <input v-model="data.audit" type="checkbox" style="width: 100%;" />
                </td>
              </tr>
            </tbody>
          </table>
          <h4 class="font-weight-light">Values</h4>
          <table>
            <tbody>
              <tr>
                <td style="padding: 02px!important;"></td>
                <td>DOS Units</td>
                <td style="text-align: center; width: 200px;">Value</td>
                <td style="padding: 02px!important; width: 100px;">
                  <input v-model="data.dos_units" style="width: 100%; text-align: right;" type="number" />
                </td>
              </tr>
            </tbody>
          </table>
          <v-divider class="my-2"></v-divider>
          <h3>Product Supply</h3>
          <h4 class="font-weight-light">Highlights</h4>
          <table>
            <tbody>
              <tr>
                <td>Safety Stock</td>
                <td style="text-align: center; width: 60px;">&lt;</td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.safety_stock_highlight" style="width: 100%; text-align: right;" type="number" />
                </td>
                <td style="width: 60px;">
                  Weeks
                </td>
              </tr>
              <tr>
                <td>Casepack Qty</td>
                <td style="text-align: center; width: 60px;">></td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.casepack_qty" style="width: 100%; text-align: right;" type="number" />
                </td>
                <td style="width: 60px;">
                  Weeks
                </td>
              </tr>
              <tr>
                <td>Surplus Stock</td>
                <td style="text-align: center;">></td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.surplus_stock" style="width: 100%; text-align: right;" type="number" />
                </td>
                <td>
                  Weeks
                </td>
              </tr>
            </tbody>
          </table>
          <h4 class="font-weight-light mt-2">Values</h4>
          <table>
            <tbody>
              <tr>
                <td>Minumum Stock</td>
                <td style="text-align: center; width: 60px;">=</td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.minumum_stock" style="width: 100%; text-align: right;" type="number" />
                </td>
                <td style="width: 60px;">
                  Weeks
                </td>
              </tr>
              <tr>
                <td>Maximum Stock</td>
                <td style="text-align: center;">=</td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.maximum_stock" style="width: 100%; text-align: right;" type="number" />
                </td>
                <td>
                  Weeks
                </td>
              </tr>
            </tbody>
          </table>
          <table class="mt-1">
            <tbody>
              <tr>
                <td>Default Minimum Units</td>
                <td style="text-align: center;">=</td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.default_minimum" style="width: 100%; text-align: right;" type="number" />
                </td>
                <td>Then Max Units</td>
                <td style="text-align: center;">=</td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.default_minimum_max" style="width: 100%; text-align: right;" type="number" />
                </td>
              </tr>
            </tbody>
          </table>
          <table class="mt-1">
            <tbody>
              <tr>
                <td>Default Price Minimum</td>
                <td style="text-align: center;">&lt;</td>
                <td style="padding: 0px!important; width: 50px">
                  <input v-model="data.default_price_minimum" style="width: 100%; text-align: right;" type="number" />
                </td>
                <td>
                  Rand
                </td>
                <td>Then Min Units</td>
                <td style="text-align: center;">=</td>
                <td style="padding: 0px!important; width: 50px">
                  <input v-model="data.default_price_minimum_min" style="width: 100%; text-align: right;"
                    type="number" />
                </td>
                <td>Then Max Units</td>
                <td style="text-align: center;">=</td>
                <td style="padding: 0px!important; width: 50px">
                  <input v-model="data.default_price_minimum_max" style="width: 100%; text-align: right;"
                    type="number" />
                </td>
              </tr>
            </tbody>
          </table>
          <table class="mt-1">
            <tbody>
              <tr>
                <td>Supplier Lead Time</td>
                <td style="text-align: center; width: 60px;">=</td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.lead_time" style="width: 100%; text-align: right;" type="number" />
                </td>
                <td style="width: 60px;">
                  Days
                </td>
              </tr>
              <tr>
                <td>Safety Stock</td>
                <td style="text-align: center; width: 60px;">=</td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.safety_stock_value" style="width: 100%; text-align: right;" type="number" />
                </td>
                <td style="width: 60px;">
                  Weeks
                </td>
              </tr>
              <tr>
                <td>Use Seasonal Index</td>
                <td style="text-align: center;">On/Off</td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.use_seasonal_index" type="checkbox" style="width: 100%;" />
                </td>
                <td>
                </td>
              </tr>
              <tr>
                <td>Excess Distribution Weeks</td>
                <td style="text-align: center;">></td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.excess_distribution_weeks" style="width: 100%; text-align: right;"
                    type="number" />
                </td>
                <td>
                  Weeks
                </td>
              </tr>
              <tr>
                <td>Excess Receivable Stock</td>
                <td style="text-align: center;">&lt;</td>
                <td style="padding: 0px!important; width: 100px">
                  <input v-model="data.excess_recievable_stock" style="width: 100%; text-align: right;" type="number" />
                </td>
                <td>
                  Weeks
                </td>
              </tr>
            </tbody>
          </table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" flat @click="defaults">Default</v-btn>
          <v-btn color="primary" flat @click="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Axios from 'axios';
  export default {
    data() {
      return {
        dialog: false,
        planogramID: null,
        planogramRole: "",
        planogramRoleID: null,
        afterComplete: null,
        data: {
          use_sales_index: true,
          use_profit_index: true,
          use_volume_index: true,
          use_sales: true,
          use_volume: true,
          use_profit: true,
          use_potential_sales: true,
          use_potential_volume: true,
          use_potential_profit: true,
          use_inclusive_units: true,
          use_minimum_units: true,
          minimum_units: 1,
          use_audit: true,
          sales_index: 100,
          profit_index: 100,
          volume_index: 100,
          sales: 60,
          volume: 60,
          profit: 60,
          potential_sales: 60,
          potential_volume: 60,
          potential_profit: 60,
          inclusive_units: 6,
          audit: false,
          dos_units: 6,
          // Product Supply
          safety_stock_highlight: 1,
          casepack_qty: 12,
          surplus_stock: 12,
          minumum_stock: 4,
          maximum_stock: 6,
          default_minimum: 2,
          default_minimum_max: 0,
          default_price_minimum: 100,
          default_price_minimum_min: 3,
          default_price_minimum_max: 5,
          lead_time: 21,
          safety_stock_value: 1,
          use_seasonal_index: false,
          excess_distribution_weeks: 12,
          excess_recievable_stock: 8
        }
      };
    },
    methods: {
      defaults() {
        let self = this;

        self.getRoleDefaults();
      },
      show(config, planogramID, afterComplete) {
        let self = this;
        self.planogramID = planogramID;
        self.afterComplete = afterComplete;

        self.getPlanogramRole();

        for (var prop in self.data) {
          self.data[prop] = config[prop];
        }

        self.dialog = true;
      },
      submit() {
        let self = this;
        self.dialog = false;

        let arc = self.data;

        self.afterComplete(arc);
      },
      getPlanogramRole() {
        let self = this;

        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        Axios.get(process.env.VUE_APP_API + 'PlanogramRole/Planogram?planogramID=' + self.planogramID)
          .then(r => {
            self.planogramRoleID = r.data.id;
            self.planogramRole = r.data.displayname;
          })
          .catch(e => {

          })
      },
      getRoleDefaults() {
        let self = this;

        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        Axios.get(
            process.env.VUE_APP_API +
            "AutoRangeConfig?roleID=" +
            self.planogramRoleID
          )
          .then(r => {
            let data = r.data;

            console.log(r.data);

            for (var prop in data) {
              data[prop.toLowerCase()] = data[prop];

              if (prop.includes("_")) {
                delete data[prop];
              }
            }

            for (var prop in self.data) {
              self.data[prop] = data[prop];
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  };
</script>

<style scoped>
  table {
    border-collapse: collapse;
    width: 100%;
  }

  table,
  td,
  th {
    border: 1px solid gray;
  }

  td {
    background: white;
    color: black;
    padding: 2px 5px;
  }

  th {
    text-align: left;
    background: black;
    color: white;
    padding: 2px;
    border: 1px solid gray;
  }
</style>