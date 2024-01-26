import { ftring, FtringsPool } from './index'

describe('Ftring', () => {
    it('must generate fn', () => {
        const fn = ftring('1 + 1')
        expect(typeof fn).toBe('function')
        expect(fn({})).toBe(2)
    })
    it('must support ctx', () => {
        const fn = ftring('a + b')
        expect(fn({a: 1, b: 2})).toBe(3)
    })
})

describe('FtringsPool', () => {
    it('must call functions', () => {
        const pool = new FtringsPool()
        expect(pool.call('1 + 1', {})).toBe(2)
    })
    it('must cache functions', () => {
        const pool = new FtringsPool()
        expect(pool.getFn('1 + 1')).toBe(pool.getFn('1 + 1'))
    })
})

describe('hacking ftring', () => {
    it('mustn\'t allow mess up with ctx by deleting props', () => {
        const fn = ftring(`(() => {
            delete __ctx__.console;
            __ctx__.setTimeout = '123'
            if (console) {
                console.log('hacked')
            }
            return __ctx__.setTimeout
        })()`)
        expect(() => fn({})).toThrow()
    })
    it('mustn\'t allow mess up with __ctx__ var', () => {
        const fn = ftring(`(() => {
            const __ctx__ = {}
            return setTimeout
        })()`)
        expect(fn({})).toBe(null)
    })
})
