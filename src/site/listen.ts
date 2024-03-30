// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const listen = <T extends (...args: any[]) => unknown>(func: T) => {
    onmessage = async (ev: MessageEvent<Parameters<T>>) => postMessage(await func(...ev.data));
};
