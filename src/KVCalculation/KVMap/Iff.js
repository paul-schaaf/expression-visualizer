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
        return and.execute();
    }
};
