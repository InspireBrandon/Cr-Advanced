<template>
    <div style="text-align: center; cursor: pointer;">
        <select @change="set_code" style="width: 100%;" placeholder="click to select..." v-model="params.data[params.colDef.field]" name="" id="">
            <option v-for="(item, idx) in params.context.componentParent[params.colDef.dropdownName]" :value="item.id" :key="idx">{{ item.displayname }}</option>
        </select>
    </div>
</template>
<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                items: []
            }
        },
        methods: {
            set_code() {
                let self = this;

                let node = self.params.node;

                self.$nextTick(() => {
                    self.params.context.componentParent[self.params.colDef.dropdownName].forEach(element => {
                        if(element.id == self.params.data[self.params.colDef.field]) {
                            node.setData({ [self.params.colDef.field + "_Code"]: element[self.params.colDef.field + "_Code"] })
                        }
                    });
                })
            }
        }
    }
</script>