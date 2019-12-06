<template>
    <div>
        <v-toolbar dark dense flat>
            <v-toolbar-title>
                Dashboard Designer
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark dense flat color="grey darken-3">
        </v-toolbar>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex md3 v-for="(item,idx) in components" :key="idx">
                    <component v-bind:is="item.Name" :props="item"></component>

                </v-flex>
            </v-layout>
        </v-container>

    </div>

</template>
<script>
    import EditComponents from "./EditComponents.vue"
    export default {
        components: {
            EditComponents
        },
        data() {
            return {
                components: [],
                componentConfig: {
                    type: 1,
                    Name: "EditComponents"
                }
            }
        },
        mounted() {
            this.generateGrid()
        },
        methods: {
            generateGrid() {
                let self = this
                for (let index = 0; index < 12; index++) {
                    self.components.push(self.componentConfig)
                }
            }
        }
    }
</script>