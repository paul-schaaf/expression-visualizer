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
            <v-dialog
                    v-model="dialog"
                    width="500"
            >
                <template v-slot:activator="{ on }">
                    <v-btn text medium v-on="on">See Rules</v-btn>
                </template>

                <v-card>
                    <v-card-title
                            class="headline"
                    >
                        Rules
                        <v-spacer/>
                        <div class="body-1 pointer" @click="dialog = false">X</div>
                    </v-card-title>
                    <v-card-text>
                        <div>
                            <div class="font-weight-medium">Parentheses:</div>
                            <ul>
                                <li>The app does not use operator precedence. Set parentheses with the following
                                    exceptions:
                                </li>
                                <li>Multiple <var>or</var> or Multiple <var>and</var> can be chained without adding
                                    parentheses e.g. (a or b or (a and b and c))
                                    This cannot be done with other operators.
                                </li>
                                <li>Not will bind itself to the symbol directly after it e.g. (not a) and (not b) and
                                    (not c) -> not a and not b and not c
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
                                <li>iff: iff, <-> ↔</li>
                                <li>imp: imp, ->, →</li>
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
                    <div
                            v-for="(square, columnIndex) in row"
                            :key="'kvRow' + rowIndex + columnIndex"
                            :class="{'square-filled': kvData[rowIndex][columnIndex]}"
                            class="square"
                            :style="squareStyle"
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
                dialog: false,
                kvData: [],
                expression: '',
                error: null,
                height: window.innerHeight - 100,
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
                } catch (err) {
                    this.error = err;
                }
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
