const Negation = require('./Negation');
const And = require('./And');
const Or = require('./Or');
const Xor = require('./Xor');
const Iff = require('./Iff');
const Implication = require('./Implication');

module.exports = class KVNodeFactory {
    static createNode(node, mapConfigs, variables) {
        if (node.getType() === 'variable') {
            const index = variables.indexOf(node.getName());
            const mapConfig = mapConfigs[index].getCopy();
            mapConfig.setName(node.getName());
            mapConfig.setTruthTable(createTruthTable(mapConfig, mapConfigs));
            return mapConfig;
        } else if (node.getType() === 'not') {
            return new Negation();
        } else if (node.getType() === 'and') {
            return new And();
        } else if (node.getType() === 'or') {
            return new Or();
        } else if (node.getType() === 'xor') {
            return new Xor();
        } else if (node.getType() === 'iff') {
            return new Iff();
        } else if (node.getType() === 'imp') {
            return new Implication();
        }
    }
};

function createTruthTable(mapConfig, mapConfigs) {
    const squares = mapConfig.getSquares();
    const truthTable = {};
    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares[0].length; j++) {
            let truthTableKey = '';
            for (let k = 0; k < mapConfigs.length; k++) {
                truthTableKey += mapConfigs[k].coversSquare(i, j) ? '1' : '0';
            }
            truthTable[truthTableKey] = mapConfig.coversSquare(i, j) ? 1 : 0;
        }
    }
    return truthTable;
}
