type CloneFn = typeof globalThis.structuredClone;

const structuredCloneShim: CloneFn = ((value: unknown, options?: StructuredSerializeOptions) => {
    const nativeStructuredClone = globalThis.structuredClone;
    if (typeof nativeStructuredClone === 'function') {
        return nativeStructuredClone(value, options);
    }

    // Fallback for environments without a native implementation.
    return JSON.parse(JSON.stringify(value));
}) as CloneFn;

export default structuredCloneShim;
