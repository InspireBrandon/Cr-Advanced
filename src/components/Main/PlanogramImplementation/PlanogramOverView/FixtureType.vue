<template>
    <div>
        <v-select :items="items" v-model="selected"></v-select>
    </div>
</template>
<script>
export default {
    data(){
        return{
            items:[
                "Standard",
                "Industrial",
                "Supplier Stand",
                "Till point",
                "Custom"
            ],
            selected:null,
        }
    }    
}
</script>

