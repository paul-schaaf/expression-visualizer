const BaseOperatorNode = require('./BaseOperatorNode');

module.exports = class Negation extends BaseOperatorNode {
    constructor(...child) {
        super(child);
    }

    execute() {
        const f = (mapConfigs, i, j) => !mapConfigs[0].getSquare(i, j).isColored();
        return super.execute(f);
    }
};
