<template>
    <div style="display: flex;">
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn @click="$router.push('/SpacePlanning')" class="icon_button" flat icon small>
                    <v-icon color="warning">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn class="icon_button" flat icon small>
                    <v-icon color="success">settings_backup_restore</v-icon>
                </v-btn>
            </template>
            <span>Recall</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn class="icon_button" flat icon small>
                    <v-icon color="error">local_parking</v-icon>
                </v-btn>
            </template>
            <span>Recall</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <div class="btn_grid link">
                    <div class="btn_text">R</div>
                </div>
            </template>
            <span></span>
        </v-tooltip>
                <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <div class="btn_grid link">
                    <div class="btn_text">></div>
                </div>
            </template>
            <span></span>
        </v-tooltip>
    </div>
</template>

<script>
    export default {
        created() {}
    }
</script>

<style scoped>
    .icon_button {
        margin: 1px;
    }

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
        margin-top: 1px;
        text-align: center;
        font-size: 18px;
        width: 20px;
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