---
title: "A Drupal site, in the right order"
description: "Many projects tend to mix up some important steps in a Drupal project. Here's how to get it right."
layout: post
tags:
  - Drupal
  - Wisdom
  - Rant
--- 

More often than not, when working on a Drupal project, I have the strong feeling things are done the wrong way.

Doing stuff in the correct order will not only benefit the people that will have to actually work *with* the platform, but the entire team, the client and end-users as well. 

## Start with wireframes and mockups.

A no-brainer.

However: *it's very important that your developers are part of this*. They can provide invaluable insight on Drupal specificities, which can greatly speed up the development process. It may cost you more upfront, but in the end it will be worth it. 

## Create a design, but don't implement it

Probably what the client is most interested in, and crucial for the developers so they know what they must build. The way you setup an image gallery, for example, can greatly vary based on the way it's supposed to show up.

However, **it's still very premature to start the theming at this point**. Just don't do it. This is where many projects get it wrong. More below. 

## Start building the site

Start developing the site. Just use a core theme, like Seven or Bartik. It will look hideous, but power through.

Create the Views, the content types, etc. *Get the people that will manage the site content on board*. Explain to them you want to get it just right, that you want to make their job as easy and painless as possible. Their feedback will be priceless. Remember: **it's usually when the content managers get to work on the site that all the mistakes become obvious.** A missing field, an image field that should be a file field, and so forth. Small things that can ruin your day (or week) if discovered 2 days before launch. If this can be discovered during the build process, you are still flexible enough to make changes. This is so important and obvious, but often overlooked. 

## Theme it

This should be the very last step. Now that everything is set up, the HTML markup is final. It won't change, greatly speeding up the theming process. Your themer can focus on his CSS wizardry, and not loose time renaming style rules because a field got replaced by another one with a different name.

As an added bonus, the content managers can already start creating content, as the site back-end won't change anymore. 

## Final thought

A few more steps that will make your clients love you and are ideal when using this approach is making the site *easy to use for content managers*. This is a topic that deserves a post on it's own, but I highly recommend the slides from Pamela Barone's talk [*For the love of the content editors*](http://fr.slideshare.net/PamelaBarone/for-the-love-of-the-content-editors-drupalcon-prague-27036809) for some quick tips.
