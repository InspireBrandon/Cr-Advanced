<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Basket Analysis</span>
            </v-toolbar-title>
        </v-toolbar>
        <PremiumNature ref="PremiumNature" />

    </v-card>
</template>

<script>
    import BasketConfig from './Basket_Config'
    import PremiumNature from './PremiumNature/PremiumNature.vue'
    export default {
        components: {
            BasketConfig,
            PremiumNature
        },
        data() {
            return {

            }
        }

    }
</script>