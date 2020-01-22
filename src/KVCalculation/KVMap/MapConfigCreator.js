const MapConfig = require('./MapConfig');
const Variable = require('./Variable');

module.exports = class MapConfigCreator {
    static createMapConfigs(variableCount) {
        if (variableCount === undefined) {
            throw 'VariableCreator requires at least 1 variable';
        }

        let height = 1;
        let breadth = 2;
        const initialMapConfig = new MapConfig(height, breadth);
        initialMapConfig.colorSquare(0, 1);
        const initialVariable = new Variable(true, initialMapConfig);
        const variables = [initialVariable];

        let isNextVariableVertical = false;
        for (let i = 0; i < variableCount - 1; i++) {
            if (!isNextVariableVertical) {
                const startIndex = height;
                height *= 2;
                const endIndex = height;
                const mapConfig = new MapConfig(height, breadth);
                for (let j = startIndex; j < endIndex; j++) {
                    for (let k = 0; k < breadth; k++) {
                        mapConfig.colorSquare(j, k);
                    }
                }
                variables.forEach(v => v.doubleHeight());
                variables.push(new Variable(isNextVariableVertical, mapConfig));
            } else {
                const startIndex = breadth;
                breadth *= 2;
                const endIndex = breadth;
                const mapConfig = new MapConfig(height, breadth);
                for (let j = 0; j < height; j++) {
                    for (let k = startIndex; k < endIndex; k++) {
                        mapConfig.colorSquare(j, k);
                    }
                }
                variables.forEach(v => v.doubleWidth());
                variables.push(new Variable(isNextVariableVertical, mapConfig));
            }


            isNextVariableVertical = !isNextVariableVertical;
        }

        return variables.map(v => v.getMapConfig());
    }
};
