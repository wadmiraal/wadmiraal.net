---
title: "10 Quick Tips For Drupal Developers"
description: "10 quick tips for Drupal developers, based on my 6 year long experience."
layout: post
favorite: false
tags:
  - Wisdom
  - Code
  - Drupal
---

You may have started developing Drupal platforms recently, or you may even have been doing so for a few years. Even after 6 years, I still learn about Drupal almost every day. It's such a vast and rich platform, it's hard to know everything.

Over these years I've accumulated some &ldquo;experience&rdquo; regarding module development. I've created over 20 modules on www.drupal.org (many are now maintained by others, though) and gaining [permission to create full projects](https://www.drupal.org/node/1011698) (previously called &ldquo;getting CVS access&rdquo;) has thaught me incredibly valuable lessons.

## 1. Use Git

First and foremost, no matter how small the project, use a <abbr title="Concurrent Versioning System">CVS</abbr>. If your project is private, checkout [Bitbucket](bitbucket.org/). They have an incredible tool, on par with what Github offers, except you get private repos for free.

And I am meaning **Git**, not Mercurial, not Subversion, but Git. This is not to say these tools are no good (well, Subversion *is* no good), but the Drupal community uses Git extensively. This will make it much easier to manage your project.

## 2. Respect Drupal Coding Standards

I can't stress this enough, and burn myself with this a lot too.

The [Drupal Coding Standards](https://www.drupal.org/coding-standards) ensure any developer coming on a project can easily find her way around. It makes for consistent, well written code.

Even if you might have a different style of writing code, you're now working on a Drupal project. You may not always be the only one managing it. Following these standards will make your life, and the life of others, much easier in the long run.

There are [tools](https://www.drupal.org/node/1419980) that allow you to analyze your code and warn you about errors. It's very helpful.

You can even take it to the next level and [enable a Git pre-commit hook](/lore/2014/07/14/how-git-hooks-made-me-a-better-and-more-lovable-developer/) that will warn you about coding standard violations.

## 3. Split Your Code In Chunks

This is an error we make a lot when starting writing Drupal modules: we put all our code in our ``.module`` file. It's worthy to note that **all** ``.module`` files are loaded for **every page request**. If your file is only a few hundred lines (including comments), that might be ok. But if your file is thousands of lines long, most of it probably used on only several pages, it's time to split it in smaller, manageable chunks.

One popular pattern in the Drupal community is to have specific files:

* ``[my module name].admin.inc``: administration logic, settings, configuration forms
* ``[my module name].pages.inc``: page callbacks, module forms

Some modules allow you to put their API implementation in specific files. For example (this does not work for all modules exposing an API, though - see [hook_hook_info](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_hook_info/7)):

* ``[my module name].rules.inc``: contains the [Rules](https://www.drupal.org/project/rules) API implementation
* ``[my module name].views.inc``: contains the [Views](https://www.drupal.org/project/views) API implementation
* ``[my module name].token.inc``: contains the [Token](https://www.drupal.org/project/token) API implementation

Another huge benefit is that it makes your code easier to scan through. If you follow this pattern, other developers will immediately know where to look for certain information, instead of scrolling through a +10000 lines long ``.module`` file.

### A Word Of Caution

This is not to mean you must split **everything** in different files. Loading a new file has a performance impact. If a hook (or function) is called very often, it might be better to leave it in the ``.module`` file, even if it's very large.

## 4. Know Your Hooks

[If you're not killing kittens](https://www.drupal.org/best-practices/do-not-hack-core) while working on your Drupal project, you probably already know about the wealth of [hooks](https://api.drupal.org/api/drupal/includes%21module.inc/group/hooks/7) available to us.

However, there's a difference about knowing what a hook is for, and how it actually works. When looking at the documentation for a hook (on [api.drupal.org](https://api.drupal.org)), it's sometimes worth the detour to click on the &ldquo;Invocation of [hook name]&rdquo; link under *Related Topics* (which comes after the main function/hook documentation body).

This will show you exactly when and where the hook is invoked, giving you a better and deaper understanding of what Drupal is doing behind the scenes. This knowledge can help you make better design decisions, or opt for a different hook for the same job (for instance, do you know the difference between [hook_boot](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_boot/7) and [hook_init](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_init/7) ?)

## 5. Make Your Output Themeable

If our module provides output (lists of items, elements, any markup really), you want to implement [hook_theme](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_theme/7).

Always, always make your output themeable. Even if the module is only used on one single project.

Making output themeable will allow you to override it cleanly from the [theme layer](https://www.drupal.org/documentation/theme). A module should never provide too much styling. It must focus on functionality and stability.

If you can, output your markup through templates. Templates are awesome: themes can override them with their own, allowing full customization. [This is how Drupal core does it](https://www.drupal.org/node/190815). You may say that is has a performance cost (and [you'd be right](https://www.drupal.org/node/173880)), but usually it's well worth it.

## 6. Use Views

Many times, our module displays some kind of output, listing nodes, users or other entities.

It's a great idea to provide a default [View](https://www.drupal.org/project/views) that will do this, instead of writing a function from scratch. Using Views will allow site owners to customize the output to suite their needs through the interface, without altering your code.

Plus, if you don't need to write custom handlers, you can just create a View through the UI and export it to PHP code, which you then ship with your module: super easy. This is even more usefull when used in conjunction with [Views Bulk Operations](https://www.drupal.org/project/views_bulk_operations), which is an incredibly powerful module to construct admin interfaces.

## 7. Write Unit Tests

Go talk to [Chris Hartjes](https://twitter.com/grmpyprogrammer) for this one.

Know that writing Drupal tests is slow and nerve-breaking if you don't **plan ahead**. So save yourself a lot of trouble and plan your scenarios and functions before writing them.

### Pro tip

I'll write about this in a future post, but look for inspiration in [functional programming](http://en.wikipedia.org/wiki/Functional_programming) when writing testable Drupal code. Write functions that don't change the state of the system and rely on the Drupal framework as little as possible.

&ldquo;What's the point of using Drupal then ?&rdquo;, you may ask. Well that's where the planning and genius comes into play. But I'll come back to that another day.

## 8. Proudly Found Elsewhere

If you want a functionality, there's a fair chance someone has already written a module for it. Or at least a module that does much of what you need.

Don't hesitate to use these modules, using hooks to make them fit your needs (**[don't hack them](/lore/2014/06/26/think-thrice-before-hacking-core-or-contrib/)**). Or only load their files and re-use certain of their functions.

It may seem odd, but it will make your code more maintainable and lightweight.

## 9. Respect Core

We don't always understand why Drupal does some things in certain ways. This might make us sneer in contempt. However, know that Drupal was built by a bunch of incredibly talented and passionate people. Sure, they make mistakes too. And PHP evolves very fast, so some used paradigms are outdated. But if you don't understand/like a particular aspect, take some time to dig deeper. 

Go through issue queues, commit logs. Google it. You may be surprised at what you find. You will probably enjoy working with Drupal a little more. And maybe even learn something.

## 10. Use Drupal Development Conventions For Branching And Tagging

Drupal has a [convention for branching and tagging](https://www.drupal.org/node/1015226) in Git. Although it might not suite your project needs entirely, it may be a good idea to stick to its principles. For example:

* Don't use the master branch
* Use the following pattern for your main branches: ``[Drupal compatibility].x-[Major version].x`` (example: ``7.x-2.x``). This denotes clearly for which version of Drupal this is intended, and which version of your module you're talking about.
* Use the following pattern for tagging releases: ``[Drupal compatibility].x-[Major version].[Minor version]`` (example: ``7.x-2.11``).

If any other Drupal developer joins the project, it will immediately be obvious what is what.

Note, however, that there's a [hefty discussion going on](https://www.drupal.org/node/1612910) about changing this pattern (which would make sense).

## 11. Never Stop Learning (gotcha)

[This one goes to eleven](https://www.youtube.com/watch?v=N3L4EZwmRrA).

There's so much to learn about Drupal. Coding, performance, scalability, flexibility, you name it. Check out blogs like [Lullabot's](http://www.lullabot.com/blog), [Pantheon's](https://www.getpantheon.com/blog), [Modules Unraveled](https://modulesunraveled.com/blog) and many more.

Read through function and hook definitions on [api.drupal.org](https://api.drupal.org). The documentation is incredibly well done, one of the best for any Open Source project in the world. You can learn so much just from reading through it.

And keep in touch with the community. They're utterly worth it.

