<template>
  <div>
    <v-card class="elevation-1" style="background: url('../../../static/img/banner.png'); background-size: cover; background-position: center;">
      <v-card-text style="height: 150px; position: relative; padding-top: 0px">
        <v-container class="container-height " grid-list-md absolute dark fab top>
          <v-tabs class="elevation-4" centered dark fixed-tabs justify-content: center>
            <v-tabs-slider color="white"></v-tabs-slider>

            <v-tab v-for="(tab, index) in tabs" :href="'#tab-' + index" :key="index" justify-content: center fixed-tabs>
              {{ tab }}
            </v-tab>

            <v-tab-item v-for="(tab, index) in tabs" :key="index" :id="'tab-' + index" class="elevation-2"
              justify-content: center>
              <v-card justify-content: center class="tab-item-wrapper elevation-2 back-height">
                <v-card-text>
                  <v-flex xs12>
                    <v-layout row justify-end>
                      <v-btn style="margin-bottom: 10px;" @click="newPlanogram" color="primary">
                        add
                      </v-btn>
                    </v-layout>
                    <v-data-table hide-headers :headers="headers" :items="ImportedFiles" class="elevation-1">
                      <template slot="items" slot-scope="props">
                        <td id="tdName">{{ props.item.name }}</td>
                        <td id="tdActions" class="text-xs-right">
                          <v-menu bottom offset-y transition="scale-transition">
                            <v-btn small slot="activator" color="primary" dark>
                              options
                            </v-btn>
                            <v-list>
                              <v-list-tile @click="$router.push('/SpacePlanning/View/' + props.item.id)">
                                <v-list-tile-title>view</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click="$router.push('/SpacePlanning/Modify/' + props.item.id)">
                                <v-list-tile-title>modify</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </td>
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-container>
      </v-card-text>
    </v-card>
    <RangeSelectorModal ref="rangeSelector"></RangeSelectorModal>
  </div>
</template>

<script>
  import axios from 'axios';
  import RangeSelectorModal from '@/components/Common/RangeSelectorModal'

  export default {
    data() {
      return {
        // tabs: ['Imported', 'Implemented', 'Approved'],
        tabs: ['Imported'],
        ImportedFiles: [],
        ImplementedFiles: [],
        ApprovedFiles: [],
        headers: [{
          text: "Name",
          value: "name"
        }, {
          text: '',
          value: 'id'
        }]
      }
    },
    components: {
      RangeSelectorModal
    },
    created() {
      let self = this;

      axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-Devinspire&folder=Space Planning')
        .then(r => {
          self.ImportedFiles = r.data;
        })
    },
    methods: {
      newPlanogram() {
        let self = this;
        self.$refs.rangeSelector.show(rangingID => {
          self.$router.push('/SpacePlanning/New/' + rangingID)
        })
      }
    }
  }

</script>
