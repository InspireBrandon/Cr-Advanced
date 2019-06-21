<template>
    <div style="display: flex;">
        <div style="width: 50%;">Placeholder value</div>
        <div style="width: 50%;">
            <a style="float: right;" @click.prevent="openPeriodReport" href="#">report</a>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            openPeriodReport() {
                let self = this;
                console.log(self.params);
                alert("Open Store Sales Report");
            }
        }
    }
</script>