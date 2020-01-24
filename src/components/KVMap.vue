<template>
    <div>
        <v-row
                v-for="(row, rowIndex) in kvArray"
                :key="'kvRow' + rowIndex"
                align="center"
                justify="center"
        >
            <v-tooltip
                    top v-for="(square, columnIndex) in row"
                    :key="'kvRow' + rowIndex + columnIndex"
            >
                <template v-slot:activator="{ on }">
                    <div
                            :class="{'square-filled': kvArray[rowIndex][columnIndex].isColored}"
                            :style="squareStyle"
                            class="square"
                            v-on="on"
                    ></div>
                </template>
                <span>{{ getKVSquareTooltipMessage(rowIndex, columnIndex) }}</span>
            </v-tooltip>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'KVMap',
        props: {
            kvArray: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                height: window.innerHeight - 180,
                width: window.innerWidth
            };
        },
        computed: {
            squareStyle() {
                const kvMapSideLength = this.kvArray[0].length;
                if (kvMapSideLength === 0) {
                    return;
                }
                const maxSquareSize = 50;
                const smallerSize = this.width < this.height ? this.width : this.height;
                let squareSize = smallerSize / kvMapSideLength;
                squareSize = squareSize < maxSquareSize ? squareSize : maxSquareSize;


                const margin = squareSize < 24 ? 1 : 4;
                const bottomAndTopMargin = margin * 2;

                return {
                    height: squareSize - bottomAndTopMargin + 'px',
                    width: squareSize - bottomAndTopMargin + 'px',
                    margin: margin + 'px'
                };
            }
        },
        methods: {
            getKVSquareTooltipMessage(rowIndex, columnIndex) {
                const square = this.kvArray[rowIndex][columnIndex];
                let CNF = '';
                for (let i = 0; i < square.coveredBy.length; i++) {
                    const { name, isNegated } = square.coveredBy[i];
                    if (i !== 0) {
                        CNF += '  ∧  ';
                    }
                    CNF += isNegated ? `¬ ${name}` : name;
                }
                return CNF;
            },
        }
    };
</script>

<style lang="css">
    .square {
        border: 1px solid #9FA8DA !important;
    }

    .square-filled {
        background-color: #81D4FA;
    }
</style>
