const KVNode = require('./KVNode');
const Or = require('./Or');
const And = require('./And');
const Negation = require('./Negation');

module.exports = class Xor extends KVNode {
    constructor(...children) {
        super(children);
    }

    execute() {
        const or = new Or(...this.children);
        const and = new And(...this.children);
        const nand = new Negation(and);
        const and2 = new And(or, nand);
        this.mapConfig = and2.execute();
        this.truthTable = and2.getTruthTable();
        return this.mapConfig;
    }

    toString() {
        return `( ${this.children[0]} ⊕ ${this.children[1]} )`;
    }
};
