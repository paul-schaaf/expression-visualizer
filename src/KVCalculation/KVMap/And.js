const BaseOperatorNode = require('./BaseOperatorNode');

module.exports = class And extends BaseOperatorNode {
    constructor(...children) {
        super(children);
    }

    execute() {
        const f = (mapConfigs, i, j) => mapConfigs.every(v => v.getSquares()[i][j].isColored());
        const truthTableF = (a, b) => a === 1 && b === 1 ? 1 : 0;
        this.mapConfig = super.execute(f, truthTableF);
        return this.mapConfig;
    }

    toString(){
        return `( ${this.children[0]} ∧ ${this.children[1]} )`;
    }
};
