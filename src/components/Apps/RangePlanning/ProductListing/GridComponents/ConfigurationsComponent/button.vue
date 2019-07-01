<template>
    <div style="text-align: center; cursor: pointer;">
        <v-btn @click="openEdit(params)" class="ma-0" small icon>
            <v-icon color="secondary">edit</v-icon>
        </v-btn>
        <v-btn @click="removeLine" class="ma-0" small icon>
            <v-icon color="red">delete</v-icon>
        </v-btn>
        <YesNoModal ref="yesNo"></YesNoModal>

        <v-dialog v-model="EditDialog" persistent max-width="600px" height="500px">
            <v-card>
                <v-toolbar dark flat color="blue darken-2" scroll-off-screen>
                    <v-toolbar-title>Configuration Edit</v-toolbar-title>
                </v-toolbar>
                <v-form @submit.prevent="saveForm(params)">
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field label="First name" maxlength="40" counter="40" :rules="nameRules" v-model="editForm.firstname" required>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field label="Last name" maxlength="40" counter="40" :rules="nameRules" v-model="editForm.lastname" required>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-select required v-model="editForm.resourceType" :items="resourceTypeItems"
                                        item-text="text" item-value="value" label="Resource Type">
                                    </v-select>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="secondary" flat @click="EditDialog = false">Close</v-btn>
                        <v-btn color="primary" type="submit">Save</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>

    </div>

</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'
    import Axios from 'axios';

    export default {
        data() {
            return {
                EditDialog: false,
                editForm: {
                    id: 0,
                    firstname: '',
                    lastname: '',
                    resourceType: 0
                },
                resourceTypeItems: [{
                        value: 0,
                        text: "Retail Buyer"
                    },
                    {
                        value: 1,
                        text: "Retail Stock Planner"
                    },
                    {
                        value: 2,
                        text: "Buyer Assistant"
                    },
                    {
                        value: 3,
                        text: "Order Clerk"
                    }
                ],
                nameRules: [
                    v => !!v || 'Field is required',
                    v => (v && v.length <= 40) || 'Name must be less than 40 characters'
                ],
            }
        },
        components: {
            YesNoModal
        },
        methods: {
            removeLine() {
                let self = this;

                self.$refs.yesNo.show('Delete this line?', goThrough => {
                    if (goThrough) {

                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.delete(process.env.VUE_APP_API +
                                `Event_Sheet_Resource/?id=${self.params.data.id}`)
                            .then(result => {
                                delete Axios.defaults.headers.common["TenantID"];

                                self.params.api.updateRowData({
                                    remove: [self.params.data]
                                })

                                console.log("Result" + result);
                            })
                            .catch(error => {
                                alert("Failed to delete : " + item.Title + error);
                            })
                    }
                })
            },
            openEdit(item) {
                let self = this;
                self.EditDialog = true;
                self.editForm = item.data;
            },
            saveForm(item) {
                let self = this;
                let tmp = item.data
                let node = item.node

                tmp = self.editForm;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.put(process.env.VUE_APP_API + `Event_Sheet_Resource`, self.editForm)
                    .then(r => {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        node.setData(tmp)
                        self.EditDialog = false;
                    })
            },

        }
    }
</script>