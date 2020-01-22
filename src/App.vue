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
            <v-icon v-if="isMobile" @click="dialog = true">mdi-information-outline</v-icon>
            <v-dialog
                    v-model="dialog"
                    width="500"
            >
                <template v-slot:activator="{ on }">
                    <v-btn v-if="!isMobile" text medium v-on="on">View How-to</v-btn>
                </template>

                <v-card>
                    <v-card-title
                            class="headline"
                    >
                        Rules & Features
                        <v-spacer/>
                        <div class="body-1 pointer" @click="dialog = false">X</div>
                    </v-card-title>
                    <v-card-text>
                        <div>
                            <div class="font-weight-medium">Nice little things:</div>
                            <ul>
                                <li>You can hover/tap squares to see the Conjunctive Normal Form of that square.
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div class="font-weight-medium">Precedence:</div>
                            <ul>
                                <li>The app uses the following operator precedence: not > and > xor > or > imp = iff. If
                                    imp and iff are next to each other, the rightmost operator binds first e.g.
                                    <!-- eslint-disable-next-line vue/no-parsing-error -->
                                    a -> b <-> c -> d = a -> (b <-> (c -> d)), both sides are valid inputs.
                                </li>
                                <li>Multiple <var>or</var> or Multiple <var>and</var> can be chained without adding
                                    parentheses e.g. (a or b or (a and b and c)).
                                    This cannot be done with other operators.
                                </li>
                            </ul>
                        </div>
                        <div class="mt-3">
                            <div class="font-weight-medium">Allowed Operators:</div>
                            <ul>
                                <li>and: and, ∧</li>
                                <li>or: or, ∨,</li>
                                <li>not: not, !, ¬</li>
                                <li>xor: xor, ⊕</li>
                                <!-- eslint-disable-next-line vue/no-parsing-error -->
                                <li>iff: iff, <->, ↔, ⇔</li>
                                <li>imp: imp, ->, →, ⇒</li>
                                <li>Multiple variations of the same operator may appear in an expression: e.g. x or y ∨
                                    z
                                </li>
                            </ul>

                        </div>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer/>
                        <v-btn
                                color="primary"
                                text
                                @click="dialog = false"
                        >
                            OK
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

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

    export default {
        name: 'App',
        data() {
            return {
                dialog: false,
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
                    this.onDrawButtonClick();
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
            onDrawButtonClick() {
                this.error = null;
                this.kvData = [];
                try {
                    this.kvData = Object.freeze(getKVArray(this.expression === null ? '' : this.expression));
                    // eslint-disable-next-line no-console
                    console.log(this.kvData);
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
