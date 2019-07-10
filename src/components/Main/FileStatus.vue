<template>
    <div>
        <v-card>
            <v-card-text>
                <table style="width: 100%;">
                    <thead>
                        <th>Planogram File</th>
                        <th>Current Status</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr v-for="(file, idx) in files" :key="idx">
                            <td>{{ file.name }}</td>
                            <td>{{ file.status }}</td>
                            <td>
                                <a href="#">Set Available</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                files: [],
            }
        },
        created() {
            let self = this;
            self.getFiles();
        },
        methods: {
            getFiles() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "SystemFile/Status?db=CR-DEVINSPIRE")
                    .then(r => {
                        self.files = r.data;
                    })
            }
        }
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
    }

    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
        padding: 2px;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>