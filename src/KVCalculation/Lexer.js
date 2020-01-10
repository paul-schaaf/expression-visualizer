module.exports = class Lexer {
    constructor(fileContent) {
        this.fileArray = fileContent
            .replace(/(\()(?=[^ ])/g, '$1 ')
            .replace(/([^)])(?=\))/g, '$1 ')
            .replace(/(\))(?=\))/g, '$1 ')
            .replace(/(!)(?=.)/g, '$1 ')
            .replace(/(not)(?=\()/g, '$1 ')
            .replace(/(\r\n|\r|\n)/g, '')
            .replace(/(<->|↔)/g, 'iff')
            .replace(/(->|→)/g, 'imp')
            .replace(/([!¬])/g, 'not ')
            .replace(/∨/g, 'or')
            .replace(/∧/g, 'and')
            .replace(/⊕/g, 'xor')
            .replace(/(\))(?=[a-z])/g, '$1 ')
            .replace(/([a-z])(?=\()/g, '$1 ')
            .split(' ');
        this.index = -1;
    }

    hasNext() {
        return this.index < this.fileArray.length - 1;
    }

    next() {
        this.index += 1;
        return this.fileArray[this.index];
    }

    prev() {
        this.index -= 1;
        return this.fileArray[this.index];
    }

    isFinished() {
        return this.index > this.fileArray.length - 1;
    }

    reset() {
        this.index = -1;
    }
};
