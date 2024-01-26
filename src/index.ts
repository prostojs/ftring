
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
    indexedDB: null,
    caches: null,
    console: null,
    performance: null,
    fetch: null,
    XMLHttpRequest: null,
    Image: null,
    Audio: null,
    navigator: null,
    navigation: null,
    location: null,
    history: null,
    screen: null,
    requestAnimationFrame: null,
    cancelAnimationFrame: null,
    cancelIdleCallback: null,
    captureEvents: null,
    chrome: null,
    clientInformation: null,
    addEventListener: null,
    removeEventListener: null,
    blur: null,
    close: null,
    closed: null,
    confirm: null,
    alert: null,
    customElements: null,
    dispatchEvent: null,
    debug: null,
    focus: null,
    find: null,
    frames: null,
    getSelection: null,
    getScreenDetails: null,
    getEventListeners: null,
    keys: null,
    launchQueue: null,
    parent: null,
    postMessage: null,
    print: null,
    profile: null,
    profileEnd: null,
    prompt: null,
    queryLocalFonts: null,
    queryObjects: null,
    releaseEvents: null,
    reportError: null,
    resizeBy: null,
    resizeTo: null,
    scheduler: null,
    stop: null,
    scroll: null,
    scrollBy: null,
    scrollTo: null,
    scrollY: null,
    scrollX: null,
    top: null,

    // other
    eval: null,
    __ctx__: null,
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
        const newCtx = Object.freeze(Object.assign({}, GLOBALS, ctx))
        return fn(newCtx)
    }) as ((__ctx__: CTX) => R)
}
