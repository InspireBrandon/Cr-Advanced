<template>
    <v-dialog v-model="dialog" fullscreen>
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Maintain Store</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="ma-0">
                <v-card>
                    <v-tabs v-model="active" grow centered dark>
                        <v-tab ripple>Details</v-tab>
                        <v-tab ripple>Personale</v-tab>
                        <v-tab ripple>Areas</v-tab>
                        <v-tab-item>
                            <v-card-text class="component-container ma-0">
                                <Name />
                                <Location />
                                <Contact />
                                <Properties />
                                <Configuration />
                                <Observations />
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text class="component-container ma-0">
                                <StoreManager />
                                <AssistantManager />
                                <AlternateContact />
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text class="component-container ma-0">
                                <Dimensions />
                                <!-- <AnnualDirectSalesArea /> -->
                            </v-card-text>
                        </v-tab-item>
                    </v-tabs>
                </v-card>
            </v-card-text>
            <v-card-actions class="pa-0">
                <v-toolbar flat color="secondary">
                    <v-spacer></v-spacer>
                    <v-btn color="primary">Save</v-btn>
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
    import StoreManager from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Store_Manager.vue'
    import AssistantManager from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Assistant_Manager.vue'
    import AlternateContact from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Alternate_Contact.vue'
    import Configuration from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Configuration.vue'
    import Observations from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Observations.vue'
    import AnnualDirectSalesArea from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Annual_Direct_Sales_Area.vue'

    export default {
        components: {
            Name,
            Properties,
            Contact,
            Location,
            Dimensions,
            StoreManager,
            AssistantManager,
            AlternateContact,
            Configuration,
            Observations,
            AnnualDirectSalesArea
        },
        data: () => {
            return {
                dialog: false,
                active: 0
            }
        },
        methods: {
            open() {
                this.dialog = true;
            }
        }
    }
</script>

<style scoped>
    .component-container {
        height: calc(100vh - 208px);
        overflow: auto;
    }
</style>