/**
 * @file    custom.hello.ts
 * @author  Emma Natalie Soh (2202191\@sit.singaporetech.edu.sg)
 * @par     CSD3121 Developing Immersive Applications
 * @date    11 January 2024
 *
 * @brief   This file defines more custom tests for the hello functions.
 */

import { expect, test, vi } from 'vitest';
import { createHelloMessage, sayHello } from '../src/hello';

const names: readonly string[] = [
    "immersive world",
    "World",
    "Goodbye"
];

for (let name of names)
{

    // tests whether:
    // - createHelloMessage() in hello module returns the expected string
    test(`create "Hello, ${name}!" message`, () => {
        expect(createHelloMessage(name)).toBe(`Hello, ${name}!`);
    });

    // tests whether:
    // - sayHello() in hello module logs the expected string to the console
    const logSpy = vi.spyOn(console, 'log');
    test(`say "Hello, ${name}!" in the console`, () => {
        sayHello(name);
        expect(logSpy).toHaveBeenLastCalledWith(`Hello, ${name}!`);
    });
}