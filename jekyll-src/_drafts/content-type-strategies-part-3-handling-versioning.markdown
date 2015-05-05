---
title: "Content Type Strategies: handling versioning"
description: "Maintaining content types and handling versioning can be a challenge and get overwhelming. Here are a few tips to handle updates and changes."
layout: post
tags:
- Wisdom
- Drupal
---

As [we saw before](), maintaining content types is an important aspect of any Drupal project. Now that [we know how to define them in code](), let's dive into one of the more serious parts: handling updates and versioning.

I will be using the same example as in [part 2]().

## Scenarios and caveats

There are multiple scenarios we can think of when it comes to changing content types. The easiest is adding a new field, while making sure all our content gets a default value assigned. Another is changing a multi-value field to a single-value field (or a no-limit field to a field with a limit). This one takes some planning, because: *what do we do with the data?* Do we delete the instances that are over our new limit? Do we combine them? Do we want to keep a backup in the database, just in case? Another challenge is changing the field type completely. For example, we might want to change a previous *text* field to a *number* field. This requires updating all field instances as well.

Updating all field instances is potentially a heavy task. If your site has a dozen nodes of this content type, you might get away with doing everything in one go. But if you have hundreds or thousands, we need to do this in a batch. Luckily, Drupal provides us with all the tools we need.

## Registering an update

You've probably updated Drupal before. You upload (or whatever) the new code to the server, and navigate to `/update.php`. Drupal will then tell you if there are any updates pending or not. For your module to tell Drupal it requires an update, we simply implement a special hook: [`hook_update_N()`]().

When you first enable a module, Drupal will look for any `hook_update_N()` function in the `.install`  file, take the highest one and store it as the current &ldquo;schema version&rdquo; (if it doesn't find one, it simply stores *hook_update_7000*). When a new version of the module is uploaded, and the `/update.php` page visited, Drupal will start looking for a `hook_schema_N()` function with a *higher* value than the one stored. If it finds one (or more), it will tell the site administrator an update is pending. When the site administrator launches the updates, Drupal will call these functions in sequence. At the end, it will store the name of the last one executed.

The naming schema for these `hook_update_N()` functions should be `hook_update_{core}{major version}{minor version}()`. So, if your module is at version 7.x-1.2, the corresponding function is `hook_update_7102()`. However, in practice, many module maintainers (me included) simply start at `hook_update_7000()` and increment by 1 for each update. This is much simpler, and works because Drupal doesn't look at the version in your `.info` file. It just checks them all in sequence.

### Update hooks and a clean install

It is a common misconception that Drupal will run update hooks on a clean install. When you install a module for the first time, even if this module *has* update hooks, Drupal will *not* invoke them. It will simply look for the update hook with the highest value and store *that* as the current &ldquo;schema version&rdquo;. This means, you cannot simply leave old code in your module and think Drupal will update it for you. In our case, we will need to update our content type definition in our update hooks *and* in the `includes/mymodule.node_types.inc` file.

## Adding a new field

## Add a new limit to our image field

### Cleanup old data

### Keep a full copy of the previous data

## Change our text list to a number list

