---
title: "Why I don't recommend using Domain Access for a large Drupal project"
description: "For large, multidomain sites that need to share users and content, a common module to use is the Domain Access module. It has some serious drawbacks, though, and here's why."
layout: post
tags:
  - Drupal
  - Wisdom
  - Rant
---

I must first and foremost say I truly respect the maintainers of the [Domain Access](http://drupal.org/project/domain) module. It works as advertised, and works even *extremely* well. And in certain conditions, it is well worth it. But I have found it to be more of a hassle than a help for larger, more demanding projects. And I would have *loved* to know what I know now when these projects started.


## In Short

If the project is maintaining only a few, small sites that are all *very* similar, Domain Access is the way to go.

If the project is maintaining many, large sites, or sites that are all *different*, Domain Access is *not* the way to go. Try using something like [Aegir](http://www.aegirproject.org/) or [Drush](http://drush.ws/) (using the `@sites` alias) to solve some of the common multi-site problems.


## What Is Domain Access ?

For those of you not familiar with the Domain Access module, it basically takes Drupal's [multi-site](https://www.drupal.org/documentation/install/multi-site) capabilities one step further. Running a Drupal multi-site setup is a great idea if you want to host several Drupal sites on the same server, and these sites have similar setups (like same modules, module versions, etc).

A traditional Drupal multi-site setup completely isolates every site from the others, except the code. This allows every site to be completely independent, and for the system administrators to manage only one code-base. Plus, accelerators like [APC](http://php.net/manual/en/book.apc.php) or [OPcache](http://php.net/manual/en/book.opcache.php) will be much more efficient, as they only keep track of one code-base for caching.

It has some drawbacks, though:

* Updates are a problem: you must put **all** sites offline, perform updates for **each one of them in sequence**, and take them all online again after that.
* Content cannot be shared: an &ldquo;About us&rdquo; page might need to be the same on all sites, but you will have to create (and update) it, every single time, for every site.
* Users cannot be shared without some extra planning (but it is possible).
* Settings are not shared.

If you have many sites in a network, and these change often, the above points can quickly cost a team many extra hours of work.

Domain Access solves this by running a multi-site *from a single install*. This means you are actually running *a single site*, but to the outside world, it looks like different sites. This solves the above problems elegantly:

* Updates are easy, *because you are only updating one site*.
* Content is shared, *because it's a single site* (you can choose to publish it only to certain domains, though).
* Users are shared, *because it's a single site* (you can assign users to certain domains so they can't publish/edit nodes on other domains).
* Settings are shared, *because it's a single site* (you can set certain settings&thinsp;&mdash;&thinsp;like Site name&thinsp;&mdash;&thinsp;per domain).

This is absolutely great ! And, believe me, the module works *very* well. It uses Drupal's incredibly flexible framework to get all this done without hacking core. Kudos to that.


## Drawbacks

But there are some serious drawbacks to consider when using Domain Access. And they may not always be clear from the start.

### You start managing exceptions, not rules

Projects evolve. New editors and users get accounts. Interfaces and Views need to change. This is normal. But it becomes a complete mess when you need to change a View that displays one way on +30 domains in the network, but another way on domain A, and yet again differently on domain B.

You start managing *exceptions* to the rules you carefully crafted at the start of the project. Users must now have certain, editorial rights on domain A, but only anonymous rights on domain B (very tricky to get right without custom code). Content types X and Y must be hidden from the "Create content" list on domain C, because editors can't find their way around an ever growing list of content types, many only used on one or two domains.

Managing exceptions to rules instead of just rules is always a path to maintenance nightmare. Human brains can manage exceptions pretty <abbr title="Not !">well</abbr>. But translating them to bug-free code can quickly get *very* complex. I once worked on a large, multi-domain ecommerce site using [Drupal Commerce](https://drupalcommerce.org/) and Domain Access. It was a **nightmare**.


### You start working *around* Drupal, not with it

Domain Access means you are now, all of a sudden, trying to work *around* Drupal core instead of working *with* it. Yes, Drupal is flexible, and its hook system allows Domain Access to beat Drupal into submission &ldquo;cleanly&rdquo;.

But still... You need to beat it *a lot*.

Editors don't have straight-forward permissions anymore to create or edit content. They now have permissions to create or edit content *per domain*. This means hooking into lots of places to enforce these new rules, instead of relying on the Drupal core ones.

To view a simple, published node, Drupal must now invoke the [Node Access API](https://api.drupal.org/api/drupal/modules%21node%21node.module/group/node_access/7) to make sure it's viewable on the current domain. This can add a substantial overhead to every page load (although it should be reasonable on most sites).

Domain customizations, like a different theme for each domain, a different main menu, customizable blocks, etc, add extra overhead to the site. Domain Access (and its submodules) are now hooking into many layers of Drupal's system to change the relevant parts. Each of these on its own has no big impact. But on traffic heavy sites, where you use *many* of these &ldquo;domain&rdquo; customizations, you can add a non-negligible overhead to each page request.

Module settings are not global anymore (or, at least, probably won't be&thinsp;&mdash;&thinsp;you will almost definitely need the Domain Configuration module); they are different per domain. This means the storage/retrieval of these settings now also requires extra overhead.

And so on and so forth. All these add up and can slow down a site considerably.


### Confusion and user unfriendliness

My experience has shown that, for large networks of sites, editors get confused *very fast*.

Node creation forms can get incredibly complex and user unfriendly (and it's not like they were very intuitive in the first place), as the list of domains editors can publish to can be enormous (these domains will show up in an incredibly long list of checkboxes&thinsp;&mdash;&thinsp;you can, and *should*, limit this list in the content type settings). Plus, the distinction between options like &ldquo;Send to all affiliates&rdquo;, &ldquo;Source domain&rdquo; or &ldquo;Publish to [domains]&rdquo; are very difficult to explain to non-technical users (heck, I *still* don't really understand them).

If an editor has to manage content on many domains, the amount of information shown on the &ldquo;Manage content&rdquo; page can be too much to take in (tip: use [Admin Views](https://www.drupal.org/project/admin_views) and [Domain Views](https://www.drupal.org/project/domain_views) together for this).

Errors in publishing (like publishing to the wrong domain) can be tricky to see, as an editor *can* see the content on the desired domain, but an anonymous user cannot.

And let's not forget to mention the *very real risk* of wanting to save a configuration for one domain, but accidentally changing it for the entire network (raise hands everyone who has gone to &ldquo;Site Information&rdquo; to change the site email address, only to mess up the front pages for *all* domains in the network).


### It is very difficult to setup development and staging environments

This, for large and demanding projects, is a *huge* problem. Because the Domain Access module will not easily recognize *dev.domain-1.com* and *www.domain-1.com* as being the same, you will end up with unexpected errors or results. You can use &ldquo;aliases&rdquo;, but it's not optimal, as you must configure your production environment to cater for your development environment. And even if you get aliases right: if an editor makes a mistake when selecting publishing options, you could be redirected to the production platform without noticing it at first on certain nodes. You might unknowingly start tweaking or experimenting certain settings on the live platform !


## Alternative Solutions

Of course, drawbacks are just as real using a traditional multi-site; they are just different, as we saw in the introduction.

Here are a few tips:

* **Sharing configuration** is a pain, but the [Drupal 8 CMI](https://groups.drupal.org/build-systems-change-management/cmi), and the Drupal 7 [Configuration](https://www.drupal.org/project/configuration) module, coupled with the [Features](https://www.drupal.org/project/features) module, allow us to put configuration into files (where it belongs). This alleviates some of the burden of sharing and maintaining configuration across sites.
* **Sharing content** is another problem, but probably worth the effort in regards to all the issues arising with Domain Access and many domains. Modules like [Node Export](https://www.drupal.org/project/node_export) allow editors to copy/paste their content (even complex) across domains, albeit at a cost of learning a new (unfriendly) UI.
* **Managing site updates** is *very* tiresome using a traditional approach, but tools like [Aegir](http://www.aegirproject.org/) or [Dush](http://drush.ws/) (using the `@sites` alias) can help.
* **Sharing users** can be achieved by using table prefixes and a single database for all sites. Or you can use a SSO module that will register accounts on first login. There are many solutions to this one.

## In The End...

... it comes down to what the project is likely to evolve into (or requires upfront).

If the network of domains will grow large (I'd say +5), it will become user unfriendly.

If the sites must be *very* different from one another, Domain Access will start changing Drupal so much it becomes counter productive. Think about *the future* for this point. Things change.

If you require dev/staging/production environments, either plan *very carefully*, or just go for the multi-site approach.
