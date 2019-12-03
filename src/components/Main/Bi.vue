<template>
    <div>
        <v-toolbar dark flat dense>
            <v-toolbar-items>
                <v-select label="Store Numbers" @change="applyReportFilters" multiple :items="storeNumbers"
                    v-model="selectedStoreNumbers"></v-select>
            </v-toolbar-items>
        </v-toolbar>
        <!-- <iframe width="100%" style="height: calc(100vh - 65px);" src="https://app.powerbi.com/view?r=eyJrIjoiMTg0Y2ZjNDQtNjJmMS00MDFhLWI5MzctMDI0MDljNDZkOTI3IiwidCI6ImY2NzU3NzFmLWQ3ZWItNDgxNC04OTkzLWI5MDg2OTcwMTQ1ZSJ9" frameborder="0" allowFullScreen="true"></iframe> -->
        <div ref="reportContainer" id="reportContainer" style="width: 100%; height: calc(100vh - 128px);"></div>
    </div>
</template>

<script>
    import * as pbi from 'powerbi-client';
    import * as models from 'powerbi-models';

    import Axios from 'axios';

    const accessToken =
        'H4sIAAAAAAAEACVWNa7FCpbcy089kplG6sDMjNeZmZndmr3PU3dewVHVKfj3P3b6DnNa_PO__yyvFLu2zCQAxiazUxvPQW5pJn3HHBwP24wVUNMbNSDGM7J6wBP80cavjrForVYxq3tzYP30h8RgK67HhJ5Se-Aokqq3zU-7AReRVwSaLjEaHyC3hGM1wnABPdd-FHUin78vi-pYsflB5cx-I5zoho1P56Kd47QHNmQcw1X06v3103WvTaaD3n2jj59UbayfZ6jxIIN98UdkpgPldlejhFB9CQY4i7POdaAZQ4YpR77dLfXQF__2BcdjmHHudokvPhuikw98A_vlYAOmywNBeP1x4W8WXxu_qhKRWw6jZmbQzVuQ9lfK8neDvIrfdc9SCwdoHDmqZ1n3z_IX9JXJnizGtxfDBCHCQmlh2x9B8hzph5azbajVOyTLQ7GA9KFFTeivucIMj7fJkHJ8NWNFFP3p4afYU4HjHim3VURN_G0OWmIVupvavuIOXSka7KBXaQSg517Wd4IBlwtO85RZc0NFD6va6pZNkRzGD--T84HM-GUVgaVIH77dgAKCrCLmruqkXeHL6Ct4amPUlVpbDQ1jylsCn1oeBZpmunO9PnUiuWMBrwuywymeWxFJX8qJBAVWZrGpJ8BETHlfPHR49HPqyrKOOnKp4hN8fiONTy56EVS2Cyo-mkx2RbJMGLYS0zRrmt1ApEiUM6vdHNri2n_jB-G_vPdlWiS9SFVmw99AVGClhEgZDNy70s_3A5Tp_aRG2FhoXsdHwcibV-SyX6Mv8MUYFhuAwTk5w7h9h2_TSRYpA9h8Yvp-OFxiS0RnLwN1TtERgIc9a5mXMBftatU17C2qtRv-PnQqb1JXk8zdjhUluowr6aiXUMw1tMY1iN8XXWsLjvdgt7MuXaIsJwk8wpL2SIkhgqKf3Fti9nzPovw0-OLpxWXR1WPPuevd5mhPAhAyfrk1CcVPIdYYVZGOls3vkojJFvIt_uCscIo8PwPamSZvk-QFc4E3bB3eixJiyIWXaK8fdB7RstRfSwzAq2VFpp8zoBb6gxs22g5n9Htb02SwfCQef3tiKAoEwskMeU7XNduMikPS0pTz5iuWhV_ddEuvcolBJBwotM8jpyACzBNBT9sPIMWjWWmEEdf3u-7cafgJw8YuXblI1aflMhaQ1_WoR4T5XAMpOpHfNyb4QrTt1h3mSCG4nRRvq5T-iI2TXs3XNmLJOZxlnjopv8LFWzoRxYfFvnnnp3ae5phv8g0lX792mmu9PoP8WH6oEkIkDWCyt70EosACGNBfDllqi07qkZwI15XBF_U5oMSG8XEGM692E6_L96b9y4wbNTa5vBPXDCa_EUkITAR1fiJtopCcpkFiszVFBdhHzHD_zzbPTwQJObfVrbKicrF9r2VksfWABWBPTS6cXypRSuuzcsHz_kuVRRMRdt0Jc8QFFW-p6p-1c9HBMYpGV96XlGOKcyGtHLpxTqgRDYGpI0KqMxR51MLdVZzmeYQB08JwiWbwQP-jxJKi8n2hpJYmLCB96naurNQLAHmq6MdwuSRoZPmUQquB2djy6FCDOpkysIDCBwGZl9B2faXG-ouqWHqc3-pYqlEU7M-5eM6QnMgi-H6ndP6NmLMX0L5Xy-dVuE2y7As7l_hyfyViRD4h3xxx1NufWHDUxinVYtzFXhT7F0Ya9LCs8IhvdFhizLO40P0IAfn147xk3YIyEYNA3PC-NmMpLN4B5My0ap4Dx4BiWabf68V3XhZeUYAMWfZlpAyuJNujt9yjPKzkSZdgArjmTq-_8wzoFkvebPvdCNbNA1Ut0Ei4WrOg7JT0KCEa8WTa-xXcBNXEVtyFL4Bgn1B5MAr90h9DfcQdINt8yLoRYLpQiYfoPuPyuV_mdfwEWbWVdpHXljyfLIn2AyexN7z88Vc5tJh73woxG8JUq8lbgGRzrBpQR7pN45BRmVs3XAocPRJAnPNoj811oEBIYbmi-sn-Pr0AupJgLeotKRL-XIrdvawKirttVxF6hyk4H-oFXNauAaK7NR_4TTAm3u-X4HpOiZIUuIS9dETzEot_2o8KFCIoXvo7etD0L8_doX0R8ukhy9OQH4wddAsHuQVSHjVpT-nuUPOdDJdAjDfdJQR9ULfbmdmvgOh4chVS1QUkhIZPtfpddoM60RS8ydyYLj-uRzU05qDevtx8B1fZBwsuDhG7hmKFBkHvecz7IzpF4AJRT5htpAhno1qEqA8nqr8jgDNGtX8AuBaFllZ4f99dhW68jZZVnBXyS_36I_N__fM__3DbuxyzVr5_0yVBJRCXadyxT1S9GzOI-qwDODBrylP7xMc0N8Oz70LWHY-XnOoMxfrLIc8lk9EhUF0ZuRBV2EPmHYs-pWFTZZWdSYkewUwTkkVjokrE0GbnTfSjEG694qDgEBjX78J3BY1mLxjsB7yB79W_qr6AvHCcNC3PZXCDc69On9Wp9kP_HismBC062vct9dFWvv7LMo4mOXIhPcO3IZlglW43SJLg3S69UsufOx3hhKakd0HOuBYCftkII3zvJlm37ooPvFwsr-ixL2N5Xwkqb6armJF05S8BslLu7wRWTE_L2SZO8loInDSf6gm40NBR31Uf8rBk9uyPLBWMZlrg66orOj7n_td_aH6XptyU8I_l0oCfUo2nEWCv8O4m-zPM478or62n9Di38g8WiWYTsEl8J2X1BRLF8wz5wLpd_3W8xDeOGEFdQxChrBSwPh_81mMB3yjh28mCMgaOfp2yd1YwDm2h7pkh-U3uAXabdxcKEjAbhUnur3hAExunv6rYti3f0ze5ysjAGPRb6QgbHOKngUNeByqAVWFrIoSPkVdOJ9QG_R3WLRaNEg76Aps345OKitye7hPJ4bmov2LPg4AnPymms-nNw6MGIagyqriP2dKCZhvXfvzMLUteLJ11HVwK4dHHMbG32UCti5fMbcA8kItC5SU9JCYsWOlmUXXeb9X6VWnnb-Su84sYBuopyFqs3UbtN6xx2MoK1Pbo64DsHoXz-OxWvaakV_Ufzf_3_301eFiuCwAA'

    export default {
        data() {
            return {
                report: null,
                storeNumbers: [1, 2, 3, 4, 5, 6, 7],
                selectedStoreNumbers: []
            }
        },
        mounted() {
            let self = this;
            self.generateReport();
        },
        methods: {
            generateReport() {
                let self = this;

                // const basicFilter = {
                //     $schema: "http://powerbi.com/product/schema#relativeDate",
                //     target: {
                //         table: "Store",
                //         column: "StoreNumber"
                //     },
                //     operator: "In",
                //     values: [3, 4, 5],
                //     filterType: models.FilterType.Basic,
                //     requiresSingleSelect: true // Limits selection of values to one.
                // }

                var config = {
                    type: 'report',
                    id: '67b11930-d835-486a-a6aa-9134479b6696',
                    embedUrl: 'https://app.powerbi.com/reportEmbed',
                    tokenType: 1,
                    accessToken: accessToken,
                    settings: {
                        filterPaneEnabled: false,
                        navContentPaneEnabled: false
                    }
                }

                var container = self.$refs.reportContainer;
                self.report = powerbi.embed(container, config);

                self.report.on('loaded', function (event) {
                    self.getFilters();
                })

                self.getFilters();
            },
            getFilters() {
                let self = this;

                console.log("GETTING FILTERS");

                self.report.getFilters()
                    .then(filters => {
                        console.log("GOT FILTERS");
                        console.log(filters);
                    })
            },
            applyReportFilters() {
                let self = this;

                self.$nextTick(() => {
                    if (self.selectedStoreNumbers.length == 0) {
                        self.report.removeFilters();
                    } else {
                        const basicFilter = {
                            $schema: "http://powerbi.com/product/schema#relativeDate",
                            target: {
                                table: "Store",
                                column: "StoreNumber"
                            },
                            operator: "In",
                            values: self.selectedStoreNumbers,
                            filterType: models.FilterType.Basic,
                            requiresSingleSelect: true // Limits selection of values to one.
                        }

                        self.report.setFilters([basicFilter])
                            .catch(errors => {
                                // Handle error
                            });
                    }
                })
            }
        }
    }
</script>