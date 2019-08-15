<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Basket Analysis</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar flat dark>
            <v-btn small fab color="primary">
                <v-icon>edit</v-icon>
            </v-btn>
            <v-toolbar-items>
                <v-select style="margin-left: 10px; margin-top: 4px; width: 200px" placeholder="Select basket" dense
                    hide-details>
                </v-select>
            </v-toolbar-items>
        </v-toolbar>
        <Grid ref="Grid" />
    </v-card>
</template>

<script>
    import Grid from './Grid'
    import BasketConfig from './Basket_Config'
    import PremiumNature from './PremiumNature/PremiumNature.vue'
    export default {
        components: {
            Grid,
            BasketConfig,
            PremiumNature,
        },
        data() {
            return {
                selectedView: 1

            }
        }

    }
</script>