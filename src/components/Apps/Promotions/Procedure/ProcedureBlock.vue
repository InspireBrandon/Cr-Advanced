<template>
    <div>
        <div style="display: table; width: 100%;">
            <div style="display: table-cell;">
                <div style="display: flex; cursor: pointer;" @click="collapsed = !collapsed">
                    <v-icon>{{ collapsed ? 'arrow_right' : 'arrow_drop_down' }}</v-icon>
                    <h4 class="font-weight-light" style="margin-top: 2px;">Procedure {{ index }}
                    </h4>
                </div>
            </div>
            <div style="display: table-cell; text-align: right;">
                <v-btn small color="primary" text class="ma-0 mb-2" flat @click="addStep">Add step</v-btn>
                <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn small v-on="on" color="primary" text class="ma-0 mb-2 ml-2" flat>More</v-btn>
                    </template>
                    <v-list dense>
                        <v-list-tile>
                            <v-list-tile-title>Rename</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Save as template</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
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
                            <input style="width: 100%;" type="text">
                        </td>
                        <td style="width: 100px;">
                            <input v-model="step.dueDate" type="date">
                        </td>
                        <td style="width: 200px; cursor: pointer;">
                            <select name="" id="" style="width: 100%;">
                                <option value="">Pending</option>
                                <option value="">In Progress</option>
                                <option value="">Complete</option>
                            </select>
                        </td>
                        <td style="width: 300px;">
                            <UserSelector />
                        </td>
                        <td style="width: 60px; text-align: center;">
                            <a href="#" @click.prevent="removeStep(idx)">remove</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <v-divider></v-divider>
        </div>
    </div>
</template>

<script>
    import UserSelector from './UserSelector.vue'

    export default {
        components: { UserSelector },
        props: ['index'],
        data() {
            return {
                collapsed: false,
                steps: []
            }
        },
        methods: {
            addStep() {
                let self = this;
                self.steps.push(new step(null));
            },
            removeStep(idx) {
                let self = this;
                self.steps.splice(idx, 1);
            }
        }
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

        if(data != null) {
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