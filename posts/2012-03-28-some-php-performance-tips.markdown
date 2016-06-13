---
title: "Some PHP performance tips"
description: "I sometimes run some &laquo;scientific&raquo; (read &laquo;completely biased&raquo;) benchmarking for my PHP code to check for the most optimized way of writing some expression. But I keep on forgetting. So this is the place where I'm going to keep some references."
layout: post
tags:
  - PHP
  - Performance and Scalability
---

I sometimes run some &laquo;scientific&raquo; (read &laquo;completely biased&raquo;) benchmarking for my PHP code to check for the most optimized way of writing some expression. But I keep on forgetting. So this is the place where I'm going to keep some references.

So, to keep thing short, I'm just going to make some *bold assertions* here (sue me).


## Boolean casting

Sometimes you just need to check if a string is &laquo;true&raquo; or not. Usually I use `empty()` to avoid Notices, but sometimes I like it quick and dirty. So, in that case:

    $string = 'my string';

    // This is slower
    if ((bool) $string) {
      // Do stuff
    }

    // This is faster
    if (!!$string) {
      // Do stuff
    }

Notice the double negate sign to get &laquo;true&raquo; instead of &laquo;false&raquo;. This trick is also very handy when you really need a boolean and not **null** or **undefined**.

And by the way, `empty()` is slower in this particluar use-case.


## Set a flag in a loop

Ever used the trusty `$first` boolean flag in a loop ? Ever wondered which was faster: just setting it to false at the end of each loop, or checking if it's true and setting it only once ? Well, not that surprizingly, it's the second one (but by a tiny margin).

    $first = TRUE;

    // This is slower
    while(...) {
      // Do stuff

      $first = FALSE;
    }

    // This is faster
    while(...) {
      // Do stuff

      if ($first) {
        $first = FALSE;
      }
    }


## Check if an array is empty

When you want to check if an array is empty, turns out there's a really fast way to get this info: `empty()`.

    $items = array();

    // This is slowest
    if (count($items) == 0) {
      // Do stuff
    }

    // This is slower (but faster than the previous)
    if (!count($items)) {
      // Do stuff
    }

    // This is 2x faster
    if (empty($items)) {
      // Do stuff
    }
