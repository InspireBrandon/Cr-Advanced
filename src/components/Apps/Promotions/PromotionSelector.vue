<template>
    <div>
        <v-dialog persistent v-model="dialog" width="800">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Promotions</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pa-0">
                    <v-text-field v-model="searchText" prepend-inner-icon="search" placeholder="Search..." solo flat hide-details>
                    </v-text-field>
                    <v-divider></v-divider>
                </v-card-text>
                <v-card-text class="px-0 py-0" style="height: 300px; overflow-y: scroll;">
                    <div>
                        <v-list dense hover class="pa-0">
                            <template v-for="(promotion, idx) in filteredPromotions">
                                <v-list-tile :class="{ 'highlighted': selectedPromotion == promotion  }" avatar
                                    @click="selectedPromotion = promotion" :key="idx">
                                    <v-list-tile-content>
                                        <v-list-tile-title v-html="getPromotionName(promotion)"> </v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-spacer></v-spacer>
                                </v-list-tile>
                                <v-divider class="ma-0 pa-0" :key="idx + 'd'"></v-divider>
                            </template>
                        </v-list>
                    </div>
                </v-card-text>

                <v-divider class="ma-0 pa-0"></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="returnPromotion">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                dialog: false,
                afterComplete: null,
                promotions: [],
                selectedPromotion: null,
                searchText: ''
            }
        },
        computed: {
            filteredPromotions() {
                return this.promotions.filter(item => {
                    if (!this.searchText) return this.promotions;
                    return (item.description.toLowerCase().includes(this.searchText.toLowerCase()))
                });
            }
        },
        methods: {
            defaults() {},
            show(afterComplete) {
                let self = this;
                self.getPromotions();
                self.afterComplete = afterComplete;
                self.dialog = true;
            },
            getPromotions() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Promotion')
                    .then(r => {
                        self.promotions = r.data;
                    })
                    .catch(e => {

                    })
            },
            getPromotionName(promotion) {
                let self = this;

                let name = promotion.description;
                let startDate = promotion.startDate.split("T")[0];
                let endDate = promotion.endDate.split("T")[0];

                return `<b>${name}</b> - ${startDate} to ${endDate}`
            },
            returnPromotion() {
                let self = this;
                self.afterComplete(self.selectedPromotion);
                self.dialog = false;
            }
        }
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
        width: 100%;
    }

    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
        padding: 2px 5px;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>