const Node = require('./Node');

module.exports = class Parser {
    symbol;
    root;

    constructor(lexer) {
        this.lexer = lexer;
    }

    parse() {
        this.expression();
        if (this.lexer.isFinished()) {
            return this.root;
        } else {
            throw 'Not a valid expression';
        }
    }

    expression() {
        this.evaluateNext();

        if (this.lexer.isFinished()) {
            return;
        }

        if (this.symbol !== 'and' && this.symbol !== 'or') {
            const node = new Node();
            node.setType(this.symbol);
            node.addChild(this.root);
            this.evaluateNext();
            node.addChild(this.root);
            this.root = node;
        } else {
            const currentSymbol = this.symbol;

            while (this.symbol === currentSymbol) {
                const node = new Node();
                node.setType(this.symbol);
                node.addChild(this.root);
                this.evaluateNext();
                node.addChild(this.root);
                this.root = node;
            }

            if (this.symbol === 'or' && currentSymbol === 'and') {
                throw 'Not a valid expression';
            } else if (this.symbol === 'and' && currentSymbol === 'or') {
                throw 'Not a valid expression';
            }
        }
    }

    evaluateNext() {
        this.symbol = this.lexer.next();
        if (this.symbol === 'not') {
            const negation = new Node();
            negation.setType('not');
            this.evaluateNext();
            negation.addChild(this.root);
            this.root = negation;
        } else if (this.symbol === '(') {
            this.expression();
            this.symbol = this.lexer.next();
        } else {
            const variable = new Node();
            variable.setType('variable');
            variable.setName(this.symbol);
            this.root = variable;
            this.symbol = this.lexer.next();
        }
    }
};
