<p align="center">
  <a href="https://snek.at/" target="_blank" rel="noopener noreferrer">
    <img src="https://user-images.githubusercontent.com/26285351/208744045-1ee54b94-5ab6-41dc-a70e-b604fba24e56.gif" alt="SNEK Logo" height="150">
  </a>
</p>

<h3 align="center">Snek Toolbox</h3>

<p align="center">
  This is a collection of handy scripts used in <a href="https://github.com/snek-at/functions" target="blank">snek-at/functions</a> provided by snek-at.
</p>

# hash.ts

This module exports two functions, `generatePasswordHash` and `verify`, for generating and verifying password hashes using the PBKDF2 algorithm.

## generatePasswordHash(password: string)

Takes a plain-text password as an input and returns a promise that resolves to a hashed password using the PBKDF2 algorithm. The hashed password includes information about the digest method, the number of iterations, and the salt used.

## verify(password: string, hash: string)

Takes a plain-text password and a hashed password as inputs and returns a promise that resolves to a boolean indicating whether the plain-text password matches the hashed password. It does this by splitting the hashed password into its components (digest, iterations, salt, and key) and re-hashing the plain-text password using the same parameters. Then it compares the newly hashed password with the original hashed password.

## Example

```bash
import { generatePasswordHash, verify } from './toolbox/hash';

(async () => {
const password = 'mysecretpassword';
const hashedPassword = await generatePasswordHash(password);
console.log(hashedPassword); // pbkdf2_sha256$100000$5i5o5L5d5$vNhc2VuZXJzY2FwYWJsZQ==
const isPasswordMatch = await verify(password, hashedPassword);
console.log(isPasswordMatch); // true
})();
```

Note: The output of the hashed password and salt will be different for each execution

This module uses the built-in crypto library of node.js to perform the hashing and verification operations. The code is written in TypeScript and exports two functions, `generatePasswordHash` and `verify`. The `generatePasswordHash` function takes a plain-text password as an input and returns a promise that resolves to a hashed password using the PBKDF2 algorithm. The `verify` function takes a plain-text password and a hashed password as inputs and returns a promise that resolves to a boolean indicating whether the plain-text password matches the hashed password.

It is important to note that the hashed password is salted and the salt is included in the final hashed password, so it is not necessary to store the salt separately.

You can use this module to securely hash and verify passwords in your application.

SPDX-License-Identifier: (EUPL-1.2)
Copyright © 2019-2022 snek.at
