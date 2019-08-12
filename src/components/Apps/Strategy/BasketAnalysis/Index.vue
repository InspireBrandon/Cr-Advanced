<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-btn-toggle v-model="selectedView" class="transparent">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" :value="1" flat>
                            <v-icon>
                                perm_data_setting</v-icon>
                        </v-btn>
                    </template>
                    <span>Retailer Config</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" :value="2" flat>
                            <v-icon>assessment</v-icon>
                        </v-btn>
                    </template>
                    <span>Premium Nature</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" :value="3" flat>
                            <v-icon>web</v-icon>
                        </v-btn>
                    </template>
                    <span>Planogram</span>
                </v-tooltip>
            </v-btn-toggle>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Basket Analysis</span>
            </v-toolbar-title>

        </v-toolbar>
        <BasketConfig v-if="selectedView==1" ref="BasketConfig" />
        <PremiumNature v-if="selectedView==2" ref="PremiumNature" />

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
                selectedView: null

            }
        }

    }
</script>