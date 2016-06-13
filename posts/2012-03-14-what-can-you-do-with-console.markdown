---
title: "What can you do with console"
description: "Lately I've been wondering: what can you do with the javascript console object ?. Let's find out."
layout: post
tags:
  - Javascript
  - For lolz
---

Lately I've been wondering: *what can you do with the javascript console object ?*.

Let's find out.


## Get down to business

I just did the following:

    console.log(console);

And my console went crazy and outputted a whole bunch of useful information.


### `assert()`

This is nifty: you can use `console.assert(typeof myVar === 'String', 'Wow, myVar is not a String !!')` in your code to check for certain conditions. And it will only log the message if the condition is false. This can be very handy for debugging or unit testing.


### `clear()`

This is easy: just clear the console and start anew.


### `dir()`

This is similar to log(), but is specifically for navigating through tree-like structures.


### `error()`

Outputs a message with special (red) formating. If you output structures like hashes, it will parse it as a String and won't let you navigate through it like log() or dir() (in Chrome or Firebug, at least).


### `warn()`

Same, with a different formating (yellow).


### `info()`

Same, with yet another formating (blue).


### `trace()`

This is cool: it logs from wich file the call is made. If you have several javascript files and need to debug them together, calling trace() before some other logs (or specifically errors) can really help you to quickly locate your errors.


### `memoryProfile()` and `memoryProfileEnd()`

This is getting serious: it allows you to start and end a memory audit (pass a string as the first argument to the start function to distinguish between profiles). It's slow like hell in FF, so I'd rather stick with the built in profiler found in Chrome, but you can still use it.


### `profile()` and `profileEnd()`

Similar to the previous, but it only logs time executions. This is fast in FF, but obviously does not include memory footprints.


### `time()`, `timeStamp()` and `timeEnd()`

To start the console timer, call time(). To end it, call timeEnd(). Anytime in between, you can get the time (H:i:s.u format) by calling timeStamp().


### `table()`

Allows you to view a hash as a table in your console. For it to work, your hash must have a logical structure (identical sub-keys), like:

    {
      row1: {
        cell1: '1.1',
        cell2: '1.2'
      },
      row2: {
        cell1: '2.1',
        cell2: '2.2'
      },
      row3: {
        cell1: '3.1',
        cell2: '3.2'
      }
    }

Pretty neat, no ?