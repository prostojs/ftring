# @prostojs/ftring

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
![Test Coverage: 100%](https://img.shields.io/badge/Test%20Coverage-100%25-brightgreen)
[![TypeScript Native](https://img.shields.io/badge/TypeScript-Native-blue.svg)](https://www.typescriptlang.org/)

`@prostojs/ftring` is a lightweight, secure, and efficient JavaScript (TypeScript) library designed to generate functions from strings. This library is particularly useful when pieces of logic need to be configurable and stored in a database for easy modification. It facilitates the dynamic sharing and maintenance of logic, primarily between backend and frontend, allowing for quick checks in the browser while maintaining security and performance.

### Rationale

In modern development environments, there is often a need to share logic between the backend and frontend, especially for performing quick checks in the browser. This library allows developers to maintain logic solely on the backend and ship only short strings with checks to the frontend. This ensures that the logic can be dynamically changed and maintained easily without compromising the runtime environment's security.

### Security

`@prostojs/ftring` is built with security considerations in mind. It ensures that no global objects can be accessed from the string function, preventing any potential harm to the runtime.

### Installation

```sh
npm install @prostojs/ftring
```

#### ESM

```js
import { ftring, FtringsPool } from '@prostojs/ftring';
```

#### CommonJS

```js
const { ftring, FtringsPool } = require('@prostojs/ftring');
```

### Usage

#### Basic Usage

```js
import { ftring } from '@prostojs/ftring';

const fn = ftring<number, { a: number; b: number }>('a + b');
console.log(fn({ a: 2, b: 3 })); // Outputs: 5
```

#### Using FtringsPool

```js
import { FtringsPool } from '@prostojs/ftring';

const pool = new FtringsPool<number, { a: number; b: number }>();

console.log(pool.call('a + b', { a: 2, b: 3 })); // Outputs: 5
```

### API Reference

#### ftring<R, CTX>(code: string): ((__ctx__: CTX) => R)

Generates a new function from the provided string code.

- `R` - Return type of the function.
- `CTX` - Type of the context object that will be passed to the function.
- `code` - String containing the function logic.

#### FtringsPool<R, CTX>

A class that maintains a pool of ftrings and caches functions so equal code-strings share the same function.

- `call<C extends CTX>(code: string, ctx: C)`: Calls the function represented by the string code with the provided context.
- `getFn<C extends CTX>(code: string)`: Retrieves the function represented by the string code.

### Use Cases

1. **Configurable Logic**: When pieces of logic are configurable and stored in a database, allowing for easy and dynamic configuration changes.
2. **Backend-Frontend Logic Sharing**: Sharing a piece of logic stored at the backend with the frontend for quick checks in the browser, enabling dynamic changes and maintenance of logic only on the backend.
3. **Offline Field Checks**: For performing offline field checks in the browser, reducing the load on the server and improving user experience by providing instant feedback.

### Examples

#### Dynamic Form Validation

```js
import { ftring } from '@prostojs/ftring';

const validationRule = 'email.includes("@") && password.length >= 8';
const validate = ftring<boolean, { email: string; password: string }>(validationRule);

console.log(validate({ email: 'test@example.com', password: 'password' })); // Outputs: true
```

#### Configurable Business Logic

```js
import { FtringsPool } from '@prostojs/ftring';

const businessLogicPool = new FtringsPool<number, { price: number; tax: number }>();

// Assuming logicCode is fetched from a configuration database
const logicCode = 'price + (price * tax / 100)';
console.log(businessLogicPool.call(logicCode, { price: 100, tax: 5 })); // Outputs: 105
```

