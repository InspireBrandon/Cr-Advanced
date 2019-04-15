<template>
    <div>
        <div v-if="data.Type == 'GONDOLA'">
            <v-toolbar dense flat dark>{{ data.Data.Data.name }}</v-toolbar>
        </div>
        <div class="header-item"
            :style="{ 'background': childdark == true ? 'lightgrey':'white', 'border': data.Type != 'GONDOLA' ? '1px solid black': 'none' }">
            <div v-if="data.Type != 'GONDOLA'">
                {{ data.Data.Data.name }}
            </div>
            <item v-for="(item, index) in data.children" :childdark="!childdark" :key="index" :data="item">
            </item>
        </div>
        <!-- <table>
            <thead>
                <tr>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ data.Data.Data.name }}</td>
                </tr>
                <tr>
                    <td>
                        <div>
                            <item v-for="(item, index) in data.children" :childdark="!childdark" :key="index"
                                :data="item">
                            </item>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table> -->
    </div>
</template>

<script>
    export default {
        name: 'item',
        props: ['data', 'childdark']
    }
</script>

<style scoped>
    .header-item {
        padding: 0px 10px;
        padding-bottom: 8px;
        margin-top: 5px;
    }

    table {
        border-collapse: collapse;
        width: 100%;
    }

    th {
        background: rgb(85, 85, 85);
        color: white;
    }

    table,
    th,
    td {
        padding: 5px;
        border: 1px solid;
    }

    @media print {

        #Header,
        #Footer {
            display: none !important;
        }
    }

    @media print {
        body {
            overflow: auto;
            height: auto;
        }

        .scroll-y {
            height: auto;
            overflow: visible;
        }
    }

    .print-break-page {
        page-break-after: always;
    }
</style>