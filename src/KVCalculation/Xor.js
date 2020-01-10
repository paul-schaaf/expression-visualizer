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
        return new And(or, nand).execute();
    }
};
