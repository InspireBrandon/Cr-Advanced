<template>
    <div>
        <td style="width: 2%">
            <v-tooltip bottom v-if="params.data.systemFileName != null">
                <template v-slot:activator="{ on }">
                    <v-icon v-on="on">web</v-icon>
                </template>
                <span>{{ params.data.systemFileName }}</span>
            </v-tooltip>
        </td>
        <td style="width: 2%">
            <v-tooltip bottom v-if="params.data.rangeFileName != null">
                <template v-slot:activator="{ on }">
                    <v-icon v-on="on">assessment</v-icon>
                </template>
                <span>{{ params.data.rangeFileName }}</span>
            </v-tooltip>
        </td>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                systemUserID: -1,
            }
        },
        methods: {},
        created() {
            let self = this;
        }
    }
</script>