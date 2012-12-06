---
title: "What's the best CSS Responsive grid out there ?"
layout: post
tags:
  - Code
  - CSS
  - Design
  - Responsive
---
How many CSS grid frameworks are there out there anyway ? 

Have you noticed how many 960gs clones, 1140, 1280, whatever resolution specific grids there are ? What gives ?

I've come to discover one that I patriculary like, and I'll share it, just with you. It'll be our special secret. 

But first, let me tell you what I think a CSS grid should *not* provide.

## What a CSS Grid should *not* be

* It should never, ever have ***any*** impact on design. No font styles, sizes, no line heights, no CSS resets, no fancy button styles, **nothing**.
* It should not depend on JS ! Ever !

## What a CSS Grid *should* be

* It should be lightweight. We don't want to add bloat to our designs.
* It should be simple and intuitive. No smarty-pants classes. And by the way, adding a `last` CSS class to a column is perfectly OK. It prevents us from having to use JS for CSS3 specific selectors (like `:last-child`)
* It should be easily extendable, if needed.
* It could, optionnaly, provide helper classes like `hide-on-phone` or `show-on-tablet`, etc.

## So, what to use

I came accross the [1140 CSS grid](http://cssgrid.net/) a while ago. I liked it because it was quite lightweight, did not require JS to function in older browsers and did not add much style-bloat. I have used it in some projects, but it wasn't perfect.

So, I forked it, cleaned it up, removed the style-bloat and CSS reset it included, and *voilà*: a perfect, usable and flexible CSS Grid framework !

Find it here: [connecti/cssgrid](https://github.com/connecti/cssgrid).