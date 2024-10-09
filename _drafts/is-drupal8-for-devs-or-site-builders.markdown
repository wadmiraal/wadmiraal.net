---
title: "Is Drupal 8 for developers or for site builders?"
description: "When Drupal 8 was announced, I was very enthusiastic. Finally, Drupal was coming of age, and with the focus on providing a better DX, it would elevate the overall level of code we as a community produce, and allow us to finally embrace practices like TDD and CI/CD. Yeah, well..."
layout: post
favorite: false
tags:
  - Drupal 8
  - Rant
  - PHP
---

Don't get me wrong: I love Drupal. Sure, colleagues will here me rant about it, probably more often than I should. But I _really_ like Drupal. I love its community, the fact that it's very easy to build a <abbr title="Minimum Viable Product">MVP</abbr> pretty quickly, as well as the wealth of modules that exist in its ecosystem.

Today, version 8.5 is finally out, contrib space is quickly catching up to where Drupal 7 used to be, and we see the community embracing better development practices.

Yet, I cannot help but often feel deeply disappointed about what Drupal 8 has become. I mean, on paper, when D8 was still in the works, there was _so much_ potential! So many great ideas, so many healthy debates! But despite all that, I feel it failed to deliver on the promises made. All the planned DX goodness, all those incredible initiatives, all the expected cross-pollination&hellip; I have the feeling it all fell flat on its face, and we're stuck with something barely superior to our procedural Drupal 7.

Where did we go wrong?

## The &ldquo;let's manage that config!&rdquo; initiative

The <abbr title="Configuration Management Initiative">CMI</abbr> was one of the initiatives I was most excited about. Finally, a standard, simple, and elegant way to manage our site's configuration. No longer will we need to store our configuration along our content in the database. Finally, we will have a format that is both easy for humans _and_ machines to understand and manipulate. _Finally_, we will be able to ship with good, elegant, versionnable, and reproducible configuration directives.

Except we don't. [Configuration is still stored in the database](https://www.drupal.org/node/2241059) (apparently for performance and security reasons, claims I find dubious at best). We _do_ now have a better way to export/import our configuration, but nothing really that [Features](https://www.drupal.org/project/features) didn't already handle up to now. Agreed, the format in Features wasn't as _elegant_ as using YAML files, but it sure was a lot more _manageable_ in terms of managing _partial_ configuration (only export/import the config you need), as well as managing _overrides_. Drupal's configuration management is nowhere near that without contrib.

Another **big** issue I have with Drupal 8's configuration management is that _they're not designed to be edited by hand_. What?? Why on earth would you choose YAML then?? Why the whole debate about the _human_-readable aspect of config? The only way to define a custom content type for a module, for example, is to:

1. Install a Drupal site.
2. Go through the config, create your content type, define the fields, etc.
3. Go to the configuration export page.
4. Export **all** necessary parts (which is 1 for the content type, 2 per field, and at least 1 for the form display).
5. Remove those UUIDs, and commit to your module's code.

Need to update something? Good luck finding the documentation explaining how the exported configuration works! And you're not supposed to edit them by hand anyway. Just install the module, update your content type via the UI, and export the config again.

That's _crazy_! And if you want to use practices like TDD, it's even worse! You cannot focus on small units of logic; you need a working Drupal site and UI just to define part of what will be&mdash;for all intents and purposes&mdash;_source code_. I'd much rather go back to the days of Drupal 7's [`hook_node_info()`](https://api.drupal.org/api/drupal/modules%21node%21node.api.php/function/hook_node_info/7.x).

## The &ldquo;let's make everything a webservice!&rdquo; initiative

When [originally announced](https://www.garfieldtech.com/blog/web-services-initiative), it was very clear that the <abbr title="Web Services and Context Core Initiative">WSCCI</abbr> was going to be a _major_ game changer. Drupal was going to make a transition from a monolithic CMS built for displaying web pages, to a webservice endpoint which could serve data in a variety of formats, _including_ HTML, based on the request headers. Every request handled by Drupal would be treated as a webservice request, paving the way for a whole new paradigm and market.

Except, it didn't. Mainly because webservices in core are&mdash;as far as I'm concerned&mdash;a _slapped-on afterthought_. They're hardly usable out-of-the-box, exposing a difficult-to-use data structure. It's not even using Drupal's routing system (it sits at a whole different level in its architecture), resulting in some of Drupal's context driven functionality (like content translation) being unaccessible via the core REST APIs. Furthermore, there's no &ldquo;easy&rdquo; way to even _enable them_. At the time of writing, the [_official_ instructions](https://www.drupal.org/docs/8/api/restful-web-services-api/restful-web-services-api-overview) to enable REST API endpoints is to use a _contrib module_ (unless you use Views, but that only enables _read_ endpoints). 

To further drive my point home, please take a moment to appreciate the fact that both Acquia and Lullabot have built a _competing_ REST API solution ([JSON API](https://www.drupal.org/project/jsonapi)) which not only _does not use_ Drupal's RESTful Web Services API (it _does_ use Drupal's routing system), but also completely ditches all of its concepts.

That's no different than the Drupal 7 days, when we relied on contrib to provide such functionality.

## The &ldquo;let's start using TDD!&rdquo; initiative

During Drupal 8 development, the decision was made to ditch the in-house Simpletest framework, and replace it with PHP's de-facto standard PHPUnit. Furthermore, before Drupal 8 development was even started, [Dries announced](https://dri.es/embracing-test-driven-development) the community's desire to adopt <abbr title="Test Driven Development">TDD</abbr> (side note: his definition of TDD in _that_ particular post is not at all in accordance with what most other developers understand whan talking about TDD). 

This was probably _the number one reason I was excited about Drupal 8._ As you may have noticed from previous posts, I'm a big fan of automated testing in general, and _especially_ of TDD practices.

So it should be no surprise that this was where I felt most let down.

I won't rant too much about this point. You can check previous posts for more of that. But suffice to say that adopting a better tool doesn't mean anything _unless you adopt a different mindset too_. To be fair, the Drupal community seems to slowly start coming to terms with better testing practices. Unfortunately, it's _Drupal's architecture itself_, allong with deeply-entrenched, year-long-forced-upon-us &ldquo;bad&rdquo; practices that make it hard to switch to better development practices.

In fact, many online examples use the same practices for testing in Drupal 8 as we used in Drupal 7.

## So where's my promised &ldquo;better DX&rdquo;?

If the &ldquo;better DX&rdquo; is limited by the addition of a <abbr title="Dependency Injection">DI</abbr> container, YAML, and OOP, than I beg to differ.

