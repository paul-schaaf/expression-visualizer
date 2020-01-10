const BaseOperatorNode = require('./BaseOperatorNode');

module.exports = class Or extends BaseOperatorNode {
    constructor(...children) {
        super(children);
    }

    execute() {
        const f = (mapConfigs, i, j) => mapConfigs.some(v => v.getSquares()[i][j].isColored());
        return super.execute(f);
    }
};
