<template>
    <table style="width: 100%;">
        <thead>
            <th style="min-width: 130px;">Name</th>
            <th>Modules</th>
            <th>Height</th>
            <th>Default</th>
        </thead>
        <tbody>
            <tr v-for="(item, idx) in fixture_types" :key="idx">
                <td>{{ item.displayName }}</td>
                <td>
                    <input v-model="item.modules" style="width: 100%;" type="number">
                </td>
                <td>
                    <input v-model="item.height" style="width: 100%;" type="number">
                </td>
                <td>
                    <v-icon>{{ item.isDefault ? 'check' : 'close' }}</v-icon>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                fixture_types: []
            }
        },
        computed: {
            totalModules() {
                let self = this;
                let total = 0;

                self.fixture_types.forEach(element => {
                    total += parseInt(element.modules);
                });

                if(isNaN(total))
                    return 0;
                else 
                    return total;
            }
        },
        methods: {
            getFixtureTypes() {
                let self = this;
            },
            getStorePlanogramModules(store_planogram_id) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Store_Planogram_Fixture?store_Planogram_ID=' + store_planogram_id)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        self.fixture_types = [];

                        r.data.store_Planogram_FixtureList.forEach(element => {
                            if (element.modules > 0)
                                self.fixture_types.push(element)
                        });

                        console.log(self.fixture_types);
                    })
            },
            getFixtureData() {
                let self = this;
                let def = null;

                self.fixture_types.forEach(el => {
                    if(el.isDefault)
                        def = el;
                })

                return { fixture_types: self.fixture_types, totalModules: self.totalModules, height: def.height };
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
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>