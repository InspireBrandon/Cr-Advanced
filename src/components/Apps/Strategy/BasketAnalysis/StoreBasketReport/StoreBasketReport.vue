<template>
    <v-dialog v-model="dialog" persistent width="800px">
        <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Store Basket Report - {{ basketName }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card>
            <Grid ref="grid" :rowData="rowData" />
        </v-card>
    </v-dialog>
</template>

<script>
    import Grid from './Grid.vue'

export default {
    components: {
        Grid
    },
    data() {
        return {
            dialog: false,
            basketName: "",
            rowData: []
        }
    },
    methods: {
        show(basketName) {
            let self = this;
            self.basketName = basketName;
            self.dialog = true;
            self.$refs.grid.resize();
        }
    }
}
</script>