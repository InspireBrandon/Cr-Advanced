<template>
    <div>
        {{ resourceTypeItems[params.data.resourceType] }}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                resourceTypeItems: ["Retail Buyer", "Retail Stock Planner", "Buyer Assistant", "Order Clerk"]
            }
        }
    }
</script>