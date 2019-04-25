<template>
    <div>
        <div v-if="data.Type == 'GONDOLA' || data.Type == 'PALLETE' && data.Type!='PRODUCT'">
            <v-toolbar dense flat dark><b>{{ data.Type + " " + data.Position + " - " }}</b> {{ data.Data.Data.name }}
            </v-toolbar>
        </div>
        <div v-if="data.Type!='PRODUCT'" class="header-item"
            :style="{ 'background': childdark == true ? 'lightgrey':'white', 'border': data.Type != 'GONDOLA' ? '1px solid black': 'none' }">
            <div v-if="data.Type != 'PRODUCT'">
                <b>{{ data.Type + " " + data.Position + " - " }}</b> {{ data.Data.Data.name }}
            </div>

            <div v-if="data.Type !='PRODUCT'">
                <item v-for="(item, index) in data.children" :childdark="!childdark" :key="index" :data="item">
                </item>
            </div>
            <div v-if="data.Type != 'GONDOLA' " style="background: white">
                <table>
                    <tr>
                        <th>Position</th>
                        <th>Product Code</th>
                        <th>Barcode</th>
                        <th>Description </th>


                        <th>X Facings</th>
                        <th>Y Facings</th>
                        <th>Z Facings</th>
                        <th>Caps</th>
                        <th>Orientation</th>
                        <th>Total Facings</th>
                    </tr>
                    <tr v-for="(product,index) in products" :key="index">
                        <td>{{product.Position}}</td>
                        <td style="text-align: right;">{{product.Data.Data.product_Code}}</td>
                        <td style="width:10% ;text-align: right">{{ product.Data.Data.barcode }}</td>
                        <td style="width:30%">
                            {{  product.Data.Data.name }}
                        </td>
                        <!-- <td>{{ item.name }}</td> -->


                        <td style="text-align: right;">{{ product.Data.Facings.x  }}</td>
                        <td style="text-align: right;">{{ product.Data.Facings.y }}</td>
                        <td style="text-align: right;">{{ product.Data.Facings.z }}</td>
                        <td style="text-align: right;">{{ product.Data.Caps.Caps_Count }}</td>
                        <td style="text-align: left;">{{ product.Data.Orientation.LastFace }}</td>
                        <td style="text-align: right;">
                            {{ (product.Data.Facings.x*product.Data.Facings.y*product.Data.Facings.z) }}</td>
                    </tr>
                </table>

            </div>
            <!-- {{data.Type}} -->
        </div>

        <!-- <h1>Products</h1>
        <div v-for="(product, idx) in products" :key="idx">
            {{ product }}
            <item v-for="(item, index) in data.children" :childdark="!childdark" :key="index" :data="item">
            </item>
        </div>
        <h1>Fixtures</h1>
        <div v-for="(fixture, idx) in fixtures" :key="idx">
            {{ fixture }}
            <item v-for="(item, index) in data.children" :childdark="!childdark" :key="index" :data="item">
            </item>
        </div> -->
    </div>
</template>

<script>
    export default {
        name: 'item',
        props: ['data', 'childdark'],
        created() {
            let self = this;
            self.products = []


            self.data.children.forEach(element => {
                if (element.Type == "PRODUCT") {
                    self.products.push(element)
                } else {
                    self.fixtures.push(element)
                }
            });
        },
        data() {
            return {
                products: [],
                fixtures: [],
            }
        }
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