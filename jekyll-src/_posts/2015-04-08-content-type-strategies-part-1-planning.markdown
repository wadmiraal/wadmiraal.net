---
title: "Content Type Strategies: planning, naming things, field reuse and DRY theming"
description: "Creating and maintaining content types in Drupal can be a challenge and get overwhelming. Here are a few tips based on my experience."
layout: post
tags:
- Wisdom
- Drupal
---

When you first start creating your own content types in Drupal, it's like being a kid in a candy store. All of a sudden, there's a world of possibilities opening up in front of you. However, as projects drag on, your carefully crafted content types can become an unmaintainable mess. Here are a few tips on how to make most out of your content type strategy.

*Sidenote: this also relates to my previous posts about keeping things intuitive for your site editors. You can read these past posts here: [part 1](/lore/2015/03/11/take-your-editors-ux-to-the-next-level-part-1/), [part 2](/lore/2015/03/18/take-your-editors-ux-to-the-next-level-part-2/).*

## Naming Things Is Hard

The first thing you need to get right is the content type name. This might seem like an obvious point, but it's easy to start creating content types and assuming they will be used a certain way, only to find out the client or content managers have a very different vision. This is why you see projects where `blog` content types are used for Newsletters, or `pages` for a News section, or `forum_topics` as Blog posts. Sure, the human readable name may be coherent. But the machine name is not. And this will come back and bite you in the future.

The second thing you need to carefully consider are the field names. Sure, changing the label is easy. But the machine name, here again, is not. And 6 months down the road, when debugging a custom module that deals with content fields, you'll curse yourself for not remembering why that stupid `field_email` contains a phone number.

*Sidenote: If fields are created through the UI, they will be prefixed with `field_`, not because they are fields (that would be dumb), but because they belong to the Field module. However, if you define your custom content types through code (you should; more on that in another post), you can name them whatever you wish. A great idea is to prefix these fields with the name of your module (`mymodule_`), or the name of the content type (`type_`). That way, they are easily recognizable when debugging.*

This leads us to...

## Planning

To correctly name things, it's a good idea to sit down with the people that will eventually manage the content and discuss what *kind* of content will be managed and how each thing should be named. This also applies to the help text. Each content type and field has a description field for help. Do not underestimate the power of this description field. Remember: the best documentation is the one you do not even have to write. If your content type forms are intuitive and self-explanatory, all the better for you.

In [this episode of Ctrl-Click-Cast](http://ctrlclickcast.com/episodes/build-planning-for-cmss), Emily and Lea talk about planning a CMS build. They go as far as to plan *everything* in advance, writing down all the content types, field names, etc. This gives them a guide when actually starting to build the content types, which saves them time and allows them to be highly effective about it.

## Field Reuse

Sometimes, fields are not tied to a specific content type. For example, multiple content types might have a picture gallery, or taxonomy field. There are 2 approaches to this:

1. You create identical fields for each content type (remember: name them coherently)
2. You create a generic field and reuse it

The first is easiest and gives the most flexibility, but requires more work. The second approach can speed up your theming and make maintenance easier, at the cost of flexibility. Let's take the picture gallery, for example.

If multiple content types have a picture gallery, there's a good chance these galleries behave the same way. Perhaps they have the same limit of images, the same fields (alt, title, description,  etc). Furthermore, you will probably use the same widget to display these images.

If you have multiple fields, you will have to maintain different settings and code different templates. Sure, you can create a template and use some clever preprocessing to keep your code DRY (you should). But a much easier approach is to use the same field and apply the theming logic on the field, instead of the content type.

For example, if you have a field called `field_picture_gallery`, you could create a template called `field--field_picture_gallery.tpl.php`, which will be used to render your widget.

Now, you not only have a DRY code base, you also have a great, reusable component for any future content types, or any other entity, for that matter (like user profiles, products in Drupal Commerce, etc).

And if you wish to render this field differently in the context of a specific content type, you can create a content-type-specific template, like so: `field--field_picture_gallery--content_type.tpl.php`.

## Wrapping Up

There are many aspects that can lead to content type mayhem. Projects evolve, sites change, etc. But, if you can at least make sure that when the site launches, everything is fine and dandy, you will make sure the whole thing is maintainable, easier to debug and probably self-documenting enough for you to drastically cut down support time. And that is invaluable to any agency or freelancer.

In a next post, I'll explain how you can &ldquo;easily&rdquo; maintain those content types in code. This allows you to keep that configuration in a Git repository and version it, which is also highly important for long-term maintenance.
