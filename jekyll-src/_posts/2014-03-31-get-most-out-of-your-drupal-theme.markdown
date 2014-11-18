---
title: "Get most out of your Drupal theme"
description: "Some tips and tricks to make awesome, flexible and scalable themes"
layout: post
tags:
  - Drupal
  - HTML
  - CSS
  - Theming
--- 

I've seen this more often than not: Drupal themers tend to provide their own markup. They overwrite templates, use hacky approaches for beating the Drupal core HTML into submission or simply <abbr title="Hack core">kill a few kittens</abbr>. 

There's something we misunderstand, though: we're *themers*. We take something that already exists and make it look the way it should. We should not interfere with the way the system spits out its markup (unless it's really bad). 

Here are a few rules that might help you write better, leaner themes, while also getting the project done faster. 

## 1 only write a template to prevent position: absolute;

Usually, you can do a lot with the markup Drupal provides. Sometimes you must get a bit creative, but often you can adapt pretty quickly. 

My rule of thumb is this: &ldquo;If you must use position: absolute; to make it look right, consider making a template.&rdquo; I'm not saying absolutely positioning stuff is bad per se. It just makes the page more &ldquo;fragile&rdquo; (especially when doing responsive webdesign). You take an element out of the content flow. This means it's a decision you shouldn't make lightly.


## 2 Don't theme content types, theme fields

As themers we often take a content type as the smallest building block Drupal provides, and build from there. But we're wrong. A field is the smallest building block. 

Theming fields provides a modular approach. It allows site builders to reuse existing fields in other contexts, while providing the exact same look. For instance, a content type may have a custom image gallery. If you theme this on the content type level, it will look fine. But what if, 6 months from now, we decide to add an image gallery on the user profile page? You'll have to duplicate styles (and maybe markup) to get it to work in this new context as well. 

If you focus on the field, however, you can just drop it into place on the user profile and it will work out of the box. 


## 3 Use content display modes profusely

This one is a real killer feature, but often overlooked, especially because it requires code (or a [module](https://drupal.org/project/entity_view_mode)). This is super useful if the same content must be displayed differently in different contexts (like articles on a newspaper site). 

Say we display a node &ldquo;teaser&rdquo; in 2 different views. In both contexts, you want to display the same information, but in a different order, while keeping the general layout of the node identical.

You can go using the &ldquo;fields&rdquo; route in Views, but that's often messy unless the view is very simple or uses a table display.

Or, you can use content displays. Content displays allow you to spit out node fields differently. You already know content displays, because Drupal provides 2 by default: *teaser* and *default* (aka *full*).

But you can also create your own. And for each one, you can change the way the fields are displayed. 

This gives immense flexibility, as it allows you to keep everything, again, very modular. In each of the above Views, for example, you would use a different content display. And if, in 6 months, you need to display your nodes as in View A, but in another location? Re-use the content display, and it works. No CSS rewrites, no new templates, it just works.


## 4 Give power back to the site builder/owner

It basically all comes down to this, when you think of it. Keep it flexible. Sites evolve. Don't wait for a redesign to implement some new feature. Keep the theme flexible. Many enhancements might be made re-using fields or other modular components. Of course, this must be taken into consideration *before* the theming even begins (you may not have much saying in the matter). But if you're doing the whole site, or are a team leader, consider taking this approach for your next project - your clients will love you for it.
