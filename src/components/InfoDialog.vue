<template>
    <v-dialog
            :value="show"
            width="500"
            @input="onDialogChange"
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
                <div class="body-1 pointer" @click="onDialogChange(false)">X</div>
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
                <v-btn
                        color="primary"
                        text
                        @click="onViewExampleClick"
                >
                    View Example
                </v-btn>
                <v-spacer/>
                <v-btn
                        color="primary"
                        text
                        @click="onDialogChange(false)"
                >
                    OK
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'InfoDialog',
        props: {
            show: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                width: window.innerWidth
            };
        },
        computed: {
            isMobile() {
                return this.width < 500;
            },
        },
        methods: {
            onDialogChange(newValue) {
                this.$emit('updated', newValue);
            },
            onViewExampleClick() {
                this.$emit('view-example-clicked');
            }
        }
    };
</script>

<style lang="css">
    .pointer {
        cursor: pointer
    }
</style>
