---
title: "Why we need a new hero"
description: "Opigno is the new, Drupal powered e-learning distribution. This discusses why Opigno is so necessary in this industry."
layout: post
tags:
  - Drupal
  - Rant
  - Bold assertions
  - Open Source
---

There's a new hero in e-learning town, and he's called [Opigno](https://drupal.org/project/opigno).

&ldquo;Yet another, open-source e-learning software&rdquo;, you may think. But we've worked in this industry for some time now, and we definitely think it's important &mdash; nay, mandatory &mdash; that we get another open-source e-learning platform. One that does things right.

Opigno is not just another wanabe-open-source-look-at-me-I'm-new project. It's a product born out of necessity and frustration.

## The state of open-source e-learning

### Coding techniques from another age

The state of e-learning software is, to put it elegantly, completely *passé*.

Many existing platforme use coding techniques from the 90's. Some products **generate PHP scripts on the fly for new content**. This is amazingly stupid and is a complete nightmare to manage when one finds a bug in *every generated script* (ever heard of <abbr title="Don't Repeat Yourself">DRY</abbr> code ?).

The worst part: many do not provide sensible APIs to extend or enhance the platform in any meaningful way, going as far as to *encourage* (\*gasp\*) hacking core to add new functionality.

### Pro-version vs community... what ?

This might seem irrelevant to many, but having a product with a *pro* version and a *community* doesn't work out that well. Most clients are confused to which one does what, and as professionals we've often seen that community products are just cheap, buggy versions of the pro one. The product vendors provide little to no support for these *community-version* clients, stating they should get the pro version if they want any help.

Having an open-source product should *not* be about providing a freebie to lure in clients. It should be about *creating a community that helps the product grow*.

### One platform to rule them all

Existing open-source platforms all look alike\* (some actually are forks of one another, but many don't say that out loud), the interfaces are either choking with vivid-colored icons or consist of just floating text all over the place.

Many try to please as many clients as possible at once, creating bloated interfaces and a terrible user-experience for both admins and users. Some products have dozens and dozens of fields just to create a new *course* ! Whereas many clients would just need one: the course title.

Because many products try to be everything to everyone, they are often heavy and bloated, shipping with functionality many users would not even know what to do with.

*\* To me, at least.*

## Starting from scratch

Once we got to the point where we realized the existing products could not be saved unless their maintainers got either replaced or brainwashed (in a good way), we decided to start from scratch.

And we decided to use the platform we love most: [Drupal](https://drupal.org).

## What sets Opigno apart

### A solid, modern API

We develop platforms for a living. And we know that using a state-of-the-art framework as a base is a must for any product. It provides stable APIs for creating new stuff, as well as a great starting points for others to contribute.

Drupal is an incredibly great starting point for this kind of platforms. It has an amazing community, great existing modules and a rock-solid API.

*Side note: some e-learning projects have been started, in the past, on Drupal. But many where for older version of Drupal (6 or older), abandoned ot not truly community products (like Ethos). That's why we decided to create a new one and not take over one of the existing ones.*

There are very little hooks Opigno provides. This is a *feature* in our eyes: we wanted to use existing Drupal functionality as much as possible. This means we use [OG](https://drupal.org/project/og), [Rules](https://drupal.org/project/rules) and [Views](https://drupal.org/project/views) extensively, and allow developers to use these well-known APIs to enhance there e-learning platform as they see fit.

### A single, simple license

This is a no-brainer if you're a Drupalista. Opigno, just as Drupal, is GPL. There's only one version, the *community* one. There's no *pro*, no tricks, no license fees, etc.

### Lean and mean

First and foremost, at it's core, Opigno is nothing more than a wrapper around OG. It's lean and mean and provides just enough to get you started.

Then, there are several modules (like [Opigno Quiz](https://drupal.org/project/opigno_quiz_app) or [Opigno Certificate](https://drupal.org/project/opigno_certificate_app)) that allow you to enhance the platform as you see fit.

This prevents feature bloat, and prevents your users from asking questions like *what does this button do ?*

#### An app store for your convenience

Opipgno uses the App format to package all its functionality (that doesn't ship with the core). This means even beginners can easily extend their platform by using our pre-packaged functionality.

### And much more

Gosh, if you're a Drupalista, you already know why this can only be great. And it is.

Go check it out, on the drupal.org [project page](https://drupal.org/project/opigno) or on [www.opigno.org](http://www.opigno.org).