<template>
    <v-dialog v-model="dialog" fullscreen>
        <v-card>
            <v-toolbar flat dark color="primary">
                <v-toolbar-title>Maintain Store</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="component-container">
                <v-card>
                    <v-card-text>
                        <Name />
                        <Properties />
                        <Contact />
                        <Location />
                        <Dimensions />
                        <Store_Manager />
                    </v-card-text>
                </v-card>
            </v-card-text>
            <v-card-actions class="pa-0">
                <v-toolbar flat color="secondary">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="next">Save</v-btn>
                </v-toolbar>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Name from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Name.vue'
    import Properties from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Properties.vue'
    import Contact from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Contact.vue'
    import Location from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Location.vue'
    import Dimensions from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Dimensions.vue'
    import Store_Manager from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Store_Manager.vue'

    export default {
        components: {
            Name,
            Properties,
            Contact,
            Location,
            Dimensions,
            Store_Manager
        },
        data: () => {
            return {
                dialog: false,
                tabs: 0
            }
        },
        methods: {
            open() {
                this.dialog = true;
            },
            next() {
                this.tabs++;
            },
            back() {
                this.tabs--;
            }
        }
    }
</script>

<style scoped>
    .component-container {
        height: calc(100vh - 128px);
        overflow: auto;
    }
</style>