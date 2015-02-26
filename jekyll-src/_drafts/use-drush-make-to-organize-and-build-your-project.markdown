---
title: "Use drush make to organize and build your project"
description: "Be it small or large sites, it is oftentimes difficult to know how to manage your site code base: versioning, where to keep third-party modules (in your Git repo or not, or Git submodules), etc. Drush make makes all of this a breeze."
layout: post
tags:
  - Drupal
  - Wisdom
---

How do you maintain your site code-base? Do you activate notification for updates, and when a new version comes out you simply FTP it to your server? How 2002. Or do you put the whole shebang inside a Git repo, pushing, merging and pulling the entire code-base regularly? Doesn't that seem like overkill? And how do you keep track of applied patches? Do you keep a list of them and try to re-apply them on each update by hand? How's your sanity doing today?

Luckily for us, there's a very elegant solution to the above (and many more) issues. It's called `drush make`.

## What Is Drush Make

Drush ships with a `make` command. This command allows you to provide a `.make` file, which contains information about what Drupal core you want, which third-party modules and themes, their versions, etc. Even libraries can be downloaded by Drush.

`drush make` is what Drupal.org uses behind the scenes to build Drupal <abbr title="A distribution is Drupal with a flavor. Commerce Kickstart, Opigno LMS and Open Atrium are all examples of Drupal distributions">distributions</abbr>. The idea is very simple. You describe exactly how you want your codebase to be, and Drush makes it a reality.

## Why Using Drush Make Is Good

Gosh, where do I start?

First, I would say it plays very well with version control. You often hear the question of whether you should check in all Drupal code in a repo, or manage a parent repo with Git submodules. Let me tell you from experience that both are overkill and hard to maintain. It is *much* easier to only check-in a single `.make` file and only version that.

Second, you might have patches applied to your code. Of course, [you should never hack core], but sometimes third-party modules or themes are slow to correct a bug, and you want it fixed ASAP. That's where patch maintenance comes in. You can simply give Drush a list of patches to apply to a module or theme (or even core), and he will. The patch can either be a local file (checked in with your `.make` file, for example) or fetched online (like in a issue queue on Drupal.org).

Third, it makes replicating the site much easier. Say you wish to test an update, or a newer version of a module. You can simply update your `.make` file, build it, and do your tests. When satisfied, you can update the code in production.

Finally, it is a very handy place for newcomers to start learning about the project. The `.make` file will list all used modules, themes and libraries, as well as their exact version. It makes documenting the project code-base.

## How To Get Started

First, [install Drush](). You can test Drush is correctly installed by calling:

    drush status

Next, create a file that will represent your project. The convention is to put a `.make` extension. I recommend this; it will make it obvious what the file is for. If you are going to use Git, I would put this at the root of a new, empty repo, along with a README file with some simple instructions:

    project/
        .git/
        .gitignore
        project.make
        REAMDE.txt

Now, here's a sample `.make` file content. I'll go over each line later:

<pre><code class="language-php">
api = 2

core = 7.x

</code></pre>

Lets go over each of these.

<pre><code class="language-php">
api = 2
</code></pre>

This lets us specify which version of `drush make` we target. The current is `2`.

