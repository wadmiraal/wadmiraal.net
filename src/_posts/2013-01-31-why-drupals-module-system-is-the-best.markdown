---
title: "Why Drupal's module system rocks"
description: "Drupal has a pluggable, intuitive and flexible module system, which cleanly structures logic."
layout: post
tags:
  - Drupal
  - PHP
  - For lolz
---
Just a quicky.

More often than not, when activating or developing new modules for Drupal, I'm amazed at this seemingly simple, yet powerful system.

All module code is contained in their own, separate folder. You *rarely* have to touch other filer to enable a module. This might sound like a &ldquo;duh&rdquo; point to make, but you'd be surprised at how many modern day frameworks still make you copy/paste snippets of code to activate new plugins. It's a very clean approach, and makes module code very portable. A module folder can even be moved to another location. After clearing Drupal's cache, your site will happily continue functioning, as if nothing ever happened. There are no hard-coded include paths.

This gives you the ability to drag-and-drop (literally if you use FTP) new code to your install, only ticking of a checkbox on the backend to enable it. All the UIs, the logic, etc of the new module is contained in this small folder, completely separated from the rest.

What's really cool is that Drupal core itself is built around this principle. Most of core functionality is also located inside self-contained modules. The entire framework is build around a set of loosely coupled components, that *can* interact with each other, but don't *have* to. So each component is a &ldquo;stand-alone&rdquo;, maintainable, easily-testable unit of code. That's why Drupal is very stable and secure. And cool. [And our framework of choice](/lore/2013/01/07/curse-you-drupal/).