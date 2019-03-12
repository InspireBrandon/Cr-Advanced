<template>
  <div>
    <v-toolbar dark dense>
      <v-toolbar-title>Help files</v-toolbar-title>
    </v-toolbar>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex md3 v-for="(el, idx) in components" :key="idx">
          <v-card @click="showWYSIWYG(el.component)" color="grey darken-2">
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ el.displayName }}</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <HelpFileMaint ref="helpFileMaint"></HelpFileMaint>
  </div>
</template>

<script>
  import HelpFileMaint from '@/components/Main/HelpFile/HelpFileMaint'

  export default {
    components: {
      HelpFileMaint
    },
    data() {
        return {
            components: [
                {
                    component: "Ranging",
                    displayName: "Ranging",
                },
                {
                    component: "Space Planning",
                    displayName: "Space Planning",
                }
            ]
        }
    },
    methods: {
        showWYSIWYG(component) {
            this.$refs.helpFileMaint.show(component);
        }
    }
  }

</script>
