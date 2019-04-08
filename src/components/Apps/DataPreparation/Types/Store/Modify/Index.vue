<template>
    <v-dialog v-model="dialog" fullscreen>
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Maintain Store</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="ma-0 pa-0">
                <v-card>
                    <v-tabs v-model="active" grow centered dark>
                        <v-tab ripple>Details</v-tab>
                        <v-tab ripple>Personale</v-tab>
                        <v-tab ripple>Areas</v-tab>
                        <v-tab-item>
                            <v-card-text class="component-container ma-0">
                                <v-layout row wrap>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Name ref="name" />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Location />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Contact />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Properties />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Configuration />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Observations />
                                    </v-flex>
                                </v-layout>
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
                    <v-btn color="primary" @click="processSave">Save</v-btn>
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
                active: 0,
                componentRefs: [
                    'name'
                ]
            }
        },
        methods: {
            open() {
                this.dialog = true;
            },
            validateComponents() {
                let self = this;

                let allValid = true;

                self.componentRefs.forEach(element => {
                    let componentValid = self.$refs[element].validate();

                    if (allValid && !componentValid) {
                        allValid = false;
                    }
                });

                if (allValid) {
                    self.save();
                }
            },
            save() {
                let self = this;

                let finalFormObj = {};

                self.componentRefs.forEach(element => {
                    let componentForm = self.$refs[element].getForm();
                    Object.assign(finalFormObj, componentForm);
                });

                console.log(finalFormObj);
            },
            processSave() {
                let self = this;
                self.validateComponents();
            }
        }
    }
</script>

<style scoped>
    .component-container {
        height: calc(100vh - 176px);
        overflow: auto;
    }
</style>