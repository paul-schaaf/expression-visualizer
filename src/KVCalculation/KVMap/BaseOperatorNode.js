const KVNode = require('./KVNode');
const MapConfig = require('./MapConfig');

module.exports = class BaseOperatorNode extends KVNode {
    constructor(children = []) {
        super(children);
    }

    execute(f, truthTableF) {
        const mapConfigs = this.children.map(c => c.execute());
        const height = mapConfigs[0].getHeight();
        const breadth = mapConfigs[0].getBreadth();
        const mF = new MapConfig(height, breadth);

        for (let i = 0; i < mF.getHeight(); i++) {
            for (let j = 0; j < mF.getBreadth(); j++) {
                if (f(mapConfigs, i, j)) {
                    mF.colorSquare(i, j);
                }
            }
        }

        this.truthTable = this.createTruthTable(truthTableF);

        return mF;
    }

    createTruthTable(truthTableF){
        const truthTables = this.children.map(c => c.getTruthTable());

        const truthTable = {};
        Object.keys(truthTables[0]).forEach(key => {
            truthTable[key] = truthTableF(truthTables[0][key], truthTables[1][key]);
        });
        return truthTable;
    }
};
