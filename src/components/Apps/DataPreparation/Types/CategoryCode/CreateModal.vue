<template>
    <v-dialog persistent v-model="dialog">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>
                    Category code
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex md6>
                            <v-text-field label="Category Code" v-model="categoryCode">
                            </v-text-field>
                            <v-text-field v-model="selectedCategory" label="Category">
                            </v-text-field>
                            <v-text-field label="Display Name" v-model="DisplayName">
                            </v-text-field>
                        </v-flex>
                        <v-flex md6>
                            <v-autocomplete :items="Departments" v-model="selectedDepartment" label="Department">
                            </v-autocomplete>
                            <v-autocomplete :items="filteredSubDeps" v-model="selectedSubDepartment"
                                label="Subdepartment">
                            </v-autocomplete>
                            <v-autocomplete :items="Planograms" v-model="selectedPlanogram" label="Planogram">
                            </v-autocomplete>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="CheckCode" color="success">
                        submit
                    </v-btn>
                </v-card-actions>
            </v-card-text>
            <Dialog ref="Dialog" />

        </v-card>
    </v-dialog>
</template>
<script>
    import axios from 'axios'
    import Dialog from "@/components/Common/Dialog";

    export default {
        components: {
            Dialog
        },
        data() {
            return {
                categoryCode: null,
                selectedCategory: null,
                DisplayName: null,
                Planograms: [],
                selectedPlanogram: null,
                Departments: [],
                selectedDepartment: null,
                subDepartments: [],
                selectedSubDepartment: null,
                dialog: false,
                callback: null
            }
        },
        created() {
            this.GetData()
        },
        computed: {
            filteredSubDeps() {
                let filteredSubDeps = this.subDepartments.filter((subDep) => {
                    return subDep.department_ID == this.selectedDepartment;
                })

                return filteredSubDeps;
            }
        },
        methods: {
            ChangeDepartment() {
                let self = this
                self.$nextTick(() => {
                    console.log(self.selectedDepartment);
                })
            },
            show(callback) {
                let self = this
                self.dialog = true
                self.callback = callback
            },
            GetData() {
                this.GetPlanograms()
                this.GetDepartments()
                this.GetSubDepartments()
            },
            CheckCode() {
                let self = this
                let item = {
                    Category_Code: self.categoryCode,
                    Category: self.selectedCategory,
                    DisplayName: self.DisplayName,
                    Department_ID: self.selectedDepartment,
                    Subdepartment_ID: self.selectedSubDepartment,
                    Planogram_ID: self.selectedPlanogram
                }
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.post(process.env.VUE_APP_API + `Retailer/Category_Link/CheckCode`, item)
                    .then(r => {
                        console.log(r);
                        delete axios.defaults.headers.common["TenantID"];
                        if (r.data == null) {
                            self.submit(item)
                        } else {
                            self.$refs.Dialog.openDialog({
                                headline: "Duplicate Category Code",
                                text: "Please Use a different Category Code"
                            })
                        }
                    })
            },
            GetPlanograms() {
                let self = this
                axios.get(process.env.VUE_APP_API + "Planogram").then(r => {
                    self.Planograms = []
                    r.data.planogramList.forEach(element => {
                        self.Planograms.push({
                            text: element.planogram,
                            value: element.id
                        })
                    });
                })
            },
            GetDepartments() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.get(process.env.VUE_APP_API + "Retailer/Department").then(r => {
                    console.log("Retailer/Department");
                    console.log(r);
                    self.Departments = []
                    r.data.forEach(element => {
                        self.Departments.push({
                            text: element.department,
                            value: element.id
                        })
                    });
                    console.log(self.Departments);

                    delete axios.defaults.headers.common["TenantID"];

                })
            },
            GetSubDepartments() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.get(process.env.VUE_APP_API + "Retailer/SubDepartment").then(r => {
                    console.log("Retailer/SubDepartment");
                    console.log(r);
                    self.subDepartments = []
                    r.data.forEach(element => {
                        self.subDepartments.push({
                            text: element.subdepartment,
                            value: element.id,
                            department_ID: element.department_ID,

                        })
                    });
                    delete axios.defaults.headers.common["TenantID"];

                })
            },
            submit(item) {
                let self = this;
                self.callback(item);
                self.dialog = false;
            }
        }
    }
</script>