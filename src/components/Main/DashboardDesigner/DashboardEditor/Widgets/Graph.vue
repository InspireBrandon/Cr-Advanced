<template>
    <v-card flat height="100%" width="100%">
        <loader ref="loader" />
        <div :id="'chartdiv_'+id" style="height:100%; width:100%;"></div>
    </v-card>
</template>
<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import loader from '@/components/Common/Spinner'
    export default {
        components: {
            loader
        },
        data() {
            return {};
        },
        props: ["id"],
        mounted() {
            let self = this;
            self.showLoader();
            setTimeout(() => {
                self.createGraph();
                self.$refs.loader.hide();
            }, 3000);
        },
        methods: {
            createGraph() {
                let chart = am4core.create("chartdiv_" + this.id, am4charts.PieChart);

                // Add data
                chart.data = [{
                        country: "Lithuania",
                        litres: 501.9
                    },
                    {
                        country: "Czechia",
                        litres: 301.9
                    },
                    {
                        country: "Ireland",
                        litres: 201.1
                    },
                    {
                        country: "Germany",
                        litres: 165.8
                    },
                    {
                        country: "Australia",
                        litres: 139.9
                    },
                    {
                        country: "Austria",
                        litres: 128.3
                    },
                    {
                        country: "UK",
                        litres: 99
                    },
                    {
                        country: "Belgium",
                        litres: 60
                    },
                    {
                        country: "The Netherlands",
                        litres: 50
                    }
                ];

                // Add and configure Series
                let pieSeries = chart.series.push(new am4charts.PieSeries());
                pieSeries.dataFields.value = "litres";
                pieSeries.dataFields.category = "country";
                pieSeries.slices.template.stroke = am4core.color("#fff");
                pieSeries.slices.template.strokeWidth = 2;
                pieSeries.slices.template.strokeOpacity = 1;

                // This creates initial animation
                pieSeries.hiddenState.properties.opacity = 1;
                pieSeries.hiddenState.properties.endAngle = -90;
                pieSeries.hiddenState.properties.startAngle = -90;
            },
            showLoader() {
                let self = this;
                self.$refs.loader.show('Loading', 'The widget is loading');
            }
        }
    };
</script>