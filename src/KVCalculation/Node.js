module.exports = class Node {
    type;
    name;
    constructor(children = []) {
        this.children = children;
    }

    addChild(child) {
        this.children.push(child);
    }

    reverseChildren() {
        this.children.reverse();
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
        if(this.type === 'variable') return this.name;
        return this.type + '{' + this.children + '}';
    }
};
