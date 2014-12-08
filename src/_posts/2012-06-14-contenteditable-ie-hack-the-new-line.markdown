---
title: "Content Editable Hacks: IE and the new line render bug"
description: "For SEO"
layout: post
tags:
  - Javascript
  - Code
---

Lately I've been busy creating an in-house spellchecker for our company. When doing so, we encountered a weird bug that had something to do with IE's render engine.

This is a spell checker, so incorrect words are surrounded by a SPAN tag for styling. If the user hits Return just after a word that was wrapped with such a SPAN tag, the caret would visually jump to the right instead of going down to the beginning of the new line. The new line was there, and if a user continued typing, the new letters would appear on the new line as expected.

But why would IE display the caret on the previous line, about 1em to the right of the last word ? This confounded users, who did not understand what was happening.

As we expected, this bug had something to do with the render engine, not the markup itself (it's just a BR). We spent a lot of time trying out different possibilities. And then it hit me:

Just force IE to render it differently.

If IE has a problem rendering a specific markup, one solution is to change something in the DOM, which will trigger the rendering again, usually solving the problem — usually I add/remove a class on the BODY tag.

But this time, adding/removing a class on the BODY tag **every time** a new line was added was just not feasible: much to heavy. So instead, I tried this: add an empty SPAN right after the BR tag.

    if ($.browser.msie) {
      e.preventDefault();

      var range = document.selection.createRange();

      range.pasteHTML('<BR><SPAN class="--IE-BR-HACK"></SPAN>');

      // Move the caret after the BR
      range.moveStart('character', 1);

      return false;
    }

*Note: for full code, read [Content Editable Hacks: returning like a pro](/lore/2012/06/14/contenteditable-hacks-returning-like-a-pro/).*

And it worked.

IE now always renders the caret correctly, and being an empty SPAN, the user is not hindered in any way. And giving a recognizable class to the SPAN helps when we need to remove them (when saving, for example).

Hope this will help someone.

