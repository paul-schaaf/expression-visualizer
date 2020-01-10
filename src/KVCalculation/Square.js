module.exports = class Square {
    constructor(colored = false) {
        this.colored = colored;
    }

    isColored() {
        return this.colored;
    }

    color() {
        this.colored = true;
    }

    uncolor() {
        this.colored = false;
    }

    toString() {
        return this.colored ? '1' : '0';
    }
};
