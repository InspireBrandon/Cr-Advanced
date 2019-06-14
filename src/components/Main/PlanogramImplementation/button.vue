<template>
    <div style="text-align: center; cursor: pointer;">
        <v-btn @click="''" icon flat small color="primary">
            <v-icon>assignment</v-icon>
        </v-btn>
        <v-btn icon @click="''">
            <v-icon>
                more_vert
            </v-icon>
        </v-btn>
    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'

    export default {
        components: {
            YesNoModal
        },
        methods: {}
    }
</script>