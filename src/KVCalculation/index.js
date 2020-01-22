const Parser = require('./Parser');
const Lexer = require('./Lexer');
const KVNodeFactory = require('./KVMap/KVNodeFactory');
const MapConfigCreator = require('./KVMap/MapConfigCreator');

const nonVariables = require('./enums/nonVariables');

export default function getKVArray(input) {
    const lexer = createLexer(input);
    const root = parse(lexer);
    lexer.reset();

    const variables = getVariables(lexer);
    const mapConfigs = MapConfigCreator.createMapConfigs(variables.length);
    const KVRoot = convertToKVTree(root, mapConfigs, variables);
    return KVRoot.execute().toArray();
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
