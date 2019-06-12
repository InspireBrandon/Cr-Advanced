<template>
    <div>
        <v-menu left>
            <v-btn v-if="params.context.componentParent.userAccess != 3" icon slot="activator">
                <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list dense class="pa-0 ma-0">

                <v-list-tile @click="assign(params.data)">
                    <span>Assign</span>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile @click="sendMail(params.data)">
                    <span>Mail</span>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile v-if="params.data.systemFileName != null" @click="assign(params.data)">
                    <span>Variation</span>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile @click="putTaskOnHold(params.data)">
                    <span>Put On Hold</span>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile @click="startSubtask(params.data)">
                    <span>New subtask</span>
                </v-list-tile>
                <v-divider></v-divider>

                <v-list-tile v-if="( params.data.status == 2||params.data.status == 2)&&params.data.actionedByUserID==null"
                    @click="closeTask(params.data)">
                    <span>close</span>
                </v-list-tile>

            </v-list>
        </v-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                systemUserID: -1,
            }
        },
        methods: {},
        created() {
            let self = this;
        }
    }
</script>