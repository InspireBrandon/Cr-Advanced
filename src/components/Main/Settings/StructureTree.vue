<template>
    <div style="width: 440px;">
        <div>
            <v-btn style="margin-left: -2px;" color="primary">Add department</v-btn>
        </div>
        <div style="max-height: calc(100vh - 230px); overflow-y: auto;">
            <div v-for="(department, idx) in treeItems" :key="'d' + idx">
                <v-card @mouseover="department.showOptions = true" @mouseleave="department.showOptions = false"
                    style="width: 350px; cursor: pointer;" flat color="black" dark class="mb-1">
                    <v-card-title class="pa-1">
                        <div style="height: 30px; padding-top: 4px;">{{ department.name }}</div>
                        <v-spacer></v-spacer>
                        <div v-if="department.showOptions">
                            <v-icon color="white">add</v-icon>
                            <v-icon color="white">delete</v-icon>
                        </div>
                        <v-icon v-if="!department.showChildren" class="ml-3" @click.prevent="department.onClick"
                            color="white">keyboard_arrow_down</v-icon>
                        <v-icon v-if="department.showChildren" class="ml-3" @click.prevent="department.onClick"
                            color="white">keyboard_arrow_up</v-icon>
                    </v-card-title>
                </v-card>
                <div v-for="(category, idx) in department.children" :key="'c' + idx">
                    <v-card @mouseover="category.showOptions = true" @mouseleave="category.showOptions = false"
                        style="width: 350px; cursor: pointer;" flat color="blue" dark class="mb-1 ml-4">
                        <v-card-title class="pa-1">
                            <div style="height: 30px; padding-top: 4px;">{{ category.name }}</div>
                            <v-spacer></v-spacer>
                            <div v-if="category.showOptions">
                                <v-icon @click.prevent="doShiz" color="white">add</v-icon>
                                <v-icon color="white">delete</v-icon>
                            </div>
                            <v-icon v-if="!category.showChildren" class="ml-3" @click="category.onClick" color="white">
                                keyboard_arrow_down</v-icon>
                            <v-icon v-if="category.showChildren" class="ml-3" @click="category.onClick" color="white">
                                keyboard_arrow_up</v-icon>
                        </v-card-title>
                    </v-card>
                    <div class="ml-4" v-for="(brand, idx) in category.children" :key="'b' + idx">
                        <v-card @mouseover="brand.showOptions = true" @mouseleave="brand.showOptions = false"
                            style="width: 350px; cursor: pointer;" flat color="grey darken-1" dark class="mb-1 ml-4">
                            <v-card-title class="pa-1">
                                <div style="height: 30px; padding-top: 4px;">{{ brand.name }}</div>
                                <v-spacer></v-spacer>
                                <div v-if="brand.showOptions">
                                    <v-icon color="white">delete</v-icon>
                                </div>
                            </v-card-title>
                        </v-card>
                    </div>
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
            },
            doShiz() {

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