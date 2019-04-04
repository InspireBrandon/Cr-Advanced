<template>
    <div>
        <!-- <SimpleList name="Store"></SimpleList> -->
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex md12>
                    <v-list dense>
                        <v-list-tile>
                            <v-list-tile-title>Store 1</v-list-tile-title>
                            <v-list-tile-action>
                                <v-btn icon @click="openEdit">
                                    <v-icon>more_vert</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-flex>
            </v-layout>
        </v-container>
        <ModifyStore ref="modifyStore" />
    </div>
</template>

<script>
    import SimpleList from '@/components/Apps/DataPreparation/Common/SimpleList.vue'
    import ModifyStore from '@/components/Apps/DataPreparation/Types/Store/Modify/Index.vue'

    export default {
        components: {
            SimpleList,
            ModifyStore
        },
        methods: {
            openEdit() {
                let self = this;
                self.$refs.modifyStore.open();
            }
        }
    }
</script>