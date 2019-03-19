<template>
    <v-layout row wrap>
        <v-flex lg10 md8 sm4 xs12>
            <v-layout row wrap>
                <v-flex lg4 md4 sm4 xs12 v-for="(appConfigDetail, index) in appConfigDetail" :key="index">
                    <store-app-block :appConfigDetail="appConfigDetail"></store-app-block>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex lg1 md2>
        </v-flex>
    </v-layout>
</template>

<script>
    import store_app_block from '@/components/Main/Store/store_app_block.vue';

    export default {
        name: 'apps',
        props: ['appConfigDetail'],
        components: {
            'store-app-block': store_app_block
        },
        data() {
            return {
                index: 0,
            }
        },
        computed: {
            itemsInIndex() {
                let self = this;
            }
        },
        methods: {}
    }
</script>