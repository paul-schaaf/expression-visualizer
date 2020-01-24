const BaseOperatorNode = require('./BaseOperatorNode');

module.exports = class Negation extends BaseOperatorNode {
    constructor(...child) {
        super(child);
    }

    execute() {
        const f = (mapConfigs, i, j) => !mapConfigs[0].getSquare(i, j).isColored();
        this.mapConfig = super.execute(f);
        return this.mapConfig;
    }

    createTruthTable() {
        const truthTables = this.children.map(c => c.getTruthTable());

        const truthTable = {};
        Object.keys(truthTables[0]).forEach(key => {
            truthTable[key] = truthTables[0][key] === 0 ? 1 : 0;
        });
        return truthTable;
    }

    addChild(child) {
        if (this.children.length > 0) {
            throw 'Not a valid expression';
        }
        super.addChild(child);
    }

    toString() {
        return `( ¬ ${this.children[0]} )`;
    }

    toMapConfigArray() {
        return [this.mapConfig, this.children[0].toMapConfigArray()];
    }

    toTruthTableArray() {
        return [this.truthTable, this.children[0].toTruthTableArray()];
    }
};
