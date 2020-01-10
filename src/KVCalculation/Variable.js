const MapConfig = require('./MapConfig');

module.exports = class Variable {
    constructor(isVertical, mapConfig) {
        this.isVertical = isVertical;
        this.mapConfig = mapConfig;
    }

    getMapConfig(){
        return this.mapConfig;
    }

    toString() {
        return this.mapConfig.toString();
    }

    doubleHeight() {
        const newMapConfig = new MapConfig(this.mapConfig.getHeight() * 2, this.mapConfig.getBreadth());

        if (this.isVertical) {
            for (let i = 0; i < newMapConfig.getHeight(); i++) {
                for (let j = 0; j < newMapConfig.getBreadth(); j++) {
                    if (this.mapConfig.getSquares()[0][j].isColored()) {
                        newMapConfig.colorSquare(i, j);
                    }
                }
            }
        } else {
            const oldFirstColumn = [];


            for (let i = 0; i < this.mapConfig.getHeight(); i++) {
                for (let j = 0; j < this.mapConfig.getBreadth(); j++) {
                    if (j === 0) {
                        oldFirstColumn.push(this.mapConfig.getSquare(i, j));
                    }
                }
            }

            const addedRows = oldFirstColumn.slice().reverse();
            const newFirstColumn = [...oldFirstColumn, ...addedRows];

            for (let i = 0; i < newMapConfig.getHeight(); i++) {
                for (let j = 0; j < newMapConfig.getBreadth(); j++) {
                    if (newFirstColumn[i].isColored()) {
                        newMapConfig.colorSquare(i, j);
                    }
                }
            }
        }

        this.mapConfig = newMapConfig;
    }

    doubleWidth() {
        const newMapConfig = new MapConfig(this.mapConfig.getHeight(), this.mapConfig.getBreadth() * 2);

        if(this.isVertical){
            const oldFirstRow = [];

            for (let i = 0; i < this.mapConfig.getHeight(); i++) {
                for (let j = 0; j < this.mapConfig.getBreadth(); j++) {
                    if (i === 0) {
                        oldFirstRow.push(this.mapConfig.getSquare(i, j));
                    }
                }
            }

            const addedColumns = oldFirstRow.slice().reverse();
            const newFirstRow = [...oldFirstRow, ...addedColumns];

            for (let i = 0; i < newMapConfig.getHeight(); i++) {
                for (let j = 0; j < newMapConfig.getBreadth(); j++) {
                    if (newFirstRow[j].isColored()) {
                        newMapConfig.colorSquare(i, j);
                    }
                }
            }
        } else {
            for (let i = 0; i < newMapConfig.getHeight(); i++) {
                for (let j = 0; j < newMapConfig.getBreadth(); j++) {
                    if (this.mapConfig.getSquares()[i][0].isColored()) {
                        newMapConfig.colorSquare(i, j);
                    }
                }
            }
        }

        this.mapConfig = newMapConfig;
    }
};
