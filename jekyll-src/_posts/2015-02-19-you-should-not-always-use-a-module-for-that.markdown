---
title: "You should not always use a module for that"
description: "We have a saying in the Drupal community: there's a module for that. Allow me to challenge that idea."
layout: post
tags:
  - Drupal
  - Wisdom
---

If you've been using Drupal for some time, you know there's a saying in the community:

> There's a module for that

The idea is that, if you need something, there's a good chance someone has already written a module for it. Which saves you the trouble of writing it.

However, allow me to challenge that idea.

## It's All About Trade Offs

In most cases, there is a true advantage in using an existing module:

* It saves development time.
* It (usually) saves debugging time, as the module is tried and tested.
* It is (usually) more secure, for the same reasons.

However, something you might *not* immediately realize is there's often a price in *performance*.

Modules that provide some functionality may offer many settings to accommodate different use cases. These settings have to be computed at run time. This has a performance cost.

Some may offer more functionality than you actually need. This also has a performance cost.

Finally, not all modules are created equal. Even a well written module may not have been designed for large sites (for instance, only relatively few modules leverage Drupal's [caching API](https://www.drupal.org/node/145279)). The module may behave well on small sites, but become a real problem on traffic-heavy sites.

Now on your average site, even under heavy *anonymous* traffic, this might not be an issue. Drupal performs very well, even out of the box, when caching is turned on. However, on sites serving hundreds or thousands of *authenticated* users a minute, Drupal's memory usage and page serving time can be *huge*, and you will find yourself trying to squeeze out every possible gram of performance to keep it all under control.

This is when it is time to start auditing your modules and maybe replace some with custom built solutions. The advantage of a custom built module is *you* control it; you can build it to do exactly what you need, and do it very well and very fast. Of course, this requires some advanced knowledge about performance, Drupal coding, security, etc. But I'll assume you have those to make my point.

## Auditing A Module

Sometimes it is very difficult to decide which module to keep and which one to replace. Tools like the [Devel](https://www.drupal.org/project/devel) module can give you insight on SQL queries and some memory statistics. Tools like [New Relic](http://newrelic.com/) can give you a very deep understanding of what is slowing down your site and why.

I suggest first looking for quick wins. Sometimes ditching little modules that do something very simple can already have an impact.

For instance, can you remove the [Google Analytics](https://www.drupal.org/project/google_analytics) module and simply put your tracking code in the theme directly? Many modules only serve to add some JS library to the site (like for an image gallery); can you put this in your theme as well? Or in one of your custom modules that requires it? Maybe you have a module for a feature that is only very rarely used; can you afford to simply deactivate it?

Then, look at the larger ones. [Views](https://www.drupal.org/project/views) or [Rules](https://www.drupal.org/project/rules) are incredibly useful modules, but if they are used in many non-cacheable areas, they can have a big impact.

Rules especially can become wildly uncontrollable. If you are using Rules just because you are too lazy to actually write code (like redirecting a user on creating a new node), please: just take some time and write a simple module. The performance gain can be *huge* percentage wise.

Views is an incredible module&thinsp;&mdash;&thinsp;I love it&thinsp;&mdash;&thinsp;and there's a good reason Drupal 8 will ship with it. However, sometimes Views is just overkill. Although Views is *very* performant, and not usually a bottleneck, sometimes you can get the same result for a fraction of the cost. Especially simple listings of content can be achieved for virtually nothing when custom coded (careful with these node access rights, though). Views has a complex tree of templates and theme callbacks, and for non cacheable content, this can be a big performance hit. However, writing a custom solution allows you to bypass the theme logic and keep things lean and mean.

## Conclusion

Of course, it is as I said: *a trade off*. I'm **not** suggesting you ditch Views or Rules or Google Analytics or any other; I'm saying you use them *wisely*. If your site has issues with performance, than *good for you !* It's a great problem to have, and a sign your site is doing great. Just stay calm and analyze your site performance data. Simply increasing your hardware or VPS capacity can sometimes be a cheap solution. But if you find yourself in a situation where you are considering load-balancing to keep up, I suggest first applying the above and try loosing some extra &ldquo;weight&rdquo;. You might be positively surprised.
