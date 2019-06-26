<template>
    <div style="text-align: center; cursor: pointer;">
        <v-combobox @change="set_code" class="pa-0 ma-0" :items="params.context.componentParent[params.colDef.dropdownName]"
            placeholder="type in or select a value" v-model="params.data[params.colDef.field]"></v-combobox>
        <!-- <select @change="set_code" style="width: 100%;" placeholder="click to select..." v-model="params.data[params.colDef.field]" name="" id="">
            <option v-for="(item, idx) in params.context.componentParent[params.colDef.dropdownName]" :value="item.id" :key="idx">{{ item.displayname }}</option>
        </select> -->
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

                self.$nextTick(() => {
                    setTimeout(() => {
                        self.setAdditionals(self.params.colDef.field)
                    }, 100);
                })
            },
            setAdditionals(type) {
                let self = this;

                let node = self.params.node;

                switch (type.toUpperCase()) {
                    case "BRAND": {
                        if (self.params.data.vendor_Brand == "") {

                            let tmp = node.data;

                            tmp.vendor_Brand = self.params.data.brand 

                            node.setData(tmp)
                        }
                    }
                    case "CATEGORY": {
                        let tmp = node.data;

                        let currentCategory = self.params.data.category;

                        let fullCategoryDetails = self.params.context.componentParent.getCategoryDetailsByID(currentCategory);

                        tmp.category_Code = fullCategoryDetails.category_Code; 

                        node.setData(tmp)
                        self.params.context.componentParent.redrawAllRows();
                    }
                }
            }
        }
    }
</script>