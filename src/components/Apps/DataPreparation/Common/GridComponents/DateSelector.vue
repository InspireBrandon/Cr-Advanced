<template>
    <div style="cursor: pointer;">
        <v-menu ref="menu" v-model="menu" :close-on-content-click="true" :nudge-right="40" transition="scale-transition"
            offset-y full-width min-width="290px">
            <template v-slot:activator="{ on }">
                <div v-on="on">{{ date }}</div>
            </template>
            <v-date-picker @input="valueChanged" v-model="date" no-title scrollable></v-date-picker>
        </v-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                date: "",
                menu: false
            }
        },
        methods: {
            valueChanged() {
                let self = this;

                let tmp = self.params.data;
                tmp.test_Period_Review_Date = self.date;

                self.params.api.updateRowData({
                    update: [tmp]
                });
            }
        },
        created() {
            let self = this;
            let data = self.params.data;
            if (data.test_Period_Review_Date == undefined || data.test_Period_Review_Date == null) {
                self.date = new Date().toISOString().substr(0, 10);
            } else {
                self.date = data.test_Period_Review_Date;
            }
        }
    }
</script>