<template>
  <div>
    <v-card>
      <v-toolbar dark>
        <v-btn color="success">Start Implementing</v-btn>
        <v-spacer></v-spacer>
        <v-btn icon class="mr-2">
          Print
          <v-icon>print</v-icon>
        </v-btn>
      </v-toolbar>
      <v-navigation-drawer permanent value="true">
        <v-toolbar flat>
          <v-list>
            <v-list-tile>
              <v-list-tile-title class="title">CR Solutions</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list>
          <v-list-group prepend-icon="account_circle" value="true">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Planograms</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Ready to Implement ({{count}})</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>In-Progress ({{count}})</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Implemented ({{count}})</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>

          <v-list-group prepend-icon="account_circle" value="false">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Category Analysis</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
          <v-list-group prepend-icon="account_circle" value="false">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Floor Plans</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
          <v-list-group prepend-icon="account_circle" value="false">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Range Analysis</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
          <v-list-group prepend-icon="account_circle" value="false">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Price Analysis</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
          <v-list-group prepend-icon="account_circle" value="false">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Promotion Analysis</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
          <v-list-group prepend-icon="account_circle" value="false">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Clustering</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
          <v-list-group prepend-icon="account_circle" value="false">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Market Share/ Geo Mapping</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
          <v-list-group prepend-icon="account_circle" value="false">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Top Line Analysis</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
          <v-list-group prepend-icon="account_circle" value="false">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Import Data</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
          <v-list-group prepend-icon="account_circle" value="false">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Add new Items</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-group no-action sub-group value="false">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
                <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="admin[1]"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>
      <v-container>
        <v-flex xs12>
          <v-card dark color="light-blue darken-4">
            <v-card-title>
              <v-flex xs4>
                <p class="title">Name</p>
                <p class="body-2 margin-sub-text"></p>
              </v-flex>
              <v-flex xs4>
                <p class="title">URL</p>
                <p class="body-2 margin-sub-text"></p>
              </v-flex>
              <v-flex xs4>...</v-flex>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      admins: [["Planograms"], ["Settings"], ["Settings"], ["Settings"]],
      menuList: [["Planograms"], ["Settings"], ["Settings"], ["Settings"]],
      count: 0
    };
  },
  mounted() {
    let self = this;

    self.count = self.admins.length;
    console.log(self.count);
  },
  created() {
    var listMenu = this.admins;

    this.$route.path.then(listMenu => {
      // you need to return listMenu from getDetailMenu
      listMenu.forEach((item, index) => createAndAppendRoute(item, index));
    });
  },
  methods: {
    createAndAppendRoute: (item, index) => {
      console.log(item, index);
      // Base on your data, you should be able to create router name and path from item and index
      // here is just an example
      let newRoute = {
        path: `/${item}`,
        name: `${item}_${index}`,
        components: TestingView
      };

      this.$router.addRoutes([newRoute]);
    }
  },
  watch: {
    $route() {
      this.$route.path;
    }
  }
};
