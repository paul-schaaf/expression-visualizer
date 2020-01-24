module.exports = class KVNode {
    constructor(children = []) {
        this.children = children;
        this.mapConfig = null;
        this.truthTable = null;
    }

    addChild(child) {
        this.children.push(child);
    }

    toMapConfigArray() {
        return [this.children[0].toMapConfigArray(), this.mapConfig, this.children[1].toMapConfigArray()];
    }

    toTruthTableArray() {
        return [this.children[0].toTruthTableArray(), this.truthTable, this.children[1].toTruthTableArray()];
    }

    setTruthTable(truthTable) {
        this.truthTable = truthTable;
    }

    getTruthTable() {
        return this.truthTable;
    }
};
