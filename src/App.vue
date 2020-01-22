<template>
    <v-app>
        <v-app-bar
                app
                color="primary"
                dark
        >
            <v-spacer/>
            <v-text-field v-model="expression" class="ma-0" placeholder="Expression goes here!" clearable/>
            <v-btn text large @click="triggerMapCreation">Draw KV Map</v-btn>
            <v-spacer/>
            <v-icon v-if="isMobile" @click.stop="onDialogChange(true)">mdi-information-outline</v-icon>
            <info-dialog :show="showInfoDialog" @updated="onDialogChange" @view-example-clicked="viewExample"/>

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
                    <v-tooltip
                            top v-for="(square, columnIndex) in row"
                            :key="'kvRow' + rowIndex + columnIndex"
                    >
                        <template v-slot:activator="{ on }">
                            <div
                                    :class="{'square-filled': kvData[rowIndex][columnIndex].isColored}"
                                    :style="squareStyle"
                                    class="square"
                                    v-on="on"
                            ></div>
                        </template>
                        <span>{{ getKVSquareTooltipMessage(rowIndex, columnIndex) }}</span>
                    </v-tooltip>
                </v-row>
            </v-container>
        </v-content>
        <v-footer padless>
            <v-col
                    class="text-center"
                    cols="12"
            >
                <div class="body-2">🐧 Made by <a href="https://github.com/paul-schaaf">github.com/paul-schaaf</a> 🐧
                </div>
            </v-col>
        </v-footer>
    </v-app>
</template>

<script>
    import getKVArray from './KVCalculation';
    import InfoDialog from './components/InfoDialog';

    export default {
        name: 'App',
        components: { InfoDialog },
        data() {
            return {
                tab: null,
                showInfoDialog: false,
                kvData: [],
                expression: '',
                error: null,
                height: window.innerHeight - 125,
                width: window.innerWidth
            };
        },
        created() {
            window.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.triggerMapCreation();
                }
            });
        },
        computed: {
            isMobile() {
                return this.width < 500;
            },
            squareStyle() {
                const kvMapSideLength = this.kvData[0].length;
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
            triggerMapCreation() {
                this.error = null;
                this.kvData = [];
                try {
                    this.kvData = Object.freeze(getKVArray(this.expression === null ? '' : this.expression));
                } catch (err) {
                    this.error = err;
                }
            },
            getKVSquareTooltipMessage(rowIndex, columnIndex) {
                const square = this.kvData[rowIndex][columnIndex];
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
            viewExample() {
                this.expression = `(p ∧ ((q ∧ ((r ∧ ((x ∧ y ∧ z) ∨ (¬x ∧ (¬y ∨ (y ∧ ¬z)))))∨
(¬r ∧ ((x ∧ ((y ∧ ¬z) ∨ (¬y ∧ z))) ∨ (¬x ∧ ¬y ∧ ¬z))))) ∨ (¬q ∧ ¬r ∧ x ∧ y)))∨
(¬p ∧ ((q ∧ ((r ∧ ((x ∧ ¬y ∧ ¬z) ∨ (¬x ∧ y))) ∨ (¬r ∧ x ∧ ¬y ∧ ¬z)))∨
(¬q ∧ ((r ∧ ¬x ∧ ¬y ∧ z) ∨ (¬r ∧ x ∧ ¬y)))))`;
                this.triggerMapCreation();
                this.showInfoDialog = false;
            },
            onDialogChange(newValue){
                this.showInfoDialog = newValue;
            }
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

    .v-input__slot {
        margin: 0 !important;
    }

    .pointer {
        cursor: pointer
    }
</style>
