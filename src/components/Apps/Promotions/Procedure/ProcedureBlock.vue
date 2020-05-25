<template>
    <div>
        <div style="display: table; width: 100%;">
            <div style="display: table-cell;">
                <div style="display: flex; cursor: pointer;" @click="collapse">
                    <v-icon>{{ collapsed ? 'arrow_right' : 'arrow_drop_down' }}</v-icon>
                    <h4 v-if="!rename" @dblclick="setRename" class="font-weight-light" style="margin-top: 2px;">
                        {{ item.description }}
                    </h4>
                    <v-text-field v-else v-model="item.description" @blur="doRename(item)">

                    </v-text-field>
                </div>
            </div>
            <div style="display: table-cell; text-align: right;">
                <v-btn small color="primary" text class="ma-0 mb-2" flat @click="addStep(item)">Add step</v-btn>
                <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn small v-on="on" color="primary" text class="ma-0 mb-2 ml-2" flat>More</v-btn>
                    </template>
                    <v-list dense>
                        <v-list-tile @click="renameItem(item)">
                            <v-list-tile-title>Rename</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Save as template</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="deleteItem(item)">
                            <v-list-tile-title>Delete</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
        </div>
        <v-divider></v-divider>
        <div v-if="!collapsed">
            <table style="width: 100%;" class="paleBlueRows">
                <tbody>
                    <tr v-for="(step, idx) in steps" :key="idx">
                        <td style="width: 50%;">
                            <input style="width: 100%;" v-model="step.step" @change="editStep(step)" type="text">
                        </td>
                        <td style="width: 100px;">
                            <input v-model="step.dueDate" value="step.dueDate" @change="editStep(step)" type="date">
                        </td>
                        <td style="width: 200px; cursor: pointer;">
                            <select v-model="step.status" @change="editStep(step)" style="width: 100%;">
                                <option value="1">Pending</option>
                                <option value="2">In Progress</option>
                                <option value="3">Complete</option>
                            </select>
                        </td>
                        <td style="width: 300px;">
                            <UserSelector :submitUsers="submitUsers" :groups="groups" :users="users" :step="step" />
                        </td>
                        <td style="width: 60px; text-align: center;">
                            <a href="#" @click.prevent="removeStep(step,idx)">remove</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <v-divider></v-divider>
        </div>
    </div>
</template>

<script>
    import moment from "moment"
    import UserSelector from './UserSelector.vue'
    import axios from "axios"
    export default {
        components: {
            UserSelector
        },
        props: ['item', "renameItem", "addNewStep","deleteItem"],
        data() {
            return {
                collapsed: true,
                steps: [],
                rename: false,
                users: [],
                groups: []
            }
        },
        methods: {
            submitUsers(selected, step) {
                let self = this
                selected.groups
                let req = {
                    user: [],
                    adminGroup: []
                }
                selected.user.forEach(element => {
                    req.user.push(element.id)
                });
                selected.adminGroup.forEach(element => {
                    req.adminGroup.push(element.id)
                });
                console.log("selected", selected);
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.post(process.env.VUE_APP_API + `PromotionProcedureStepUserLink?stepID=${step.id}`, req).then(
                    r => {
                        console.log("submitUsers", r);
                    })
            },
            collapse() {
                let self = this
                self.collapsed = !self.collapsed
                if (!self.collapsed) {
                    self.getProcedureSteps()
                }
            },
            addStep(item) {
                let self = this;
                let newStep = new step(null)
                self.steps.push(newStep);
                self.addNewStep(item, newStep)
            },
            removeStep(step, idx) {
                let self = this;
                self.steps.splice(idx, 1);
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.delete(process.env.VUE_APP_API + `PromotionProcedureStep?procedureStepID=${step.id}`).then(
                    r => {
                        console.log("removeStep", r);
                    })
                // 
            },
            setRename() {
                let self = this
                self.rename = true
            },
            doRename(item) {
                let self = this
                self.rename = false
                self.renameItem(item)

            },
            getProcedureSteps() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.get(process.env.VUE_APP_API + `PromotionProcedureStep?procedureID=${self.item.id}`).then(r => {
                    console.log("getProcedureSteps", r.data);

                    self.steps = r.data

                    self.steps.forEach(step => {
                        step.dueDate = moment(step.dueDate).format("YYYY-MM-DD")
                    })
                })

            },
            editStep(step) {
                let self = this
                console.log("editStep", step);

                self.$nextTick(() => {
                    axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    axios.put(process.env.VUE_APP_API + `PromotionProcedureStep`, step).then(r => {
                        console.log("editStep", r);

                    })
                })

            },
            getUsers() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.get(process.env.VUE_APP_API + `Promotion/GetAllAdminUsers`).then(r => {
                    console.log("getAdminUsers", r.data);
                    self.users = []
                    r.data.forEach(element => {
                        self.users.push(new UserGroup(element, false))
                    })
                })

            },
            getGroups() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.get(process.env.VUE_APP_API + `Promotion/AdminUserGroups`).then(r => {
                    self.groups = [];
                    r.data.forEach(element => {
                        self.groups.push(new AdminGroup(element, false))
                    });
                    // self.groups = r.data
                })
            },

        },
        mounted() {
            this.getUsers()
            this.getGroups()
        }
    }

    function AdminGroup(params, selected) {
        let self = this;
        self.name = params.name;
        self.id = params.id;
        self.selected = selected;
    }

    function UserGroup(params, selected) {
        let self = this;
        self.eMail = params.name;
        self.id = params.id;
        self.name = params.name;
        self.promotionGroupName = params.promotionGroupName;
        self.promotion_Admin_Group_ID = params.promotion_Admin_Group_ID;
        self.selected = selected;
    }

    function step(data) {
        let self = this;
        self.id = null;
        self.promotion_Procedure_ID = null;
        self.step = '';
        self.dueDate = new Date();
        self.status = 1;
        self.responsibleUserID = null;
        self.responsibleGroupID = null;
        self.users = []
        if (data != null) {
            self.id = data.di;
            self.promotion_Procedure_ID = data.promotion_Procedure_ID;
            self.step = data.step;
            self.dueDate = data.dueDate;
            self.status = data.status;
            self.responsibleUserID = data.responsibleUserID;
            self.responsibleGroupID = data.responsibleGroupID;
        }

    }
</script>