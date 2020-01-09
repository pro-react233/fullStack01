const path = require("path");
const fs = require("fs");

module.exports.aliasFromTsConfig = function(tsConfigPath) {
    tsConfigPath = tsConfigPath || "./tsconfig.json";

    const tsConfigObj = require(tsConfigPath);

    if (!tsConfigObj) {
        throw new Error("Invalid tsconfig.json content");
    }

    const { baseUrl = "./", paths = {} } = tsConfigObj.compilerOptions;

    return Object.keys(paths)
        .map(key => ({
            alias: key,
            path: path.resolve(path.join(baseUrl, paths[key][0]))
        }))
        .reduce((aliases, mapping) => {
            aliases[mapping.alias] = mapping.path;
            return aliases;
        }, {});
};
