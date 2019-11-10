<template>
    <div>
        <img style="max-width: 100%; max-height: 100vh;" :src="imgSrc" alt="">
    </div>
</template>

<script>
export default {
    props: [],
    data() {
        return {
            imgSrc: ""
        }
    },
    mounted() {
        let self = this;
        self.imgSrc = self.$route.params.fileSrc;
    }
}
</script>