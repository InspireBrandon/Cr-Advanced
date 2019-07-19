<template>
    <div>
        {{params.data.modules}}
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon flat small color="success" class="ma-0">
                        <v-icon>edit</v-icon>
                    </v-btn>
                </template>
                <span>edit</span>
            </v-tooltip>
    </div>

</template>
<script>
export default {
    

}
</script>

