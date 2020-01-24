<template>
    <v-app>
        <v-app-bar
                app
                color="primary"
                dark
        >
            <v-spacer/>
            <v-text-field v-model="expression" :class="{'margin-left-150': !isMobile}"
                          placeholder="Expression goes here!" clearable/>
            <v-btn text large @click="triggerMapCreation">{{ isMobile ? 'Eval' : 'Evaluate'}}</v-btn>
            <v-spacer/>
            <v-icon v-if="isMobile" @click.stop="onDialogChange(true)">mdi-information-outline</v-icon>
            <info-dialog :show="showInfoDialog" @updated="onDialogChange" @view-example-clicked="viewExample"/>
            <template v-slot:extension>
                <div class="d-flex justify-center mt-1" style="width: 100%">
                    <v-btn :class="{ 'active-tab': tab === 0, 'inactive-tab': tab !== 0 }" text large tile
                           @click="tab = 0">KV Map
                    </v-btn>
                    <v-btn :class="{ 'active-tab': tab === 1, 'inactive-tab': tab !== 1 }" text large tile
                           @click="tab = 1">Truth Table
                    </v-btn>
                </div>
            </template>
        </v-app-bar>
        <v-content>
            <v-container>
                <p v-if="error" class="text-center">{{error}}</p>
                <k-v-map v-if="tab === 0" :kv-data="kvData.KVArray"/>
                <div v-else class="d-flex justify-center">
                    <div class="d-flex">
                        <div v-for="variable in kvData.variables" :key="variable" class="direction-down">
                            <div class="pl-2">{{ variable }}</div>
                            <hr/>
                            <div
                                    v-for="(number, index) in getNumbersForVariable(variable)"
                                    :key="variable + index"
                                    class="pl-2"
                            >
                                {{ number }}
                            </div>
                        </div>
                    </div>
                    <div class="ml-4 truthtable-right">
                        <div
                                v-for="(token, index) in kvData.expressionArray" :key="token + index"
                                class="direction-down"
                        >
                            <div
                                    class="pl-2"
                            >
                                {{ token }}
                            </div>
                            <hr/>
                            <div
                                    v-for="(number, numberIndex) in getTruthTableNumbers(token)"
                                    :key="'expToken:' + token + index + 'numberIndex:' + numberIndex"
                                    class="pl-2 pointer"
                            >
                                {{ number }}
                            </div>
                        </div>
                    </div>
                </div>
            </v-container>
        </v-content>
        <v-footer padless>
            <v-col
                    class="text-center"
                    cols="12"
            >
                <div class="body-2">
                    🐧 Made by <a href="https://github.com/paul-schaaf">github.com/paul-schaaf</a> 🐧
                </div>
            </v-col>
        </v-footer>
    </v-app>
</template>

<script>
    import getKVData from './KVCalculation';
    import InfoDialog from './components/InfoDialog';
    import KVMap from './components/KVMap';

    function sortBinaryStrings(a, b) {
        if (a === b) {
            return 0;
        }
        return parseInt(a, 2) < parseInt(b, 2) ? -1 : 1;
    }

    let truthTableIndex = 0;

    export default {
        name: 'App',
        components: { KVMap, InfoDialog },
        data() {
            return {
                tab: 0,
                showInfoDialog: false,
                kvData: {},
                expression: '',
                error: null,
                width: window.innerWidth,
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
        },
        methods: {
            setXY(row, column) {
                this.hoveredRow = row;
                this.hoveredColumn = column;
            },
            triggerMapCreation() {
                this.error = null;
                this.kvData = [];
                try {
                    this.kvData = Object.freeze(getKVData(this.expression === null ? '' : this.expression));
                } catch (err) {
                    this.error = err;
                }
            },
            viewExample() {
                this.expression = `(p ∧ ((q ∧ ((r ∧ ((x ∧ y ∧ z) ∨ (¬x ∧ (¬y ∨ (y ∧ ¬z)))))∨
(¬r ∧ ((x ∧ ((y ∧ ¬z) ∨ (¬y ∧ z))) ∨ (¬x ∧ ¬y ∧ ¬z))))) ∨ (¬q ∧ ¬r ∧ x ∧ y)))∨
(¬p ∧ ((q ∧ ((r ∧ ((x ∧ ¬y ∧ ¬z) ∨ (¬x ∧ y))) ∨ (¬r ∧ x ∧ ¬y ∧ ¬z)))∨
(¬q ∧ ((r ∧ ¬x ∧ ¬y ∧ z) ∨ (¬r ∧ x ∧ ¬y)))))`;
                this.triggerMapCreation();
                this.showInfoDialog = false;
            },
            onDialogChange(newValue) {
                this.showInfoDialog = newValue;
            },
            getNumbersForVariable(variable) {
                const index = this.kvData.variables.indexOf(variable);
                const amount = 2 ** this.kvData.variables.length;
                const segmentSize = amount / (2 ** (index + 1));
                let currentNumber = 0;
                const numbers = [];
                for (let i = 0; i < amount / segmentSize; i++) {
                    for (let j = 0; j < segmentSize; j++) {
                        numbers.push(currentNumber);
                    }
                    currentNumber = currentNumber === 0 ? 1 : 0;
                }
                return numbers;
            },
            getTruthTableNumbers(token) {
                if (token === ')' || token === '(') {
                    return [];
                }

                const truthTable = this.kvData.truthTableArray[truthTableIndex];

                truthTableIndex++;
                if (truthTableIndex === this.kvData.truthTableArray.length) {
                    truthTableIndex = 0;
                }

                return Object.keys(truthTable).sort(sortBinaryStrings).map(key => truthTable[key]);
            }
        }
    };
</script>

<style lang="css">
    body, html {
        overflow-y: auto !important;
    }

    .v-input__slot {
        margin: 5px 0 0 0 !important;
    }

    .direction-down {
        display: flex;
        flex-direction: column;
    }

    .truthtable-right {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
    }

    .inactive-tab {
        border-bottom: 2px solid transparent;
    }

    .active-tab {
        border-bottom: 2px solid white;
    }

    .margin-left-150 {
        margin-left: 150px;
    }
</style>
