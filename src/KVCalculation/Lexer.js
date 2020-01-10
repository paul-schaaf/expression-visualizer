module.exports = class Lexer {
    constructor(fileContent) {
        const fileArray = fileContent
            .replace(/(\()(?=[^ ])/g, '$1 ')
            .replace(/([^)])(?=\))/g, '$1 ')
            .replace(/(\))(?=\))/g, '$1 ')
            .replace(/(!)(?=.)/g, '$1 ')
            .replace(/(not)(?=\()/g, '$1 ')
            .replace(/(\r\n|\r|\n)/g, '')
            .replace(/(<->|↔)/g, 'iff')
            .replace(/(->|→)/g, 'imp')
            .replace(/∨/g, 'or')
            .replace(/([!¬])/g, 'not ')
            .replace(/∧/g, 'and')
            .replace(/⊕/g, 'xor')
            .replace(/(\))(?=[a-z])/g, '$1 ')
            .replace(/([a-z])(?=\()/g, '$1 ')
            .split(' ');

        for (let i = 0; i < fileArray.length; i++) {
            try {
                if (fileArray[i] === '(' && fileArray[i + 1] === 'not' && fileArray[i + 3] === ')') {
                    fileArray[i] = null;
                    fileArray[i + 3] = null;
                }
                // eslint-disable-next-line no-empty
            } catch (err) {
            }
        }

        this.fileArray = fileArray.filter(token => token !== null && token !== '');
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
