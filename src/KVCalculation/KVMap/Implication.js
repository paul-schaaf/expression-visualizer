const KVNode = require('./KVNode');
const Negation = require('./Negation');
const Or = require('./Or');

module.exports = class Implication extends KVNode {
    constructor(...children) {
        super(children);
    }

    execute() {
        const negation = new Negation(this.children[0]);
        const or = new Or(negation, this.children[1]);
        this.mapConfig = or.execute();
        this.truthTable = or.truthTable;
        return this.mapConfig;
    }

    toString(){
        return `( ${this.children[0]} → ${this.children[1]} )`;
    }
};
