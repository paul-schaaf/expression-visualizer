const BaseOperatorNode = require('./BaseOperatorNode');

module.exports = class And extends BaseOperatorNode {
    constructor(...children) {
        super(children);
    }

    execute() {
        const f = (mapConfigs, i, j) => mapConfigs.every(v => v.getSquares()[i][j].isColored());
        return super.execute(f);
    }
};
