const Parser = require('./Parser');
const Lexer = require('./Lexer');
const KVNodeFactory = require('./KVNodeFactory');
const MapConfigCreator = require('./MapConfigCreator');

const nonVariables = require('./enums/nonVariables');

export default function getKVArray (input) {
    const fileContent = input.trim();
    if (!fileContent) throw 'Please enter an expression';
    const lexer = new Lexer(fileContent);
    const variables = [];
    while (lexer.hasNext()) {
        const nextToken = lexer.next();
        if(!variables.includes(nextToken) && !nonVariables.includes(nextToken))
            variables.push(nextToken);
    }
    variables.sort();
    const mapConfigs = MapConfigCreator.createMapConfigs(variables.length);

    lexer.reset();
    const parser = new Parser(lexer);
    const root = parser.parse();
    const KVRoot = convertToKVTree(root, mapConfigs, variables);
    return KVRoot.execute().toArray();
}

function convertToKVTree(node, mapConfigs, variables){
    const kvNode = KVNodeFactory.createNode(node, mapConfigs, variables);
    const childrenKVNodes = node.getChildren().map(c => convertToKVTree(c, mapConfigs, variables));
    childrenKVNodes.forEach(c => kvNode.addChild(c));
    return kvNode;
}
