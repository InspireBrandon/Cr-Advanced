<template>
    <div v-if="params != undefined">
        <table style="width: 100%;">
            <tr>
                <td>
                    {{ params.valueFormatted }}
                </td>
                <td style="width: 30px;"
                    v-if="params.data.store_Range_Indicator == 'YES' && params.data.sales_Retail == 0">
                    <v-btn icon small class="ma-0" @click="toggleMinMax">
                        <v-icon :size="15">{{ getToggleIcon() }}</v-icon>
                    </v-btn>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'min-max-toggle',
        data() {
            return {

            }
        },
        mounted() {
            let self = this;
        },
        methods: {
            getToggleIcon() {
                let self = this;

                if (self.params.data.constraintMinMax.min == 2 && self.params.data.constraintMinMax.max == 0) {
                    return "arrow_upward";
                } else if (self.params.data.constraintMinMax.min == 3 && self.params.data.constraintMinMax.max == 5) {
                    return "arrow_downward";
                }
            },
            toggleMinMax() {
                let self = this;

                if (self.params.data.constraintMinMax.min == 2 && self.params.data.constraintMinMax.max == 0) {
                    self.params.data.constraintMinMax.min = 3;
                    self.params.data.constraintMinMax.max = 5;
                } else if (self.params.data.constraintMinMax.min == 3 && self.params.data.constraintMinMax.max == 5) {
                    self.params.data.constraintMinMax.min = 2;
                    self.params.data.constraintMinMax.max = 0;
                }

                self.params.api.redrawRows();
            }
        }
    }
</script>