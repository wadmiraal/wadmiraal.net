---
title: Why Drupal 8 is going to be the best release yet
description: Drupal 8 has made some tremendous progress in terms of functionality and architecture. Here's why I think this release is a revolution.
layout: post
tags:
  - Drupal 8
  - Open Source
  - PHP
---

Drupal 8 is under way, and it's going to be awesome. There are many, many new features in core that will make this a CMS to be reckoned with. The Drupal team has made many design decisions that will ensure the relevance of the system for years to come.

We mainly talk about Drupal's new features when talking about Drupal 8. But I would like to focus on another point.

## Getting of the Island

Drupal has a history of re-inventing the wheel. Except for jQuery, up until Drupal 7, everything in core was custom built. There was a reason for this: for years, it was hard to find quality, well-maintained libraries in the PHP world. Sure, there were some. But, as you will probably remember (or, maybe not), much of third-party PHP libraries on the Internet were clumsy and amateurish in their design (not that Drupal didn't have design issues of its own). So, pretty early on, the Drupal team decided to keep things in-house, so as to have control over the quality.

Fast-forward to 2013, the year the PHP FIG group published PSR-0, a formal standards guide to increase PHP code quality. This standard got quickly adopted by members of the PHP community that were yearning for a higher quality standard in PHP code. The same year, Composer got wide-spread attention. This encouraged even more PHP developers to start focusing on making their code easily installable via Composer, which encouraged them to adhere to the PHP FIG standard. When Github made source-code hosting hip again, with those nifty badges in README files, library maintainers started to realize how &ldquo;cool&rdquo; continuously tested code looked, and more and more libraries have at least some sort of test coverage.

Today, we can say the PHP landscape changed drastically. Sure, the language is still pretty bad. The projects built with PHP, however, have greatly increased in quality and &ldquo;usefulness&rdquo;. Monolithic frameworks are starting to fade in favor of small, well maintained and re-usable components. Libraries now tend to focus on one thing and do that thing *really well*.

The Drupal team acknowledged this fact, and decided it was time for Drupal to move &ldquo;off the Island&rdquo;. Drupal 8 not only includes a few third-party libraries, it includes *a lot*. Probably the one most talked about is the inclusion of the Symfony HTTPFoundation component, a incredibly well-built and useful basis for many frameworks, including Symfony itself, Silex and Laravel. There are others, though. Drupal uses Pimple for dependency injection, Guzzle for HTTP requests, Backbone for richer client-side Javascript, CKeditor as the new default WYSIWYG, and the list goes on. Not to mention Drupal is adopting standards in areas like Javascript and CSS architecture as well, *vastly* improving the front-end side of the system.

But why is this so important? Why should we care?

## Cross-pollenization

I recently had to audit a CMS for a client, ModX. The first thing I do in these situations is look at the source code. And one thing immediately struck me: *Hm, they are not leveraging any external libraries*. Much of the functionality is built *in house*. Just like with Drupal 7, and versions before.

And that's when I realized just *how bad* this is for a large project. Maintaining many bits and pieces takes time and resources, both of which are very limited for many open source projects, as they tend to be mainly developed by volunteers. All these bits and pieces mean a lot of wheel-reinventing as well; how many CMSs have their own, in-house template engine, for example? A template engine is a big deal. In Drupal's case, it used to be highly complex (and heavy), because of the immense flexibility it offered. But other projects have dealt with the same headaches, and some have solved these in an even better way. Which is why Drupal now uses [Twig](), which is an *awesome* template engine. The core team realized how beneficial it would be to leverage the incredible work that is currently being done in the PHP community, and acted accordingly.

This *cross-polenization* is very beneficial to the entire PHP community, not just Drupal. Not only does it allow all parties to concentrate on what they do best, focusing their productivity, but it also allows projects to benefit from the experience of the Drupal community. For instance, while developing Drupal 8, the core team encountered several issues with some of the leveraged libraries. They fixed bugs and submitted pull-requests, they suggested enhancements, etc. So, the third-party libraries actually got something *back* for letting Drupal use its source code. And that's what Open Source is all about: sharing and improving, together.

## No one is as smart as all of us

We are all part of a vibrant and smart community. We make the web, and mostly get to have a good time while doing it. When we let each member of our community focus on a single task, instead of stretching her attention across multiple ones, we tend to get high quality results. These results can in turn be used by others, and the sharing starts from there.

Open Source is an *amazing* principle. It moves us forward, breaking new grounds constantly, while also strengthening the foundation on which we build further.

To me, Open Source is not about [social justice](), or [ethics](). I have no problem at all with closed source software (as long as it works). I just think closed source software misses out on some incredible opportunities, mostly tapping into the almost infinite creative potential and technical expertise of brilliant and passionate minds all over the world.

Drupal 8 will start tapping into this incredible source. And because of *that*, it is going to be *the best release yet*.

