const KVNode = require('./KVNode');
const Square = require('./Square');

module.exports = class MapConfig extends KVNode {
    constructor(height, breadth, name) {
        super();
        this.height = height;
        this.breadth = breadth;

        const squares = [];
        for (let i = 0; i < this.height; i++) {
            squares[i] = [];
            for (let j = 0; j < this.breadth; j++) {
                squares[i][j] = new Square();
            }
        }
        this.squares = squares;
        if (name) {
            this.name = name;
        }
    }

    getHeight() {
        return this.height;
    }

    getBreadth() {
        return this.breadth;
    }

    getSquares() {
        return this.squares;
    }

    colorSquare(i, j) {
        this.squares[i][j].color();
    }

    getSquare(i, j) {
        return this.squares[i][j];
    }

    coversSquare(i, j) {
        return this.squares[i][j].isColored();
    }

    setName(name) {
        this.name = name;
    }

    getCopy() {
        const newMapConfig = new MapConfig(this.height, this.breadth);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.breadth; j++) {
                if(this.getSquare(i,j).isColored()){
                    newMapConfig.colorSquare(i,j);
                }
            }
        }
        return newMapConfig;
    }

    toString() {
        let toString = '';
        for (let i = 0; i < this.height; i++) {
            toString += this.squares[i].join(' ') + '\n';
        }
        return toString;
    }

    toArray() {
        let arr = [];
        for (let i = 0; i < this.height; i++) {
            arr[i] = [...this.squares[i].map(s => !!s.isColored())];
        }
        return arr;
    }

    execute() {
        return this;
    }
};
