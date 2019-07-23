<template>
    <div style="display: flex;">
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn @click="$router.push('/SpacePlanning')" class="icon_button" flat icon small>
                    <v-icon color="warning">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn class="icon_button" flat icon small>
                    <v-icon color="success">settings_backup_restore</v-icon>
                </v-btn>
            </template>
            <span>Recall</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn class="icon_button" flat icon small>
                    <v-icon color="error">local_parking</v-icon>
                </v-btn>
            </template>
            <span>Recall</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <div class="btn_grid link">
                    <div class="btn_text">R</div>
                </div>
            </template>
            <span></span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <div class="btn_grid link">
                    <div class="btn_text">></div>
                </div>
            </template>
            <span></span>
        </v-tooltip>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        props: ['params'],
        created() {},
        methods: {
            createProjectTransactionGroup(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTXGroup`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    callback(r.data.projectTXGroup);
                })
            },
            createProjectTransaction(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTX`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    callback(r.data.projectTX)
                })
            },
            setParked(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                let tmpUser = request.systemUserID;

                request.systemUserID = tmpUser;
                request.status = 45;
                request.notes = self.findAndReplaceNote(request.notes);

                self.createProjectTransaction(request, newItem => {
                    self.$parent.$parent.getTaskViewData();
                })
            },
        }
    }
</script>

<style scoped>
    .icon_button {
        margin: 1px;
    }

    .start {
        background: #ff7200;
        border: 1px solid grey;
        color: white;
    }

    .link {
        background: #fff;
        border: 1px solid blue;
        color: blue;
    }

    .btn_grid {
        height: 20px;
        border-radius: 3px;
        margin-top: 1px;
        text-align: center;
        font-size: 18px;
        width: 20px;
        font-weight: 600;
        margin: 8px 3px;
    }

    .start:hover {
        background: #c75a00;
        cursor: pointer;
    }

    .link:hover {
        background: rgb(235, 235, 235);
        cursor: pointer;
    }

    .btn_text {
        margin-top: -5px;
    }
</style>