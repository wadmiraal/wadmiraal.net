---
title: "Backbone is no framework (IMHO)"
description: "Discussions rage online on wether Backbone is a MVC, MV*, etc, framework. Where, in my opinion, it's not a framework at all."
layout: post
tags:
  - Javascript
  - Code
  - Rant
---

Today is the end of the world, so let me quickly put this post together before I bury myself in a bunker with my wife, our 3 animals and some canned food, with no \*gulp\* internet connection.

There's a lot of talking/arguing around Backbone wether it's an MVC, an MVP, MV\*, MP3, whatever-framework.

I'm no expert when it comes to Backbone. I've only been using it for 2 projects, but I already have a strong feeling about what it is &mdash; to me.

## Backbone is a library

An awesome, a**-kicking library. It's a joy to work with (I'm not kidding). It's such a refreshing breeze in this sometimes confusing JS world.

## You serious ?

Yes.

### Think about it

What is a framework ? What is a library ?

To me, a **framework** imposes a certain structure, or pattern, to your code. That's the whole point.

It encourages a set of standards and best practices, so code becomes easier to maintain for *yourself*, but also for *others*.

This can (and should, IMO) go pretty far. Most frameworks even give a certain directory structure. This is important, so other developers can quickly find their way around your code.

**This is a good thing.**

A **library**, on the other hand, imposes next to nothing. It serves as a set of components, or *helpers*, that provide functionality you don't want to bother coding yourself.

Outside of the Javascript world, Symfony is a perfect example of this.

You have the Symfony *Components*, which is a library of loosely coupled components, each providing a specific functionality. You can use any component, seperately, and it will perfectly fit in your project. You can place it in any folder you want, call it where you want, etc. It imposes nothing to your code. Think of it as jQuery. You can include jQuery, but only use it's selector engine. You don't have to use it's AJAX library or event library. You could use, say, Prototype for that.

On the other hand, you also have the Symfony *Framework*, which does impose (or, actually, *encourages*) a certain structure and pattern to your code. It provides a directory structure, a specific location for your configuration, a &ldquo;strict&rdquo; standard for coding your Controllers, etc.

### What Backbone provides

Backbone provides Views, Models + Collections, Events and Router functionality. Awesome.

But think about it.

What structure does Backbone impose to your code ?

You could just use the (awesome) Model and Collection components, and ignore the rest. You could only use the Router to register some custom callbacks. All of them use the Events, obviously, but that's an added feature. It does hardly justify calling it a framework.

The only part if it that *could* make it a framework is the View, which glues all the other components together. But it doesn't *have* to. It can also be used stand-alone.

But I just don't think that's enough.

The beauty of Backbone is that it provides a set of components with which you can *make* a framework of your own.

## Final rant

In my eyes, the guys at DocumentCloud have made a beautiful **library**, a great gift to the JS community. It Rocks. You guys at DocumentCloud **rock**!

It's because of this *library* aspect that trying to squash it into a MV\* pattern is so difficult (read: *&ldquo;impossible&rdquo;*).

So, dear fellow devs, my brethren: let us not fight over this.

Let us all embrace the actual truth:
> It's a library, duh !


