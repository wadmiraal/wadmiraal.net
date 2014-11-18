---
title: "What's the best CSS grid out there ?"
layout: post
tags:
  - Code
  - CSS
  - Design
  - Responsive
---
Just my 2 cents...

## What a CSS Grid should *not* do

* It should never, ever have ***any*** impact on design. No font styles, sizes, no line heights, no CSS resets, no fancy button styles, **nothing**.
* It should not depend on JS ! Ever !
* It should not provide anything else than a grid (be it responsive, fluid or fixed).

## What a CSS Grid *should* do

* It should be lightweight. We don't want to add bloat to our designs.
* It should be simple and intuitive. No smarty-pants classes. And by the way, adding a `last` CSS class to a column is perfectly OK. It prevents us from having to use JS for CSS3 specific selectors (like `:last-child`).
* It should be easily extendable, if needed.
* It could, optionnaly, provide helper classes like `hide-on-phone` or `show-on-tablet`, etc.
* Responsive media queries would be great, if only as a starting point.

### So, having trouble finding a CSS grid ?

I feel bad for you son. I have 1140 problems, but [finding a lightweight, no-fuss, CSS grid ain't one of them](https://github.com/connecti/cssgrid).