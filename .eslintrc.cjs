// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed
// eslint-disable-next-line import/unambiguous, import/no-commonjs
module.exports = {
    env: {
        node: true,
    },
    extends: ["@andreashuber69"],
    ignorePatterns: ["/coverage/", "/dist/", "/github_pages/"],
};
