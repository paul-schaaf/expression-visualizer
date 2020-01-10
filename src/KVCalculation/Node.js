module.exports = class Node {
    type;
    name;
    constructor(children = []) {
        this.children = children;
    }

    addChild(child) {
        this.children.push(child);
    }

    getChildren() {
        return this.children;
    }

    setType(type) {
        this.type = type;
    }

    getType(){
        return this.type;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    toString() {
        return this.type + '{' + this.children + '}';
    }
};
