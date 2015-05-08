---
title: "8 things I'm going to love about Drupal 8"
description: "Drupal 8 is on its way, and from the looks of it, it's going to be awesome."
layout: post
tags:
  - Drupal
  - PHP
credits:
  - { name: Gary }
---

Drupal 8 is on its way, and from the looks of it, it's going to be awesome.

Its predecessor, Drupal 7, focused a lot on the overall user experience. We all agree that, in many aspects, D7 is a *huge* step forward compared to D6. But it lacked a solid *developer experience*. PHP has evolved enormously over the past few years. There are so many exciting new paradigms and tools out there. But Drupal devs are not able to leverage them fully (yet).

And that's about to change. 

## 8 things *I'm* looking forward to

### 1. "Proudly found elsewhere"
The single most über-awesome aspect is that D8 will rely on many incredible third-party components, like Symfony, Backbone, Twig, etc.

This is a **huge** improvement, because:

* It will greatly increase Drupal adoption, as many devs will be able to use tools they're already familiar with. 
* Cross-pollination is a great way to improve open-source projects.
* Devs will enjoy working on Drupal even more, being able to use great and exciting tools. 

### 2. Where's the config file?
D7 is heavily database dependent. All config **and** content is stored in tables, making it tricky&thinsp;&mdash;&thinsp;read: "a complete nightmare"&thinsp;&mdash;&thinsp;to migrate specific settings, from staging to production for example, or even running unit tests.

The new configuration API will change this. Configuration will now be stored in YAML files! This will make copying, versioning and migrating site settings much, much easier.

*Note: I hope this also implies unit tests will get faster, but I haven't found any info yet.*

### 3. Simply test with PHPUnit\*
D8 will ditch its in-house unit testing framework in favor of the industry-standard PHPUnit. This is a good move, PHPUnit being far more mature and modern. Plus, many great tools exist for PHPUnit, which Drupal devs will now be able to use as well.

I also secretly hope that, in conjunction with the configuration management enhancements, unit tests will be easier to write and **much** faster to run. Currently, it's impractical to use TDD with Drupal, because running a single test can take several minutes...

\* *Drupal pun intended.*

### 4. What a lovely view
One of the most used modules of all time, Views, is coming to core. This is great, because this usually means the module gets a nice cleanup and is enhanced as well. Can you imagine an *enhanced* Views?

### 5. He serves me well
Drupal 8 will become more than a CMS for webpages. It will become a web-services platform. This means data will not necessarily be served as HTML. Changing a few request parameter will output the content in JSON, XML, etc. 

This is superb for mobile application backends. This is superb for single page web apps. This is superb for ...

### 6. Parlez-vous français?
Let's face it: multilingual sites in Drupal is a %#!~$£ pain. It's confusing, unintuitive, complicated and unstable. 

The new multi-language initiative for Drupal will change all this. Huge efforts have been made to enhance this critical aspect in core directly. This is certainly going to be a big improvement.

### 7. Meet Sparky
Drupal 8 will have a killer feature called "in-line editing" (aka the "Spark" initiative). This will allow site editors to edit content *directly on the page*, without having to go to an edit-form. This will be quicker, much more user-friendly, but also will be truly WYSIWYG. The content will be edited in context, and all the "real" CSS will get applied to it in real time. 

### 8. OOP bliss
D8 will include many OOP paradigms and requires PHP 5.3. Although the procedural style from previous versions *does* have its advantages (whatever other devs say), the new approach will make code cleaner, nicely decoupled (if done right) and easily testable.

## I'm all pumped up!
Are you?