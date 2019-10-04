<template>
    <v-dialog v-model="dialog" persistent width="800px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Retailer Store Links</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text class="pa-0" style="height: 400px; overflow: auto;">
                <Grid :selectSystemStore="selectSystemStore" :rowData="stores" />
            </v-card-text>
            <Prompt ref="Prompt" />
            <YesNoModal ref="YesNoModal" />
            <SystemStoreSelector ref="SystemStoreSelector" />
        </v-card>
    </v-dialog>

</template>
<script>
    import Axios from 'axios'
    import Prompt from '@/components/Common/Prompt'
    import YesNoModal from '@/components/Common/YesNoModal'
    import Grid from './Grid'
    import SystemStoreSelector from './SystemStoreSelector'

    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                stores: []
            }
        },
        components: {
            Prompt,
            YesNoModal,
            Grid,
            SystemStoreSelector
        },
        methods: {
            getStores() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "Store/SystemStores")
                    .then(r => {
                        self.stores = r.data;
                    })
            },
            show(callback) {
                let self = this
                self.getStores();
                self.callback = callback
                self.dialog = true
            },
            close() {
                let self = this
                self.dialog = false
                self.callback();
            },
            selectSystemStore(store) {
                let self = this;

                console.log(store);

                self.$refs.SystemStoreSelector.show(systemStoreID => {
                    Axios.put(process.env.VUE_APP_API + `Store/SystemStores?storeID=${store.id}&systemStoreID=${systemStoreID}`)
                        .then(r => {
                            self.getStores();
                        })
                })
            }
        }
    }
</script>