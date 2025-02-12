/**
 * @file    hello.ts
 * @author  Emma Natalie Soh (2202191\@sit.singaporetech.edu.sg)
 * @par     CSD3121 Developing Immersive Applications
 * @date    11 January 2024
 *
 * @brief   This file defines two functions to faciliate a beginner's
 *          first steps in TypeScript.
 */

/**
 * @brief   This function formats a string to return a custom message for
 *          saying hello.
 *
 * @param[in]   _msg
 *      This is the custom data for the message.
 *
 * @return  The custom formatted message in the format of
 *          `Hello, ${_msg}!`.
 */
export function createHelloMessage(_msg: String): String
{
    return String(`Hello, ${_msg}!`);
}

/**
 * @brief   This function writes a custom message to the console
 *          log in the form of `Hello, ${_msg}!`.
 *
 * @param[in]   _msg
 *      This is the custom data for the message.
 */
export function sayHello(_msg: String): void
{
    console.log(createHelloMessage(_msg));
}