<template>
    <div :style="{ 'color': colors[optionsIndex] }" @dblclick="incrementTytpe"
        style="text-align: center; cursor: pointer;">
        <span>
            <b>
                {{ options[optionsIndex] }}
            </b>
        </span>
    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'

    export default {
        components: {
            YesNoModal
        },
        data() {
            return {
                optionsIndex: 0,
                options: ['New', 'Drop', 'Change'],
                colors: ['blue', 'red', 'green']
            }
        },
        methods: {
            openEdit() {
                let product = this.params;
            },
            incrementTytpe() {
                let self = this;

                if (self.optionsIndex == 2)
                    self.optionsIndex = 0;
                else
                    self.optionsIndex++;

                let tmp = self.params.data;
                tmp["type"] = self.optionsIndex;

                self.params.api.updateRowData({
                    update: [tmp]
                });
            }
        },
        mounted() {
            let self = this;

            setTimeout(() => {
                let tmp = self.params.data;

                if (self.params.data.type == undefined || self.params.data.type == null) {
                    tmp["type"] = 0;

                    self.params.api.updateRowData({
                        update: [tmp]
                    });
                } else {
                    self.optionsIndex = tmp.type;
                };
            }, 60);
        }
    }
</script>