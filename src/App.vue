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
                <k-v-map :kv-data="kvData.KVArray"/>
                <div class="d-flex">
                    <div v-for="variable in kvData.variables" :key="variable" class="ml-2">{{ variable }}</div>
                </div>
                <div class="d-flex">
                    <div v-for="variable in kvData.variables" :key="variable" class="direction-down ml-2">
                        <div v-for="(number, index) in getNumbersForVariable(variable)" :key="variable + index">{{ number }}</div>
                    </div>
                </div>

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
    import getKVData from './KVCalculation';
    import InfoDialog from './components/InfoDialog';
    import KVMap from './components/KVMap';

    export default {
        name: 'App',
        components: { KVMap, InfoDialog },
        data() {
            return {
                tab: null,
                showInfoDialog: false,
                kvData: {},
                expression: '',
                error: null,
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
        },
        methods: {
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
            getNumbersForVariable(variable){
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
            }
        }
    };
</script>

<style lang="css">
    .v-input__slot {
        margin: 0 !important;
    }

    .direction-down {
        display: flex;
        flex-direction: column;
    }
</style>
