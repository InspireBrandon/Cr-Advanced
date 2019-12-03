
<template>
    <div style="display: flex;">
        <div style="height: 35px;" v-for="(item,idx) in params.context.componentParent.level" :key="idx"
            :style="{ 'width': parseFloat( (params.data.ratioARR[idx].value*2)) +'%', 'background': params.data.ratioARR[idx].color }">
            <v-tooltip right>
                <template v-slot:activator="{ on }">
                    <div style="width: 100%; height: 100%" v-on="on"></div>
                </template>
                <span>{{getToolTip(params.data.ratioARR[idx], params.data.sqm_Shop)}}</span>
            </v-tooltip>
        </div>
        <v-tooltip right>
            <template v-slot:activator="{ on }">
                <div v-if="idx > params.context.componentParent.level - 1" v-on="on"
                    style="height: 35px; background: blue" v-for="(item,idx) in params.data.ratioARR" :key="idx"
                    :style="{ 'width': parseFloat( (params.data.ratioARR[idx].value*2)) +'%' }"></div>
            </template>
            <span>{{getAllOthersToolTip()}}</span>
        </v-tooltip>
    </div>
</template>
<script>
    export default {
        methods: {
            getToolTip(item, sqm) {
                let self = this;

                return item.name + " " + " :" + " " + (item.value).toFixed(2) + "%"
            },
            getAllOthersToolTip() {
                let self = this;
                let otherPercent = 0;

                self.params.data.ratioARR.forEach((element, idx) => {
                    if(idx > self.params.context.componentParent.level - 1)
                        otherPercent += element.value
                });

                return "All others" + " " + " :" + " " + (otherPercent).toFixed(2) + "%"
            }
        }
    }
</script>
