<template>
    <div>
        <v-tooltip bottom v-if="params.data.notes != null">
            <template v-slot:activator="{ on }">
                <v-icon v-on="on" @click="params.context.componentParent.openNotes(params.data.notes)">note</v-icon>
            </template>
            <span>{{ params.data.notes }}</span>
        </v-tooltip>
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