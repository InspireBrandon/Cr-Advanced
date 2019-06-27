<template>
    <div style="text-align: center; cursor: pointer;">
        <v-combobox @change="set_code" class="pa-0 ma-0"
            :items="params.context.componentParent[params.colDef.dropdownName]" placeholder="type in or select a value"
            v-model="params.data[params.colDef.field]"></v-combobox>
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
                    self.setAdditionals(self.params.colDef.field)
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
                            self.params.context.componentParent.redrawAllRows();
                        }
                    }
                    case "CATEGORY": {
                        let tmp = node.data;

                        let currentCategory = self.params.data.category;

                        if (currentCategory != null) {
                            let fullCategoryDetails = self.params.context.componentParent.getCategoryDetailsByID(
                                currentCategory);
    
                            tmp.category_Code = fullCategoryDetails.category_Code;
    
                            tmp.subdepartment = fullCategoryDetails.subdepartmentName;
                            tmp.department = fullCategoryDetails.departmentName;
    
                            node.setData(tmp)
                            self.params.context.componentParent.redrawAllRows();
                        }
                    }
                    case "SUPPLIER": {
                        let tmp = node.data;

                        let currentSupplier = self.params.data.supplier;

                        if (currentSupplier != null) {
                            let fullSupplierDetails = self.params.context.componentParent.getSupplierByID(
                                currentSupplier);

                            console.log(fullSupplierDetails)

                            tmp.supplier_Code = fullSupplierDetails.supplier_Code;

                            node.setData(tmp)
                            self.params.context.componentParent.redrawAllRows();
                        }
                    }
                }
            }
        }
    }
</script>