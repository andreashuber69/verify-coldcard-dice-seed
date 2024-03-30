export const listen = <T extends (...args: never[]) => unknown>(func: T) => {
    onmessage = async (ev: MessageEvent<Parameters<T>>) => postMessage(await func(...ev.data));
};
