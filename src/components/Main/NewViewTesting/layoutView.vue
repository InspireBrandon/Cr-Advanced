<template>
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
</template>

<script>
export default {
  data() {
    return {
      admins: [["Planograms"], ["Settings"], ["Settings"], ["Settings"]]
    };
  },
  methods: {
    goTo(key) {
      this.$router.push({ name: key });
    }
  },
  computed: {}
};
</script>