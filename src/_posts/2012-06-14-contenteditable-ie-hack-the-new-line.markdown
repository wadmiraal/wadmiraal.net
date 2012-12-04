---
title: "Content Editable Hacks: IE and the new line"
description: "For SEO"
layout: post
tags:
  - Javascript
  - Code
  - Rant
  - Useful
---

Lately I've been busy creating an in-house spellchecker for our company. First of all: *content editable is a real pain !*

It's unbelievable the amount of work and hacking it takes to create a simple "wysiwyg"-like editor. Plus, this is one of the few projects I had which sometimes required 3 sets of logic:

 * IE
 * Gecko
 * Webkit

Yup, some parts actually require to check which browser you're using. Depressing at best.

One of the more infuriating problems was the Return key behavior. On content editable elements, hitting return causes either:

 * inserting a BR tage
 * wrapping the line in a P tag
 * wrapping the line in a DIV tag

When, obviously, we wanted it to be consitent accross browsers. There are many (MANY) examples on the web about this particular problem, but not all are complete or actually work without 3rd party libraries. For future reference (and those who don't wish to bother with my rambling about the IE hack), here's the "solution" we used:

    var onReturn = function (e) {
      var doxExec = false;

      try {
        doxExec = document.execCommand('insertBrOnReturn', false, true);
      }
      catch (error) {
        // IE throws an error if it does not recognize the command...
      }

      if (doxExec) {
        // Hurray, no dirty hacks needed !
        return true;
      }
      // Standard
      else if (window.getSelection) {
        e.stopPropagation();

        var selection = window.getSelection(),
            range = selection.getRangeAt(0),
            br = document.createElement('br');

        range.deleteContents();

        range.insertNode(br);

        range.setStartAfter(br);

        range.setEndAfter(br);

        range.collapse(false);

        selection.removeAllRanges();

        selection.addRange(range);

        return false;
      }
      // IE
      else if ($.browser.msie) {
        e.preventDefault();

        var range = document.selection.createRange();

        range.pasteHTML('<BR><SPAN class="--IE-BR-HACK"></SPAN>');

        // Move the caret after the BR
        range.moveStart('character', 1);

        return false;
      }

      // Last resort, just use the default browser behavior...
      return true;
    }

And yes, we did use jQuery there. We just added an event listener for a keydown event and attached the above function in case the Return key was pressed. But, first a little breakdown:

## Gecko

Gecko browsers implement the (IE) `document.execCommand()` method. But they have this nifty little feature that is called 'insertBrOnReturn', which does, well, what it says. So, if a browser implements this, we're home free and return `true` (because we want the default browser behavior). Sadly, IE does not implement the 'insertBrOnReturn' command.

## Webkit (and others)

On other browsers, we use the "standard" approach: prevent the return key from being "pressed" and insert a BR tag at the caret position. And, obviously, re-select the range so the caret is at the correct position. We return `false`, as we do not want the default browser behavior.

## IE

The approach is basically the same as for Webkit, but with a different syntax. But IE has this very weird bug.

This is a spell checker, so incorrect words are surrounded by a SPAN tag for styling. If the user hits Return just after a word that was wrapped with such a SPAN tag, the caret would visually jump to the right instead of going down to the beginning of the new line. The new line was there, and if a user continued typing, the new letters would appear on the new line as expected.

But why would IE display the caret on the previous line, about 1em to the right of the last word ? This confounded users, who did not understand what was happening.

As we expected, this bug had something to do with the render engine, not the markup itself (it's just a BR). We spent a lot of time trying out different possibilities. And then it hit me:

Just force IE to render it differently. If IE has a problem rendering a specific markup, one solution is to change something in the DOM, which will trigger the rendering again, usually solving the problem — usually I add/remove a class on the BODY tag.

But this time, adding/removing a class on the BODY tag **every time** a new line was added was just not feasible: much to heavy. So instead, I tried this: add an empty SPAN right after the BR tag.

And it worked.

IE now always renders the caret correctly, and being an empty SPAN, the user is not hindered in any way. And giving a recognizable class to the SPAN helps when we need to remove them (when saving, for example).

Hope this will help someone.

