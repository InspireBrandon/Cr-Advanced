<template>
    <div>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex>
                    <v-card>
                        <v-toolbar dark dense>
                            <v-toolbar-title>Data Import</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-layout row wrap>
                                <v-flex md4 v-for="(card, idx) in cards" :key="idx">
                                    <v-card>
                                        <v-card-text>
                                            <v-icon>{{ card.icon }}</v-icon>
                                            {{card.name}}
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>

    function cardItem(data) {
        this.name = data.name;
        this.icon = data.icon;
    }

    export default {
        name: 'DataImport',
        data: () => {
            return {
                cards: [
                    new cardItem({
                        name: 'Products',
                        icon: 'store'
                    }),
                    new cardItem({
                        name: 'Store Sales',
                        icon: 'shopping_basket'
                    })
                ]
            }
        }
    }
</script>