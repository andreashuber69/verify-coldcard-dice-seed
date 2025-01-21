// https://github.com/andreashuber69/verify-coldcard-dice-seed/blob/develop/README.md#----verify-coldcard-dice-seed

import config from "@andreashuber69/eslint-config";

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export
export default [
    ...config,
    {
        ignores: ["coverage/", "dist/", "github_pages/"],
    },
];
