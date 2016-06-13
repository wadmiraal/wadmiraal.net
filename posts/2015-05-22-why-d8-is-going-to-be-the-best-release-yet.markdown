---
title: Why Drupal 8 is going to be the best release yet
description: Drupal 8 has made some tremendous progress in terms of functionality and architecture. Here's why I think this release is a revolution.
layout: post
tags:
  - Drupal 8
  - Open Source
  - PHP
credits:
  - { name: "Greg Boggs", site: "http://www.gregboggs.com" }
---

Drupal 8 is under way, and it's going to be awesome. There are many, many new features in core that will make this a CMS to be reckoned with. Furthermore, the Drupal team has made many design decisions that will ensure the relevance of the system for years to come.

We mainly talk about Drupal's new features when talking about Drupal 8. But I would like to focus on another point. One I feel is much more important.

## Getting off the Island

Drupal has a history of re-inventing the wheel. Except for jQuery, up until Drupal 7, everything in core was custom built. There was a reason for this: for years, it was hard to find quality, well-maintained libraries in the PHP world. Sure, there were some. But, as you will probably remember (or, maybe not), much of third-party PHP libraries on the Internet were clumsy and amateurish in their design (not that Drupal didn't have design issues of its own). So, pretty early on, the Drupal team decided to keep things in-house, so as to have control over the quality.

Fast-forward to 2012, the year the [PHP FIG](http://www.php-fig.org) group finalized [PSR-0](http://www.php-fig.org/psr/psr-0/), the first in a series of formal standards guides to increase PHP code quality and facilitate code re-use across projects. This standard got quickly adopted by members of the PHP community that were yearning for a higher quality standard in PHP code. The same year, [Composer](https://getcomposer.org/) got released and quickly started getting wide-spread attention. This encouraged even more PHP developers to start focusing on making their code easily installable via Composer, which encouraged them to adhere to the PHP FIG standard. When [Github](https://github.com) made source-code hosting hip again, with those [nifty badges in README files](https://github.com/wadmiraal/rtfm#rtfm), library maintainers started to realize how &ldquo;cool&rdquo; continuously tested code looked, and more and more libraries have since had at least some sort of test coverage.

Today, we can say the PHP landscape changed drastically. Sure, the language is still pretty bad. The projects built with PHP, however, have greatly increased in quality and &ldquo;usefulness&rdquo;. Monolithic frameworks are starting to fade in favor of small, well maintained and re-usable components. Libraries now tend to focus on one thing and do that thing *really well*.

The Drupal team acknowledged this fact, and decided it was time for Drupal to move &ldquo;off the Island&rdquo;. Drupal 8 not only includes a few third-party libraries, it includes *a lot*. Probably the one most talked about is the [Symfony HTTPFoundation](http://symfony.com/doc/current/components/http_foundation/introduction.html) component, but there are others. Drupal uses [Guzzle](https://github.com/guzzle/guzzle) for HTTP requests, [Backbone](http://backbonejs.org/) for richer client-side Javascript, [CKeditor](http://ckeditor.com/) as the new default WYSIWYG for inline-editing, [Composer](https://getcomposer.org/) for dependency management, and the list goes on. Not to mention Drupal is adopting standards in areas like Javascript and CSS architecture as well, *vastly* improving the front-end side of the system.

But why is this so important? Why should we care?

## Cross-pollination

I recently had to audit a CMS for a client, [ModX](http://modxcms.com/). The first thing I do in these situations is look at the source code. And one thing immediately struck me: *Hm, they are not leveraging any external libraries*. Much of the functionality is built *in house*. Just like with Drupal before version 8.

And that's when I realized just *how bad* this is for a large project. Maintaining many bits and pieces takes time and resources, both of which are very limited for many open source projects. All these bits and pieces mean a lot of wheel-reinventing as well; how many CMSs have their own, in-house template engine, for example? Drupal now uses [Twig](http://twig.sensiolabs.org/), which is an *awesome* template engine, and ditches its in-house PHPTemplate engine.

The core team realized how beneficial it would be to leverage the incredible work that is currently being done in the PHP community, and acted accordingly.

This *cross-pollination* is very beneficial to the entire Web community, not just Drupal. Not only does it allow all parties to concentrate on what they do best, focusing their productivity, but it also allows projects to benefit from the experience of the Drupal community. For instance, while developing Drupal 8, the core team encountered several issues with some of the third-party libraries. Instead of giving up on it and building their own, like they would have in the past, they fixed the issues and submitted pull-requests. They also suggested enhancements, improvements, etc. So, the third-party libraries actually got something *back* for letting Drupal use its source code. And that's what Open Source is all about: sharing and improving, together.

## None of us is as smart as all of us

We are all part of a vibrant and smart community. We make the web, and mostly get to have a good time while doing it. When we let each member of our community focus on a single task, instead of stretching her attention across multiple ones, we tend to get high quality results. These results can in turn be used by others, and the sharing starts from there.

Open Source is an *amazing* principle. It moves us forward, breaking new grounds constantly, while also strengthening the foundation on which we build further.

To me, Open Source is not about social justice, or ethics. I have no problem at all with closed source software (as long as it works). I just think closed source software misses out on some incredible opportunities, mostly tapping into the almost infinite creative potential and technological expertise of brilliant and passionate minds all over the world.

Drupal 8 will start tapping into this incredible source. And because of *that*, it is going to be *the best release yet*.

