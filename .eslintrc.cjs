// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
// eslint-disable-next-line import/no-commonjs, import/unambiguous
module.exports = {
    env: {
        node: true,
    },
    extends: ["@andreashuber69"],
    ignorePatterns: ["/coverage/", "/dist/", "/github_pages/"],
    rules: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "react/require-optimization": "off",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "react/sort-comp": "off",
    },
};
