const Parser = require('./Parser');
const Lexer = require('./Lexer');
const KVNodeFactory = require('./KVMap/KVNodeFactory');
const MapConfigCreator = require('./KVMap/MapConfigCreator');

const nonVariables = require('./enums/nonVariables');

export default function getKVData(input) {
    const lexer = createLexer(input);
    const root = parse(lexer);
    lexer.reset();

    const variables = getVariables(lexer);
    const mapConfigs = MapConfigCreator.createMapConfigs(variables.length);
    const KVRoot = convertToKVTree(root, mapConfigs, variables);
    const expressionMapConfig = KVRoot.execute();
    const squares = expressionMapConfig.getSquares();

    const KVArray = [];
    for (let i = 0; i < squares.length; i++) {
        KVArray[i] = [];
        for (let j = 0; j < squares[i].length; j++) {
            const square = { isColored: squares[i][j].isColored(), coveredBy: [] };
            for (let k = 0; k < mapConfigs.length; k++) {
                if (mapConfigs[k].coversSquare(i, j)) {
                    square.coveredBy.push({ name: variables[k], isNegated: false });
                } else {
                    square.coveredBy.push({ name: variables[k], isNegated: true });
                }
            }

            KVArray[i][j] = square;
        }
    }

    return {
        KVArray,
        variables,
    };
}

function createLexer(input) {
    const fileContent = input.trim();
    if (!fileContent) throw 'Please enter an expression';
    return new Lexer(fileContent);
}

function parse(lexer) {
    const parser = new Parser(lexer);
    return parser.parse();
}

function getVariables(lexer) {
    const variables = [];
    while (lexer.hasNext()) {
        const nextToken = lexer.next();
        if (!variables.includes(nextToken) && !nonVariables.includes(nextToken))
            variables.push(nextToken);
    }
    variables.sort();
    return variables;
}

function convertToKVTree(node, mapConfigs, variables) {
    const kvNode = KVNodeFactory.createNode(node, mapConfigs, variables);
    const childrenKVNodes = node.getChildren().map(c => convertToKVTree(c, mapConfigs, variables));
    childrenKVNodes.forEach(c => kvNode.addChild(c));
    return kvNode;
}
