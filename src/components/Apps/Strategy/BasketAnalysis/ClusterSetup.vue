<template>
    <v-dialog v-model="dialog" persistent max-width="1100px">
        <v-toolbar color="primary" dark dense flat>
            <v-toolbar-title>
                Cluster Setup
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card>
            <v-card-title>
                <v-text-field v-model="clusterAmount" @change="generateClusterCards()" label="clusters" number>
                </v-text-field>
            </v-card-title>
            <v-card-text>
                <v-card max-width="1000px">
                    <v-layout>
                        <div v-for="(item,index) in clusters" :key="index">
                            <v-card dark :width="item.amount*10" :color="item.color" height="50px">
                                <v-text-field v-model="item.amount" @change="handleWidth(item)" :label="item.name">
                                </v-text-field>
                            </v-card>
                        </div>
                    </v-layout>
                </v-card>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="submit">submit </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        data() {
            return {
                clusterValues: [33, 66],
                callback: null,
                dialog: false,
                clusterAmount: 3,
                clusters: [],
            }
        },

        methods: {
            show(config, callback) {
                let self = this
                self.clusters = []

                let defaultwidth = ((1000 / self.clusterAmount) / 1000 * 100).toFixed(0)

                while (self.clusters.length < self.clusterAmount) {
                    self.clusters.push({
                        name: "cluster " + (self.clusters.length + 1),
                        color: getRandomColor(),
                        amount: defaultwidth,
                    })
                }
                self.dialog = true
                self.callback = callback
            },
            handleWidth(item) {
                let self = this
               
                
                self.$nextTick(() => {
                    var total = 0
                    
                    total = 1000 - (item.amount*10)
                    let newDefault = total / (self.clusters.length - 1)/10
                     console.log(total);
                    console.log(newDefault);
                    
                    self.clusters.forEach(element => {
                        if (element != item) {
                            element.amount = newDefault
                        }
                    })
                })
            },
            generateClusterCards() {
                let self = this
                self.clusters = []

                let defaultwidth = ((1000 / self.clusterAmount) / 1000 * 100).toFixed(0)

                while (self.clusters.length < self.clusterAmount) {
                    self.clusters.push({
                        name: "cluster " + (self.clusters.length + 1),
                        color: getRandomColor(),
                        amount: defaultwidth,
                    })
                }
            },
            submit() {
                let self = this
                self.callback(self.clusterValues)
                self.dialog = false
            }
        }
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
</script>