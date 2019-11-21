<template>
    <div style="max-height: 500px; overflow-y: auto; width: 450px;">
        <div v-for="(department, idx) in treeItems" :key="'d' + idx">
            <v-card @click="department.onClick" style="width: 350px;" flat color="black" dark class="mb-1">
                <v-card-title class="pa-1">
                    <div>{{ department.name }}</div>
                    <v-spacer></v-spacer>
                    <div v-if="department.showOptions">
                        <v-btn icon class="ma-0 pa-0">
                            <v-icon color="white">add</v-icon>
                        </v-btn>
                        <v-btn icon class="ma-0 pa-0">
                            <v-icon color="white">delete</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
            </v-card>
            <div v-for="(category, idx) in department.children" :key="'c' + idx">
                <v-card @click="category.onClick" style="width: 350px;" flat color="blue" dark class="mb-1 ml-4">
                    <v-card-text class="pa-1">{{ category.name }}</v-card-text>
                </v-card>
                <div class="ml-4" v-for="(brand, idx) in category.children" :key="'b' + idx">
                    <v-card style="width: 350px;" flat color="grey darken-1" dark class="mb-1 ml-4">
                        <v-card-text class="pa-1">{{ brand.name }}</v-card-text>
                    </v-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                treeItems: []
            }
        },
        mounted() {
            let self = this;
            self.getSystemDepartments();
        },
        methods: {
            getSystemDepartments() {
                let self = this;

                self.treeItems = [];

                Axios.get(process.env.VUE_APP_API + "SystemDepartment")
                    .then(r => {
                        self.buildDepartmentTrees(r.data);
                    })
            },
            buildDepartmentTrees(departments) {
                let self = this;

                departments.forEach(department => {
                    let dti = new treeItem(department);

                    dti.onClick = function () {
                        if (dti.showChildren) {
                            dti.showChildren = false;
                            dti.children = [];
                        } else {
                            self.getCategoryItems(dti.id, children => {
                                dti.children = children;
                                dti.showChildren = true;
                            });
                        }
                    }

                    self.treeItems.push(dti);
                });
            },
            getCategoryItems(departmentID, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `SystemStructure?departmentID=${departmentID}`)
                    .then(r => {
                        let children = self.processHierachy(r.data.systemStructureList);
                        callback(children);
                    })
            },
            processHierachy(data) {
                let retval = [];
                let uniqueCategories = [];

                // get unique categories
                data.forEach(el => {
                    let canAdd = true;

                    uniqueCategories.forEach(uc => {
                        if (el.systemCategory_ID == uc.id && el.systemCategory_ID != null)
                            canAdd = false;
                    })

                    if (canAdd) {
                        uniqueCategories.push({
                            id: el.systemCategory_ID,
                            name: el.systemCategory
                        })
                    }
                })

                uniqueCategories.forEach(el => {
                    let cti = new treeItem(el);

                    cti.onClick = function () {
                        if (cti.showChildren) {
                            cti.showChildren = false;
                            cti.children = [];
                        } else {
                            let brands = data.filter(item => {
                                return item.systemCategory_ID == el.id;
                            });

                            brands.forEach(brand => {
                                let bi = new treeItem({
                                    id: brand.systemBrand_ID,
                                    name: brand.systemBrand
                                });

                                cti.children.push(bi);
                            });

                            cti.showChildren = true;
                        }
                    }

                    retval.push(cti);
                })

                return retval;
            }
        }
    }

    function treeItem(data) {
        let self = this;

        for (var prop in data) {
            self[prop] = data[prop];
        }

        self.children = [];
        self.onClick = null;
        self.showOptions = false;
        self.showChildren = false;
    }
</script>