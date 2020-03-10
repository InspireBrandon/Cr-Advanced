<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 64px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
            :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
            :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
    </div>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    import Axios from 'axios';

    let users = [];

    export default {
        components: {
            AgGridVue
        },
        props: ['rowData'],
        mounted() {
            let self = this;
            self.getUsers();
        },
        data() {
            return {
                gridOptions: {
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                    components: {
                        user1CellRenderer: User1CellRenderer,
                        user2CellRenderer: User2CellRenderer
                    }
                },
                defaultColDef: {
                    onCellValueChanged: this.updateLine
                },
                headers: [],
                users: [],
                userIDs: []
            }
        },
        methods: {
            getUsers(callback) {
                let self = this

                self.userIDs = [];

                Axios.get(process.env.VUE_APP_API + `SystemUser`).then(r => {
                    self.users = r.data
                    users = r.data;

                    self.users.forEach(user => {
                        self.userIDs.push(user.systemUserID);
                    });

                    self.setHeaders();
                })
            },
            setHeaders() {
                let self = this;

                self.headers = [{
                    headerName: 'Department',
                    field: 'department'
                }, {
                    headerName: 'Type',
                    field: 'project_Type'
                }, {
                    headerName: 'User 1',
                    field: 'userID_1',
                    editable: true,
                    cellRenderer: 'user1CellRenderer',
                    cellEditor: "agRichSelectCellEditor",
                    cellEditorParams: {
                        cellRenderer: 'user1CellRenderer',
                        values: self.userIDs
                    },
                }, {
                    headerName: 'User 2',
                    field: 'userID_2',
                    editable: true,
                    cellRenderer: 'user2CellRenderer',
                    cellEditor: "agRichSelectCellEditor",
                    cellEditorParams: {
                        cellRenderer: 'user2CellRenderer',
                        values: self.userIDs
                    },
                }];
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
            },
            updateLine(line) {
                let self = this;
                
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectUsers`, line.data)
                    .then(r => {
                    })
                    .catch(e => {

                    })
            }
        }
    }

    function User1CellRenderer(params) {
        let userName = "";

        if (params.data != undefined) {
            users.forEach(user => {
                if (user.systemUserID == params.data.userID_1) {
                    userName = user.firstname + " " + user.lastname;
                }
            })
        } else {
            users.forEach(user => {
                if (user.systemUserID == params.value) {
                    userName = user.firstname + " " + user.lastname;
                }
            })
        }

        return userName;
    }

    function User2CellRenderer(params) {
        let userName = "";

        if (params.data != undefined) {
            users.forEach(user => {
                if (user.systemUserID == params.data.userID_2) {
                    userName = user.firstname + " " + user.lastname;
                }
            })
        } else {
            users.forEach(user => {
                if (user.systemUserID == params.value) {
                    userName = user.firstname + " " + user.lastname;
                }
            })
        }

        return userName;
    }
</script>