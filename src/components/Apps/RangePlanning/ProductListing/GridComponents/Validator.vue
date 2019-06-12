<template>
    <div style="overflow: hidden;" :style="{ 'color': valid? 'black' : 'red' }">
        <v-tooltip v-if="!valid" bottom>
            <template v-slot:activator="{ on }">
                <div v-on="on">{{ (params.value == undefined || params.value == null || params.value == "") ? errorText : params.value }}</div>
            </template>
            <span>{{ errorText }}</span>
        </v-tooltip>
        <div>{{ params.value }}</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                valid: true,
                errorText: ""
            }
        },
        methods: {
            validate() {
                let self = this;

                switch (self.params.colDef.headerName.toUpperCase()) {
                    case "PRODUCT SYSTEM ID": {
                        if (self.params.value == undefined || self.params.value == null || self.params.value == "") {
                            self.valid = false;
                            self.errorText = "Field requires a value";
                        }
                    }
                    break;
                    case "BARCODE": {
                        if (self.params.value == undefined || self.params.value == null || self.params.value == "") {
                            self.valid = false;
                            self.errorText = "Field requires a value";
                        }
                    }
                    break;
                    case "DESCRIPTION": {
                        if (self.params.value == undefined || self.params.value == null || self.params.value == "") {
                            self.valid = false;
                            self.errorText = "Field requires a value";
                        }
                    }
                    break;
                }
            }
        },
        created() {
            let self = this;
            self.validate();
        }
    }
</script>