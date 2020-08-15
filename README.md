The library to assert javascript code on the runtime. 

The name 'expect' was borrowed from Jest. And the syntax of assert is inspired by Jest and Chai. 

# Motivation

1. Javascript is a weak type language

Because that Javascript is a weak type language, when we code interace, like function, API, and so on, we often run into unexpected problem because we are giving the interface wrong augments, sometimes it's because we forgot the interace spec, sometimes it's because we made some refactor, and the type of the arguments changed in the chain of the path passing the arguments from one layer of call to other. 

2. TDD

Test driven development let you write code that throw error first, then write more code to correct it. Using runtime assertion let you find why the test failed earlier, at earlier part of code in you program. That helps.

Don't type a lot of console.log(...) to check the state of your program, scrolling the screen to verify the log, use assertion (both in your test code and real code) to let it alert you when something went wrong. TDD let you just focus your attestion on PROBLEMS.


# How to test

```
npm test
```
