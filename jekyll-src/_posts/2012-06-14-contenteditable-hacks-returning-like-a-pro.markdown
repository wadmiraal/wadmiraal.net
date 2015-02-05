---
title: "Content Editable Hacks: returning like a pro"
description: "For SEO"
layout: post
tags:
  - Javascript
---

Lately I've been busy creating an in-house spellchecker for our company.

First of all: **content editable is a real pain !**

Now that that's out of the way, let me share some knowledge.

It's unbelievable the amount of work and hacking it takes to create a simple "wysiwyg"-like editor. This is one of the few projects I worked on which required 3 sets of logic:

 * IE
 * Gecko
 * Webkit

Yup, some parts actually require to check which browser you're using&thinsp;&mdash;&thinsp;which is against all best practices, I know.

One of the more infuriating problems was the Return key behavior. On content editable elements, hitting return causes either:

 * inserting a BR tage
 * wrapping the line in a P tag
 * wrapping the line in a DIV tag

When, obviously, we wanted it to be consistent accross browsers. There are many (MANY) examples on the web about this particular problem, but not all are complete or actually work without 3rd party libraries. For future reference, here's the &ldquo;solution&rdquo; we used:

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

      // Last resort, just use the default browser behavior and pray...
      return true;
    }

*Note: wondering about the SPAN tag in the IE solution ? Read [Content Editable Hacks: IE and the new line](/lore/2012/06/14/contenteditable-ie-hack-the-new-line/).*

And yes, we did use jQuery there. We just added an event listener for a keydown event and attached the above function in case the Return key was pressed.

## A little breakdown:

### Gecko

Gecko browsers implement the (IE) `document.execCommand()` method. But they have this nifty little feature that is called 'insertBrOnReturn', which does, well, what it says. So, if a browser implements this, we're home free and return `true` (because we want the default browser behavior). Sadly, IE does not implement the 'insertBrOnReturn' command.

### Webkit (and others)

On other browsers, we use the &ldquo;standard&rdquo; approach: prevent the return key from being &ldquo;pressed&rdquo; and insert a BR tag at the caret position. And, obviously, re-select the range so the caret is at the correct position. We return `false`, as we do not want the default browser behavior.

### IE

The approach is basically the same as for Webkit, but with a different syntax.

Hope this will help someone, somewhere.

