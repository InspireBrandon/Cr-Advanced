<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent width="80vw">
        <v-card >
          <v-card-title style="text-align: center; display: block;" class="headline">Date Range Selector</v-card-title>
          <v-card-text style="text-align: center;">
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex md6 xs12>
                  <v-autocomplete  :items="periodsFrom" v-model="dateFrom" label="Date From:"></v-autocomplete>
                </v-flex>
                <v-flex md6 xs12>
                  <v-autocomplete  :items="periodsTo" v-model="dateTo" label="Date To:"></v-autocomplete>
                </v-flex>
                <v-flex md6 xs12>
                  <v-checkbox label="Keep up to date" v-model="periodic" color="primary"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions style="text-align: right; display: block;">
            <v-spacer></v-spacer>
            <v-btn color="error" @click.native="dialog = false">Cancel</v-btn>
            <v-btn color="primary" @click.native="returnDateRange">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  import Axios from 'axios';
  import DateHelper from '@/libs/helpers/date-helper.js'

  let dateHelper = new DateHelper(process.env.VUE_APP_API);

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  export default {
    data() {
      return {
        periodic: false,
        dateFrom: null,
        dateTo: null,
        periodsFrom: [],
        periodsTo: [],
        dialog: false,
        afterRuturn: null,
        filterText: ""
      }
    },
    methods: {
      dateChecks(dateFrom, dateTo) {
        return dateHelper.getMonthsBetween(dateFrom, dateTo);
      },
      getDates(callback) {
        let self = this;

        Axios.get(process.env.VUE_APP_API + "Periods")
          .then(r => {
            let periods = r.data;

            for (let i = 0; i < periods.length; i++) {
              let period = periods[i];

              self.periodsFrom.push({
                text: formatDate(period.period_From_Date),
                value: period.id
              })

              self.periodsTo.push({
                text: formatDate(period.period_To_Date),
                value: period.id
              })
            }

            callback();
          })
      },
      show(afterRuturn) {
        let self = this;

        self.periodsFrom = [];
        self.periodsTo = [];
        self.periodic = false;

        this.getDates(() => {
          self.dateFrom = null;
          self.dateTo = null;
          self.afterRuturn = afterRuturn;
          self.dialog = true;
        });
      },
      returnDateRange() {
        let self = this;

        let displayData = self.getDateDisplay();

        let datesBetween = self.dateChecks(displayData.dateFrom, displayData.dateTo);

        self.afterRuturn({
          dateFrom: self.dateFrom,
          dateFromString: displayData.dateFrom,
          dateTo: self.dateTo,
          dateToString: displayData.dateTo,
          periodic: self.periodic,
          monthsBetween: datesBetween
        })
        self.dialog = false;
      },
      getDateDisplay() {
        let self = this;

        let retval = {
          dateFrom: "",
          dateTo: "",
        }

        self.periodsFrom.forEach(el => {
          if (el.value == self.dateFrom) {
            retval.dateFrom = el.text
          }
        })

        self.periodsTo.forEach(el => {
          if (el.value == self.dateTo) {
            retval.dateTo = el.text
          }
        })

        return retval;
      }
    }
  }

</script>
