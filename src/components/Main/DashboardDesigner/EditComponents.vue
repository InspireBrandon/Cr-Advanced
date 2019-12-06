<template>
    <v-card height="250px">
        <v-card-text>
            {{props}}
        </v-card-text>
    </v-card>
</template>
<script>
    export default {
        props: ["props"],
        data() {
            return {

            }
        }

    }
</script>