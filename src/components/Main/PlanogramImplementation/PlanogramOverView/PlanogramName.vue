<template>
    <div>
       <v-tooltip bottom v-if="params.data.requiredInStore!=true &&params.data.fileName!=null">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on"  icon flat small
                    color="error" class="ma-0">
                    <v-icon>remove_circle_outline</v-icon>
                </v-btn>
            </template>
            <span>Remove category from store</span>
        </v-tooltip>
         <v-tooltip bottom v-if="params.data.requiredInStore==true &&params.data.fileName!=null">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on"  icon flat small
                    color="success" class="ma-0">
                    <v-icon>add</v-icon>
                </v-btn>
            </template>
            <span>Add Category to store</span>
        </v-tooltip> {{params.data.fileName}}
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    }
}
</script>

