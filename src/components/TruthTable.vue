<template>
    <div class="d-flex justify-center">
        <div class="d-flex">
            <div v-for="variable in variables" :key="variable" class="direction-down">
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
                    v-for="(token, index) in expressionArray" :key="token + index"
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
</template>

<script>
    function sortBinaryStrings(a, b) {
        if (a === b) {
            return 0;
        }
        return parseInt(a, 2) < parseInt(b, 2) ? -1 : 1;
    }

    let truthTableIndex = 0;

    export default {
        name: 'TruthTable',
        props: {
            truthTableArray: {
                type: Array,
                default: () => []
            },
            expressionArray: {
                type: Array,
                default: () => []
            },
            variables: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            getTruthTableNumbers(token) {
                if (token === ')' || token === '(') {
                    return [];
                }

                const truthTable = this.truthTableArray[truthTableIndex];

                truthTableIndex++;
                if (truthTableIndex === this.truthTableArray.length) {
                    truthTableIndex = 0;
                }

                return Object.keys(truthTable).sort(sortBinaryStrings).map(key => truthTable[key]);
            },
            getNumbersForVariable(variable) {
                const index = this.variables.indexOf(variable);
                const amount = 2 ** this.variables.length;
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
        }
    };
</script>
