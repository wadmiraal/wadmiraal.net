---
title: "Detect the current mediaquery display with JS"
description: "Sometimes, we need to detect in what display 'mode' we are with JS. Classical methods involve detecting screen size or user agents, but there is a far simpler technique."
layout: post
tags:
  - Javascript
  - Code
  - Tip
---

Ever needed to test some Javascript code that only is supposed to be triggered when in &ldquo;mobile&rdquo; view in a responsive layout ? Or to detect if we're in portrait or landscape mode, *but always based on the CSS rules ?*

Here's a Quick'n'Dirty&reg; trick to get the job done.

## Requirements

* You are using CSS3 media queries to adapt your layout and design to the screen resolution *and* want your Javascript to follow these CSS rules.
* You have some kind of generic classes (like `hide-on-tablet`, `show-on-phone`, `portrait-view`, etc) to easily toggle the display of certain elements in your page (many [CSS responsive grids](https://github.com/connecti/cssgrid) provide these).

## Trick

Just insert the following HTML at the very end of your file:

    <span id="mobile-layout-switch" class="show-on-phone"></span>

This can be adapted with any class, obviously.

Now, for the above example, when we're in &ldquo;mobile&rdquo; layout, this little fellow will get a `display: block;` setting. When in any other mode, it get's a `display: none;`. This is won't mess up our design, because the `span` is empty and won't take up any space.

Now, in Javascript, we can very easily detect in wich view we are by detecting the *display* of our span. Using jQuery:

    if ($('#mobile-layout-switch').css('display') === 'block') {
      // We're in mobile view !
    }

Tadah ! We can now easily detect what mode we're in, and they will always match our CSS rules. An added bonus to this is that it's much easier to test our Javascript in our desktop browser when developing: just resize the window.
