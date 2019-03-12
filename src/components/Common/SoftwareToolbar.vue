<template>
  <div>
    <v-toolbar dense dark>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-menu dark offset-y style="margin-bottom: 10px;">
          <v-btn slot="activator" flat>
            File
          </v-btn>
          <v-list>
            <v-list-tile v-if="onNewFile != undefined && onNewFile != null" @click="newFile">
              <v-list-tile-title>{{ newFileText }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="afterOpenDatabase != undefined && afterOpenDatabase != null" @click="openDatabase">
              <v-list-tile-title>{{ openDatabaseText }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="afterOpenFile != undefined && afterOpenFile != null" @click="openFile">
              <v-list-tile-title>Open File</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- <v-menu dark offset-y style="margin-bottom: 10px;">
          <v-btn slot="activator" flat>
            Help
          </v-btn>
          <v-list>
            <v-list-tile @click="newFile">
              <v-list-tile-title>FAQ</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="openDatabase">
              <v-list-tile-title>Feedback</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu> -->
        <v-menu dark offset-y style="margin-bottom: 10px;" v-if="menus != undefined" v-for="(menu, idx1) in menus" :key="idx1">
          <v-btn slot="activator" flat>{{ menu.title }}</v-btn>
          <v-list v-for="(menuItem, idx2) in menu.items" :key="idx2">
            <v-list-tile @click="menuItem.click">
              <v-list-tile-title>{{ menuItem.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Select File</v-card-title>

        <v-card-text>
          <v-list>
            <v-list-tile @click="returnDataFromDialog('Range - All Stores.csv')">
              <v-list-tile-content>
                <v-list-tile-title>Range - All Stores.csv</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" flat @click="dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ProgressDialog ref="progressDialog"></ProgressDialog>
    <input @change="onFileChange" ref="fileInput" type="file" style="display: none;">
  </div>
</template>

<script>
  import Axios from 'axios';
  import ProgressDialog from '@/components/Common/ProgressDialog'

  export default {
    data() {
      return {
        dialog: false
      }
    },
    components: {
      ProgressDialog
    },
    name: 'Software_Toolbar',
    props: ['title', 'afterOpenDatabase', 'afterOpenFile', 'menus', 'onNewFile', 'newFileText', 'openDatabaseText'],
    methods: {
      doNothing() {

      },
      newFile() {
        let self = this;
        self.onNewFile();
      },
      openFile() {
        let self = this;
        self.$refs.fileInput.click();
      },
      onFileChange(e) {
        let self = this;

        let file = e.target.files[0];

        var reader = new FileReader();
        reader.onload = function (e) {
          var retval = [];
          var rows = e.target.result.split("\n");

          var headers = rows[0].split(",");
          var fixedHeaders = [];

          headers.forEach(element => {
            fixedHeaders.push(element.replace(/ /g, '_').replace(/"/g, ""))
          });

          for (var i = 1; i < rows.length; i++) {
            var data = rows[i].split(',');
            if (data.length == fixedHeaders.length) {

              var tarr = {};
              for (var j = 0; j < fixedHeaders.length; j++) {
                tarr[fixedHeaders[j]] = data[j].replace(/"/g, "");
              }
              retval.push(tarr);
            }
          }

          self.afterOpenFile(fixedHeaders, retval)
        }
        reader.readAsText(file);
      },
      openDatabase() {
        //self.dialog = true;
        let self = this;
        self.afterOpenDatabase();
      },
      returnDataFromDialog(item) {
        let self = this;

        const config = {
          onDownloadProgress: function (e) {
            if (e.loaded == e.total)
              self.$refs.progressDialog.hide();
            else
              self.$refs.progressDialog.setCurrentValue((e.total / e.loaded) * 100);
          }
        }

        self.dialog = false;
        self.$refs.progressDialog.setText("Fetching: " + item);
        self.$refs.progressDialog.setCurrentValue(0);
        self.$refs.progressDialog.show();

        Axios.get('./static/downloads/templates/' + item, config)
          .then(r => {
            self.processData(r.data)
            self.dialog = false;
          })
      },
      processData(allText) {
        let self = this;
        var allTextLines = allText.split(/\r\n|\n/);
        var headersBroken = allTextLines[0].split(',');
        var headers = [];

        headersBroken.forEach(element => {
          headers.push(element.replace(/ /g, '_'))
        });

        var lines = [];

        for (var i = 1; i < allTextLines.length; i++) {
          var data = allTextLines[i].split(',');
          if (data.length == headers.length) {

            var tarr = {};
            for (var j = 0; j < headers.length; j++) {
              tarr[headers[j]] = data[j];
            }
            lines.push(tarr);
          }
        }
        self.afterOpenDatabase(headers, lines);
      }
    }
  }

</script>
