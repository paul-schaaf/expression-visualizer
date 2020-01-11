<template>
    <v-app>
        <v-app-bar
                app
                color="primary"
                dark
        >
            <v-spacer/>
            <v-text-field v-model="expression" class="ma-0" placeholder="Expression goes here!" clearable/>
            <v-btn text large @click="onDrawButtonClick">Draw KV Map</v-btn>
            <v-spacer/>
        </v-app-bar>
        <v-content>
            <v-container>
                <p v-if="error" class="text-center">{{error}}</p>
                <v-row
                        v-for="(row, rowIndex) in kvData"
                        :key="'kvRow' + rowIndex"
                        align="center"
                        justify="center"
                >
                    <div
                            v-for="(square, columnIndex) in row"
                            :key="'kvRow' + rowIndex + columnIndex"
                            class="ma-1 square"
                            :class="{'square-filled': kvData[rowIndex][columnIndex]}"
                    ></div>
                </v-row>

            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import getKVArray from './KVCalculation';

    export default {
        name: 'App',
        data() {
            return {
                kvData: [],
                expression: '',
                error: null
            };
        },
        created() {
            window.addEventListener('keypress', (e) =>  {
                if (e.key === 'Enter') {
                    this.onDrawButtonClick();
                }
            });
        },
        methods: {
            onDrawButtonClick() {
                this.error = null;
                this.kvData = [];
                try {
                    this.kvData = getKVArray(this.expression);
                } catch(err) {
                    this.error = err;
                }
            },
        }
    };
</script>

<style lang="css">
    .square {
        height: 20px;
        width: 20px;
        border: 1px solid #9FA8DA !important
    }

    .square-filled {
        background: #81D4FA;
    }

    .v-input__slot {
        margin: 0 !important;
    }
</style>
