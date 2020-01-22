module.exports = class KVNode {
    constructor(children = []) {
        this.children = children;
    }

    addChild(child) {
        this.children.push(child);
    }
};
