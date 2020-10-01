<template>
    <v-dialog persistent width="500px" v-model="dialog">
        <v-card>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>View Setup</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <div class="inline">
                    <div class="inline-item main" style="width: 100%;">Main</div>
                </div>
                <div class="inline">
                    <div class="inline-item main">Products</div>
                    <div class="inline-item">
                        <select v-model="form.products" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item main">Hierachy</div>
                    <div class="inline-item">
                        <select v-model="form.hierachy" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item main">Dimensions</div>
                    <div class="inline-item">
                        <select v-model="form.dimensions" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item main">Indicators</div>
                    <div class="inline-item">
                        <select v-model="form.indicators" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item analysis" style="width: 100%;">Analysis</div>
                </div>
                <div class="inline">
                    <div class="inline-item analysis">Sales Analysis</div>
                    <div class="inline-item">
                        <select v-model="form.salesAnalysis" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item analysis">Volume Analysis</div>
                    <div class="inline-item">
                        <select v-model="form.volumeAnalysis" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item analysis">Profit Analysis</div>
                    <div class="inline-item">
                        <select v-model="form.profitAnalysis" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item analysis">Cost Analysis</div>
                    <div class="inline-item">
                        <select v-model="form.costAnalysis" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item extended" style="width: 100%;">Extended</div>
                </div>
                <div class="inline">
                    <div class="inline-item extended">Base Line Analysis</div>
                    <div class="inline-item">
                        <select v-model="form.baseLineAnalysis" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item extended">Stock Analysis</div>
                    <div class="inline-item">
                        <select v-model="form.stockAnalysis" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item extended">Stock Levels</div>
                    <div class="inline-item">
                        <select v-model="form.stockLevels" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item extended">Distribution</div>
                    <div class="inline-item">
                        <select v-model="form.distribution" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div class="inline-item extended">Index</div>
                    <div class="inline-item">
                        <select v-model="form.index" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline">
                    <div style="border-bottom: 1px solid grey;" class="inline-item extended">Price & Margin</div>
                    <div style="border-bottom: 1px solid grey;" class="inline-item">
                        <select v-model="form.priceAndMargin" style="width: 100%;">
                            <option :value="option.value" v-for="(option, key) in options" :key="key">{{ option.text }}
                            </option>
                        </select>
                    </div>
                </div>
            </v-card-text>
            <v-divider class="mx-3"></v-divider>
            <v-card-actions class="mx-2">
                <v-spacer></v-spacer>
                <v-btn @click="dialog = false">cancel</v-btn>
                <v-btn @click="submit" color="primary">continue</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        data() {
            return {
                dialog: false,
                afterReturn: null,
                options: [{
                        text: "Yes",
                        value: 1
                    },
                    {
                        text: "No",
                        value: 2
                    },
                    {
                        text: "All",
                        value: 3
                    }
                ],
                form: {
                    products: 1,
                    hierachy: 1,
                    dimensions: 2,
                    indicators: 1,
                    salesAnalysis: 2,
                    volumeAnalysis: 1,
                    profitAnalysis: 2,
                    costAnalysis: 2,
                    baseLineAnalysis: 1,
                    stockAnalysis: 1,
                    stockLevels: 2,
                    distribution: 1,
                    index: 1,
                    priceAndMargin: 1
                }
            }
        },
        mounted() {},
        methods: {
            show(afterReturn) {
                let self = this;
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            submit() {
                let self = this;
                self.afterReturn(self.form);
                self.dialog = false;
            }
        }
    }
</script>

<style scoped>
    .inline {
        display: flex;
        border-right: 1px solid grey;
    }

    .inline-item {
        border: 1px solid grey;
        border-bottom: 0px;
        border-right: 0px;
        padding: 3px;
        width: 50%;
    }

    .main {
        background: rgba(0, 128, 0, 0.322);
    }

    .analysis {
        background: rgba(255, 255, 0, 0.315);
    }

    .extended {
        background: rgba(255, 166, 0, 0.349);
    }
</style>