<template>
    <div v-if="params.data != undefined" style="display: flex;">
        <!-- <v-btn color="success" icon flat small>
            <v-icon>play_arrow</v-icon>
        </v-btn> -->
        <div class="btn_grid start">
            <div class="btn_text">Start</div>
        </div>
        <div class="btn_grid link">
            <div class="btn_text">Link</div>
        </div>
    </div>
</template>

<script>
    export default {
        created() {
        }
    }
</script>

<style scoped>
    .start {
        background: #ff7200;
        border: 1px solid grey;
        color: white;
    }

    .link {
        background: #fff;
        border: 1px solid blue;
        color: blue;
    }

    .btn_grid {
        height: 20px;
        border-radius: 3px;
        margin-top: 5px;
        text-align: center;
        font-size: 18px;
        width: 55px;
        font-weight: 600;
        margin: 8px 3px;
    }

    .start:hover {
        background: #c75a00;
        cursor: pointer;
    }

    .link:hover {
        background: rgb(235, 235, 235);
        cursor: pointer;
    }

    .btn_text {
        margin-top: -5px;
    }
</style>