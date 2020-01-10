<template>
    <v-app>
        <v-app-bar
                app
                color="primary"
                dark
        >
            <v-spacer/>
            <v-text-field placeholder="Expression goes here!"/>
            <v-btn text large>Draw KV Map</v-btn>
            <v-spacer/>
        </v-app-bar>
        <v-content>
            <v-container>
                <v-row
                        v-for="(row, rowIndex) in kvData"
                        :key="'kvRow' + rowIndex"
                        align="center"
                        justify="center"
                >
                    <v-sheet
                            v-for="(square, columnIndex) in row"
                            :key="'kvRow' + rowIndex + columnIndex"
                            :class="{'invisible': !kvData[rowIndex][columnIndex]}"
                            color="light-blue lighten-3"
                            height="20"
                            width="20"
                            tile
                            class="ma-1"
                    />
                </v-row>

            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                kvData: [[true, true, false, true], [true, false, true, true]]
            };
        }
    };
</script>

<style lang="css">
    .invisible {
        opacity: 0
    }
</style>
