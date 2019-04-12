<template>
    <div>

        <!-- <SimpleList name="Store"></SimpleList> -->
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex md12>
                    <v-toolbar flat dense dark>
                        <v-btn icon @click="$router.go(-1)">
                            <v-icon>arrow_back</v-icon>
                        </v-btn>
                        <v-toolbar-title>Store</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="openAdd">
                            <v-icon>add_circle</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-list dense>
                        <div v-for="(item,index) in stores" :key=index>
                            <v-list-tile>
                                <v-list-tile-title>{{item.displayname}}</v-list-tile-title>
                                 <v-list-tile-action>
                                        <v-menu left>
                                            <v-btn slot="activator" icon>
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense>
                                                <v-list-tile @click="openEdit(item)">Edit</v-list-tile>
                                                <v-divider></v-divider>
                                                <v-list-tile>Delete</v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </v-list-tile-action>
                                
                            </v-list-tile>
                            <v-divider></v-divider>
                        </div>
                    </v-list>
                </v-flex>
            </v-layout>
        </v-container>
        <ModifyStore ref="modifyStore" />
    </div>
</template>

<script>
    // import SimpleList from '@/components/Apps/DataPreparation/Common/SimpleList.vue'
    import ModifyStore from '@/components/Apps/DataPreparation/Types/Store/Modify/Index.vue'
    import Axios from 'axios'

    export default {
        data() {
            return {
                stores: [],
            }
        },
        components: {
            // SimpleList,
            ModifyStore
        },
        mounted() {
            this.getStores()
        },
        methods: {
            openEdit(item) {
                let self = this;
                self.$refs.modifyStore.open(item);
            },
            getStores() {
                let self = this


                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Retailer/Store`)
                    .then(r => {
                        console.log(r);

                        self.stores = r.data;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openAdd() {},
        }

    }
</script>