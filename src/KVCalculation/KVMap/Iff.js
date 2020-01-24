const KVNode = require('./KVNode');
const Implication = require('./Implication');
const And = require('./And');


module.exports = class Iff extends KVNode {
    constructor(...children) {
        super(children);
    }

    execute() {
        const implicationA = new Implication(...this.children);
        const implicationB = new Implication(...this.children.slice().reverse());
        const and = new And(implicationA, implicationB);
        this.mapConfig = and.execute();
        this.truthTable = and.getTruthTable();
        return this.mapConfig;
    }

    toString() {
        return `( ${this.children[0]} ↔ ${this.children[1]} )`;
    }
};
