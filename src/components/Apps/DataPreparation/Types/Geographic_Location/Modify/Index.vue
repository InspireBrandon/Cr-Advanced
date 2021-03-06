<template>
    <v-dialog transition="dialog-bottom-transition" v-model="dialog" fullscreen>
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Maintain Store</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="ma-0 pa-0">
                <v-card>
                    <v-tabs v-model="active" grow centered color="blue-grey darken-3" dark icons-and-text>
                        <v-tab ripple class="subheading font-weight-regular font-italic"> Details
                            <v-icon>details</v-icon>
                        </v-tab>
                        <v-tab ripple class="subheading font-weight-regular font-italic"> Personale
                            <v-icon>person</v-icon>
                        </v-tab>
                        <v-tab ripple class="subheading font-weight-regular font-italic"> Areas
                            <v-icon>location_on</v-icon>
                        </v-tab>
                        <v-tab ripple class="subheading font-weight-regular font-italic"> Category 
                            <v-icon>category</v-icon>
                        </v-tab>
                        <v-tab-item>
                            <v-card-text class="component-container ma-0">
                                <v-layout row wrap>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Name ref="name" />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Location ref="Location" />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Contact ref="Contact" />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Properties ref="Properties" />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Configuration ref="Configuration" />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <Observations ref="Observations" />
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text class="component-container ma-0">
                                <v-layout row wrap>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <StoreManager ref="StoreManager" />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <AssistantManager ref="AssistantManager" />
                                    </v-flex>
                                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                                        <AlternateContact ref="AlternateContact" />
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text class="component-container ma-0">
                                <v-layout row wrap>
                                    <v-flex xl12 lg12 md12 sm12 xs12 class="pa-1">
                                        <Dimensions ref="Dimensions" />
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text class="component-container ma-0">
                                <v-layout row wrap>
                                    <v-flex xl12 lg12 md12 sm12 xs12 class="pa-1">
                                        <Category ref="Category" />
                                    </v-flex>
                                </v-layout>
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
    import Category from '@/components/Apps/DataPreparation/Types/Store/Modify/Sections/Category.vue'
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
    import Axios from 'axios';

    export default {
        components: {
            Category,
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
        },
        data: () => {
            return {
                id: null,
                dialog: false,
                active: 0,
                componentRefs: [
                    'name',
                    'AlternateContact',
                    'Dimensions',
                    'AssistantManager',
                    'StoreManager',
                    "Observations",
                    'Configuration',
                    'Properties',
                    "Contact",
                    'Location',

                ]
            }
        },
        methods: {
            open(item) {
                let self = this;
                self.populateComponents(item);

                this.dialog = true;
            },
            populateComponents(item) {
                let self = this;
                self.id = item.id
                self.componentRefs.forEach(element => {
                    self.$refs[element].setForm(item);
                })
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

                finalFormObj.id = self.id
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.put(process.env.VUE_APP_API + 'Retailer/Store', finalFormObj).then(res => {

                    delete Axios.defaults.headers.common["TenantID"];
                    this.dialog = false;

                })
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