export const getElement = <T extends HTMLElement>(ctor: abstract new () => T, selector: string) => {
    const result = document.querySelector(selector);

    if (!(result instanceof ctor)) {
        throw new TypeError(`The selector ${selector} does not match an element of type ${ctor}.`);
    }

    return result;
};
