---
title: Introducing Herald CI
description: "Lately I've been working on a personal project: a Drupal-powered CI."
layout: post
tags:
 - Drupal
 - Open Source
---

For the past few weeks, I've been working on a new side project: [Herald](http://ci.heraldci.org/).

The reason behind this was my frustration with unclean, unprofessional code. I work on code-bases written by many different people, some of who produced horrible, undocumented code, with no consistent styling or standard whatsoever (I mean, *one-space indentations??* Or *indenting a whole PHP file??*)

I checked Jenkins and others, but obviously these (great) products are made to cater many different frameworks and languages. And I thought:

> Wouldn't it be cool to have a Drupal-specific system, simple and straightforward to install and use, so teams can start producing quality code?

So, I started Herald. Herald is a suite of Drupal modules (source available [here](https://www.drupal.org/project/herald)), backed by a Drupal theme called [Tabard](https://www.drupal.org/sandbox/wadmiraal/2468067).

## Why another product

Why not? New products come out every day. I searched for a Drupal-specific tool, but couldn't find any. Even no free, open source tools. I did stumble upon [Review Driven](http://reviewdriven.com/), but it looks dead, and I didn't really like the logic of it.

Of course, Herald doesn't re-invent the wheel completely. It's goal is to build upon existing technology and projects, and simply group it all together in an easy to use, straightforward package.

For example, Herald can check Drupal coding standards. It simply uses [Coder](https://www.drupal.org/project/coder) to achieve this. Same goes for checking CSS or JS syntax: it uses [CSSLint](https://github.com/CSSLint/csslint) and [ESLint](http://eslint.org/), respectively (aligning itself with tools that Drupal 8 encourages developers to use).

## How it works

Herald is split up into small, modular components. At it's core lies the Herald Core module. This module provides a simple but flexible API for managing *projects*, *builds* and *tasks*.

A *project* is typically a Drupal module or theme (or even distribution). It has some basic settings, like what kind of tasks to run on each build.

A *build* is, just as for other CI systems, a specific point in the project history (usually a commit in the CVS). Herald provides a flexible API to get these builds, and out-of-the-box, it can create builds from private Git repositories (through a webhook) and build from Drupal.org repositories (regularly pulling code).

As soon as a *build* is registered (&ldquo;created&rdquo;), *tasks* can be registered. Each registered *task* is then queued, waiting for Herald Core to execute it.

Herald ships with several submodules:

### Task runners

* *Herald Drupal Code Standards*: makes sure code respects the [Drupal Coding Standards](https://www.drupal.org/coding-standards).
* *Herald CSSLint*: makes sure CSS files respect a given standard (defaults to the [D8 standard](https://www.drupal.org/node/1887918)).
* *Herald ESLint*: makes sure JS files respect a given standard (defaults to the [D8 standard](https://www.drupal.org/node/1955232)).

### Build systems

* *Herald Drupal.org Git Integration*: regularly pull new code from Drupal.org repositories (Drupal.org currently has no support for Git hooks).
* *Herald Private Git Integration*: react on a URL callback, usable with Git hooks, allowing new builds to be created on a Git push.

### Misc

* *Herald UI*: Provides integration with [Chart.js](http://www.chartjs.org/) to provide some nice widgets.
* *Herald Simpletest*: A hidden module (for now), which can run unit tests inside a [Docker](https://www.docker.com/) container.

## How to use it

**First, please understand this is under heavy development!** It is not yet fully stable, and I recommend only using it on internal servers, not servers that are accessible to the public.

Simply [install Drupal 7.x](https://www.drupal.org/documentation/install) and [Herald](https://www.drupal.org/documentation/install/modules-themes/modules-7) (and its dependencies), just as any other site and module.

If you want to use the provided build systems, make sure you [install Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git) on your server.

If you want to use CSSLint, install [NodeJS](https://nodejs.org/), after which you can install [CSSLint](https://github.com/CSSLint/csslint/wiki/Command-line-interface#running-on-nodejs).

If you want to use ESLint, install [NodeJS](https://nodejs.org/), after which you can install [ESLint](https://github.com/eslint/eslint#installation).

The Simpletest runner is **not ready for production yet**, and could pose **security risks** if not used properly! That is why it can only be enabled through the command line, via [Drush](http://www.drush.org/en/master/) (`drush en herald_simpletest`). If you wish to use the Simpletest runner, you need to install [Docker](https://www.docker.com/).

If you wish to use the nice charts and widgets, enable Herald UI. To do this, download the [Libraries API](https://www.drupal.org/project/libraries) module. Next, download [Chart.js](http://www.chartjs.org/) and put it under `sites/all/libraries/Chart.js/`.

## Calling contributors

If you think this sounds like a good idea and you want to see it evolve, please [contribute](https://www.drupal.org/project/issues/herald?categories=All) to the project. You can [contact me](https://www.drupal.org/user/440510/contact), or [follow me on Twitter](https://twitter.com/wadmiraal) and DM me there. Herald is still in its infancy, and will require a lot of love to grow to something awesome. If you've used projects like [Aegir](http://www.aegirproject.org/) before, you know how awesome Drupal-powered systems can be.

