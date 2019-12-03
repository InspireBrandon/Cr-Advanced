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
        'H4sIAAAAAAAEACWWtc7GDHaE7-VvHclMkbYwM7M7M9NrdpR7z5fdfoqjRzNz5n_-sbN3XLLyn__-B_XMAoifTtgD0Oj4rYsyQIztIgjrNaHV0HWxjquJqg0Hf_GLQbTZWQTNEN22WpsK_JmlcI64zjISYWyAdVAQNpbcl0M6IfkZI69jq10sp2Ql9rYUdvpJhRP4ZODgTkYCGaBYkwH046JhZwvBV2Og0hzj5NJI1eiDxZEHCA8Pp-DukQxLxbnoq394JeqgZOtaBd0J-OQywkPEzLssFamqGkKReSJG3TjfYRNTM2ABwuyjd5ScL28YHnQxi6HIMTqaoAbjYJYekK2ZMuqrRPvjy3gtN0c6gKHQoOpuk7ZVIZSNH136kuBFs108mqm-aiBGpAjQzoChxdu9-cFe0R4KbTLsSceZJ38OGg_REAR238F7hJ7P2KEi0lGtH02XucJ0PXgH5Zy0r6wTjW9QGAePxx31kMXqjwqwxWsfYZPDvT7bcjqoI9s8ZUbyM6XU5YIIfctuULVcZKMz54cdtMnbLy09dmdXoZcGqaXJYChnt5kqu04EHv__b5GF6kPyw4WQJb3DZ9EEryTy5QnjpdsO94KlPhq0doPibGLh-asRRKoIuoCJ88fH1gK_wtklK6Dd8i-tFVI6U0UB0S8TOKW5MpDwXyVq-p6kNHxd1wueAmP5skXz7DMNUFWS8kMdP0WhwqvpaKMN1cpgLOTq7Lz-dYBdYb5m8M6oqSnqcIZVIJDkichAF-so49DYE_RRFp8Lv10stavLw-Pehjm1WJDATehH5SIIVDCJOmyD4T3RnfB09O-v2DPj6Q5kvZMIKp72pc6g78PUiMYP5ABfnHfW7o2AaX3rvnElvW7qd3cP59vuz_6gUDMDWSgQLU-FFqNBhrbz0bC29qwucV_3Fz7OkWNHHwKMWEvpPsfmcRKyzJeoUNE-GkzPdd8oH87BrjCFosuVqRo16IfAWJC1Qr6xCGiNwZawi73e6oegWwbfUIqXTAGZ37fA00u_h-4uid9k1FMoAlXHs1jA7ehhy2r6u3Gwhb1hsie_wB3Z6vy6wD0H4fuLEKUYrKVSpZm8p0mBY8B-YINvBHDhAO8AKHH8gX5o--BALQa5pE07I09usCLaWqBs8G7-KLETceSvjbpUanjJnUyFCPlApKoCF-Jl7vYqXuCerO-4PyUq4PBsmA83HPov546oU23OM7Gcyvz7UNoUXNQQ6lFUAXfYyppelgusliTL_VozJWvRi2e8dpsNEN7ukmnuQJQvGsv9VgTDk0862nyErzGbee5x4fp4zKwN0aSWNd0rVMZjh_3Nne5DT_SualY6sHwYDEzpRuaK9bIPw4wfJu4mDuxnGpJZsKGVfsoO7jJ3bGuBca3YYVGmrm7pb8eEDs7UWM5wqnc3rVE2MsUOOdQsYYXjZBVuIrGLCRZzkIzkwFeNek5Tr8On7Vac3YqQFWdVMJlIowBaxvAeRFHTrhxUcynNqBxRbWDtpHQpWBrsv3ajGg239KWEm6lYqEtcj1n-3NtxDIWWQYxd6yCcXLOyDU8AST_Yn0-mopEHWrY1-5tmCE9A-PGslYP0YMsXn28sxzOEqDHjfHrBV7KjOuTw5vp1S6gl2ebVSyolRkT9dGtNZMVUA0Mit5acpguA2sTEGxGPuPZLIdJ0kTuHgBPzg2AAumqq4ceLjGYZt69_hUL7Ck_aKqc6fwrxgMRDvp0lbRbS2fGb38CQzO7BWDxrZZO7fMYHIr0bmarJ1Y7J2RbY6lNUhz285b_KkJrrMvmPsStBHL12ZdeOvNZc1eZMtU2LKfrE-EKItDceKila1iL5DWidqxJf1ZP2J9JVjkItU_HAR-3IyMoWEQUgNHvJzQvTg2_BO5mq8eVAC8VTerM6C1tPY7Go3Y3MYxMFHNeL5OLBHwxZpx7XEln92sGRYxp4u7Sq8GrbJOrytYizqmu5nTy7gtjNUDH3MbgzwuDb8yf9-026jgaH5PUvnJPHMSdC3f1-OAMBz3ipiJUN0KojCs1vtNpsJ0MS53vT_m1vaTFnSBA1jvWevprfGgCukvZmaf1nuFTa3dwLb5MvUTOmhjaTT0iZy7h767vyb-rCpPdWoTWeme705mQqR9_zu9k4CwwO8E0M6eup_VKjNfhuWLFRO51VUsGR2k2Z7Xs_vfwHA_oNVUt8aL7hgb3QAojxSi7ZDyaHBAMyEi_JAmP1lEUb-ziiw5Eka1Bn2NV9oPe56adi0tZFqTIqiVdD6LRDhVPzdDoxgtXZcarjMUPf-8TwOV2TbUDxr3_-6x_u967HolXv33TBqMPemGIuQO_AJo8PILlzVsx7IUab1c8m13o2vgRXidV0lMZJ1OpJY-GvTvdbn88GtUCgXp-xqkXmLwjqh7FGFDkJgYSwxwhNowAT1EhdW1z-QEWWmXY-4G0RBRnGe52rZ7iEDYkQEPHgyPy2M9sHvDUP9ZaJtKvjve4xIM2AQ4Njv4qbfJqS9aJC-VF9JNh9QmLTITEB7EUPV9gBRy2Svx9v-2ET6FUdrXbzMh4rO5jUy6zg9ILchgxWEQD6Le1fkuU_34IbrPPqQJbiROm7oJBeCXbXSPPoch-4xI8i_EqOoOaczbKE0BeK1LSrsxumkC2kAlJ1jnyk71duziYqKTj_-jfmd22rnxL-UfYcNHs83RD2E4xQjrq125b-o_K6Zs6O81f9yaR1E-TkQkPhrZa1O97BSldHVVxLc70oiSUiw5QOM5ytQKG4_1moAEJjxLgLakEDz7ZNVrCvn_OLuhA5qRM1XvIcjvDVLdpClRoLwJUjP933IogF28h_OTsmT5ivSiXxADfsUQh2jps9zDmcn9YGGrY7zn7jqoi_aRIJhVse8-KJ9AtsnOXzXT35vfbsPQPomqI7-Y0xN7URWsmw7mNpdD9fqxGUFtsnj6SPQDgsmf-tfSEywFvLhPwRLjpjcXAQ6cfbjo0iOjnLGR_IXhV7NyL7KSjBBi1vbLii52CKg74A-5pgExglelE8Dgmim5p1TuO-jwXM6WFokYrp0uFz-pEyf5j_9_8A012MDK4LAAA='

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