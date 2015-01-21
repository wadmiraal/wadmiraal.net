---
title: "Think Thrice Before Hacking Drupal (core and/or modules)"
description: "Just because Drupal is Open Source and can be adapated to your needs does not mean you must do so. Some stupid, but common mistakes and their solutions."
layout: post
tags:
  - Drupal
  - Rant
  - Wisdom
---

Companies love Open Source Software. They do. Sure, you might think many think of OSS as buggy, unstable or insecure (and you're right, some do), but more and more companies embrace OSS.

But many don't do so for the right reasons.

They do so because *they can hack the s&%+ out of it to make it fit their every need*.

Same goes with Drupal.

## Think Thrice Before Hacking

I've seen this before. We all have. Drupal sites that got <abbr title="Completely, massively, horribly screwed up">enhanced</abbr> for Company X's needs.

I won't go into details of [why hacking core is a Bad Idea&reg;](https://www.drupal.org/best-practices/do-not-hack-core). That has been covered through and through.

I just want to ramble a bit about the sort of hacks I come accross and **how these could be very, very easily avoided**, or, when really necessary, **how you can transfer the burden of maintaing the hack to the Drupal core/module maintainer(s)**. 

*Note: if you're a seasoned Drupal developer, this will be stupidly obvious to you. Nothing new here.*

### Think Once: Why Do I Want To Hack This Line ?

**Why** do you want to change this line of code ? 

Don't you like the way it is written ? Is the form using a label you don't like (&ldquo;Save settings&rdquo; instead of &ldquo;Save configuration&rdquo;) ? Do you want this to be encapsulated in `<em>` instead of `<strong>` ?

Is this small thing worth the tremendous pain and efforts of hacking core and keeping the site up to date ? Are you being nitpicky ?

In many situations, you can just live with it. It might take some getting used to, but in the end you won't even notice the problem anymore.

However, if The Client is breathing down your neck to have this change implemented, you might have to...

### Think Twice: Do I Have To Hack This Line ?

**Do you have to** change this line of code ?

**If it's related to the way stuff &ldquo;looks&rdquo;**, don't you **ever** *dare* hacking core. I'm serious: I'll hunt you down, beat you senseless, spit on your keyboard and scream abuse at you all the way.

*Put it in the theme*, you senseless soul. The theme is there to change the way stuff looks ! That's its sole purpose. CSS provided by modules and Drupal only serve as <abbr title="They usually suck bad enough to bring tears to your eyes">sensible defaults</abbr>. They are *meant* to be overriden. HTML markup can very often be overriden using [templates or theme functions](https://www.drupal.org/node/173880). And if that doesn't work, some CSS wizardry *will*.

**If it's related to the way stuff &ldquo;works&rdquo;**, there's a <abbr title="Completely made up number">90%</abbr> chance you can achieve what you want by writing a simple, custom Drupal module.

I won't go into details here, but there's an **incredible amount of [hooks](https://api.drupal.org/api/drupal/includes!module.inc/group/hooks)** you can implement&thinsp;&mdash;&thinsp;very easily&thinsp;&mdash;&thinsp;to change the way certain aspects of the site behave.

There are even a whole bunch of modules that expose *their own hooks*, allowing you to update stuff that *they* do.

*Read the documentation*. Read the module code, looking for a `[module name].api.php` file. These usually contain information about custom hooks. Look at the `README` file. Make absolutely sure that there's *no way* to change what you want to change without hacking core. And *if* this happens to be the case...

### Think Thrice: Do I Want To Maintain This Junk ?

Now that you have decided to actually go along and *hack core* (there's no redemption down the path you're walking now), you have to stop and think: **Do I want to maintain this hack for every update ?**

Chances are, if you *really* had to hack core, someone else will run into the same situation as you eventually. So why not let the module maintainer (or Drupal core's development team) handle this for you from this point onward ?

There are 2 reasons a maintainer would accept to implement your hack:

1. The modification is justified *as-is* (bug fix, performance update, etc). This should just be part of the module.
2. The modification allows you to customize some small aspect of the module (like a query to a third-party application). In this case, **you will want to update the module and [provide it with its own hook](https://www.drupal.org/node/292)**. After doing this, you can then implement this hook in your own, custom module. Its slightly more work, *but well worth the effort*.

In both cases, you have now *added value* to the code, instead of blindly modifying it. And this can (and should) be contributed back: just go to www.drupal.org, find the appropriate issue queue, open a new bug report or feature request and attach a [patch with your update](https://www.drupal.org/node/707484) to it.

Giving a patch to the maintainer instead of just explaining what should be done is a much more efficient way of getting your modifications accepted.

Once the maintainer decides to implement it, you will be able to happily update your site's code without having to manage custom modifications ! Bug and security fixes will now be hassle-free to apply !

### The Take-away

If you need to remember anything from this rant, it's this:

*Don't ever, ever hack core !* But if you do, *do it in an intelligent manner, make a patch and give it back to the community.*



