    <template>
        <div style="ma-0; pa-0;">
            <div v-if="params.data.heightFit==true" style="background-color: rgb(240, 125, 125);ma-0; pa-0;"
                >
                {{params.data.height}}
                {{params.data.heightFit}}
            </div>
            <div v-if="params.data.heightFit==false" style="background-color: #C8E6C9;ma-0; pa-0;"
                >
                {{params.data.height}}
                {{params.data.heightFit}}
            </div>
        </div>

    </template>
    <script>
        export default {
            data() {
                return {

                }
            }
        }
    </script>
    <style>
        .highlightedFalse {
            background-color: rgb(240, 125, 125);
        }

        .highlightedTrue {
            background-color: #C8E6C9;
        }