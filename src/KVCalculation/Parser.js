const Node = require('./Node');
const nonVariables = require('./enums/nonVariables');

module.exports = class Parser {
    prevSymbol;
    symbol;
    root;

    constructor(lexer) {
        this.lexer = lexer;
    }

    parse() {
        this.expression();
        return this.root;
    }

    expression() {
        this.or();
        while (this.symbol === 'imp' || this.symbol === 'iff') {
            this.evaluateNonTerminal(this.or.bind(this));
        }
    }

    or() {
        this.xor();
        while (this.symbol === 'or') {
            this.evaluateNonTerminal(this.xor.bind(this));
        }
    }

    xor() {
        this.and();
        while (this.symbol === 'xor') {
            this.evaluateNonTerminal(this.and.bind(this));
        }
    }

    and() {
        this.not();
        while (this.symbol === 'and') {
            this.evaluateNonTerminal(this.not.bind(this));
        }
    }

    not() {
        this.evaluateTerminal();
        while (this.symbol === 'not') {
            const negation = new Node();
            negation.setType('not');
            negation.addChild(this.root);
            this.root = negation;
            this.goNext();
        }
    }

    evaluateNonTerminal(evaluateHigherPrecedence) {
        const node = new Node();
        node.setType(this.symbol);
        node.addChild(this.root);
        evaluateHigherPrecedence();
        node.addChild(this.root);
        node.reverseChildren();
        this.root = node;
    }

    evaluateTerminal() {
        this.goNext();
        if (this.symbol === ')') {
            this.expression();
            this.goNext();
        } else if (!nonVariables.includes(this.symbol)) {
            const variable = new Node();
            variable.setType('variable');
            variable.setName(this.symbol);
            this.root = variable;
            this.goNext();
        } else {
            throw 'Not a valid expression';
        }
    }

    isVariable(token) {
        return !nonVariables.includes(token);
    }

    goNext() {
        this.prevSymbol = this.symbol;
        this.symbol = this.lexer.next();
        let firstRun = false;
        let finalRun = false;
        if (this.prevSymbol === undefined) {
            this.prevSymbol = this.symbol;
            firstRun = true;
        } else if (this.symbol === undefined) {
            finalRun = true;
        }

        if (this.isVariable(this.prevSymbol) && this.isVariable(this.symbol) && !firstRun && !finalRun) {
            throw 'Not a valid expression. Found variable where operator should be.';
        }
    }
};
