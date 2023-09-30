
/**
 * For security considerations
 * all the globals are hidden
 * from fn runtime
 */
const GLOBALS = {
    // Node.js Globals
    global: null,
    process: null,
    Buffer: null,
    require: null,
    __filename: null,
    __dirname: null,
    exports: null,
    module: null,
    setImmediate: null,
    clearImmediate: null,
    setTimeout: null,
    clearTimeout: null,
    setInterval: null,
    clearInterval: null,
    queueMicrotask: null,
    queueGlobalMicrotask: null,
    globalThis: null, // GlobalThis (Introduced in ECMAScript 2020)
    // Browser Globals
    window: null,
    self: null,
    document: null,
    localStorage: null,
    sessionStorage: null,
    console: null,
    performance: null,
    fetch,
    URL: null,
    URLSearchParams: null,
    XMLHttpRequest: null,
    FormData: null,
    Image: null,
    Audio: null,
    navigator: null,
    location: null,
    history: null,
    screen: null,
    requestAnimationFrame: null,
    cancelAnimationFrame: null,
}

/**
 * Pool of ftrings
 * Caches functions so equal code-strings share the same function
 */
export class FtringsPool<R, CTX> {
    private cache: Map<string, ((__ctx__: CTX) => R)> = new Map()

    call<C extends CTX>(code: string, ctx: C) {
        return this.getFn(code)(ctx)
    }

    getFn<C extends CTX>(code: string): ((__ctx__: C) => R) {
        let cached = this.cache.get(code)
        if (!cached) {
            cached = ftring<R, C>(code) as ((__ctx__: CTX) => R)
            this.cache.set(code, cached)
        }
        return cached
    }
}

/**
 * Generates function
 * @param code text code
 * @returns new function
 */
export function ftring<R, CTX>(code: string): ((__ctx__: CTX) => R) {
    const fnCode = `with(__ctx__){\nreturn ${code}\n}`
    const fn = new Function('__ctx__', fnCode) as ((ctx?: Record<string, unknown>) => R)
    return ((ctx?: Record<string, unknown>) => {
        const newCtx = Object.assign({}, GLOBALS, ctx)
        return fn(newCtx)
    }) as ((__ctx__: CTX) => R)
}
