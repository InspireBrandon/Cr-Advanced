<template>
  <v-card>
    <v-toolbar dark>
      <v-btn color="success">Start Implementing</v-btn>
      <v-spacer></v-spacer>
      <v-btn icon class="mr-2">
        Print
        <v-icon>print</v-icon>
      </v-btn>
    </v-toolbar>
    <v-flex xs12>
      <v-card dark color="light-blue darken-4">
        <v-card-title>
          <v-flex xs4>
            <p class="title">Name</p>
            <p class="body-2 margin-sub-text">{{detailMenu.name}}</p>
          </v-flex>
          <v-flex xs4>
            <p class="title">URL</p>
            <p class="body-2 margin-sub-text">{{detailMenu.url}}</p>
          </v-flex>
          <v-flex xs4>...</v-flex>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
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
    var listMenu = this.menuList;

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
        components: {
          default: layout,
          header: TestingView
        }
      };

      this.$router.addRoutes([newRoute]);
    },
    watch: {
      $route() {
        this.$route.path;
      }
    }
  }
};
