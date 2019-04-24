<template>
    <div>
        <div v-if="data.Type == 'GONDOLA' || data.Type == 'PALLETE'">
            <v-toolbar dense flat dark><b>{{ data.Type + " " + data.Position + " - " }}</b> {{ data.Data.Data.name }}</v-toolbar>
        </div>
        <div class="header-item"
            :style="{ 'background': childdark == true ? 'lightgrey':'white', 'border': data.Type != 'GONDOLA' ? '1px solid black': 'none' }">
            <div v-if="data.Type != 'PRODUCT'">
                <b>{{ data.Type + " " + data.Position + " - " }}</b> {{ data.Data.Data.name }}
            </div>
            <div v-else>
                {{  data.Data.Data.name + " Position:" + data.Position }}
            </div>
            <item v-for="(item, index) in data.children" :childdark="!childdark" :key="index" :data="item">
            </item>
        </div>
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