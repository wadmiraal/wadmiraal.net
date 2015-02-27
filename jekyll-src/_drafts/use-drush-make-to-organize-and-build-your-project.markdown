---
title: "Use drush make to organize and maintain your project"
description: "Be it small or large sites, it is oftentimes difficult to know how to manage your site code base: versioning, where to keep third-party modules (in your Git repo or not, or Git submodules), etc. Drush make makes all of this a breeze."
layout: post
tags:
  - Drupal
  - Wisdom
---

How do you maintain your site code-base? Do you activate notification for updates, and when a new version comes out you simply FTP it to your server? How 2002. Or do you put the whole shebang inside a Git repo, pushing, merging and pulling the entire code-base regularly? Talking about overkill. And how do you keep track of applied patches? Do you keep a list of them in Excel and try to re-apply them on each update by hand? How's your sanity doing today?

Luckily for us, there's a very elegant solution to the above (and many more) issues. It's called `drush make`.

## What Is Drush

If you don't know what [Drush](http://www.drush.org/) is, it stands for DRUpal SHell. It is a command line utility to manage your Drupal sites. I won't go into details about Drush and what it can do: there's **so** much to talk about. Let me just say that, if you don't use Drush, you're missing out. Even if you don't like the command line, don't be scared: Drush is very simple and straight-forward, and can save you hours of work.

## What Is Drush Make

Drush ships with a `make` command. This command allows you to provide a `.make` file (or `.make.yml`, as we'll see next), which contains information about what Drupal core you want, which third-party modules and themes, their versions, etc. Even libraries can be downloaded by Drush.

`drush make` is what Drupal.org uses behind the scenes to build Drupal <abbr title="A distribution is Drupal with a flavor. Commerce Kickstart, Opigno LMS and Open Atrium are all examples of Drupal distributions">distributions</abbr>. The idea is very simple: you describe exactly how you want your codebase to be, and Drush makes it a reality.

### New: Now With YAML!

With the latest version of Drush, following the move of Drupal 8 away from the *INI* format in favor of *YAML*, `.make` files can be (and should, from now on), be written using YAML. The old syntax will still work, though, no worries. If you want to use the new YAML syntax, simply suffix the file with `.make.yml`. If you wish to use the old *INI* syntax, just use `.make`. Many examples you can find online still use the old *INI* format, but as you will see, the instructions are very similar and translate easily from one format to another.

## Why Using Drush Make Is Good

Gosh, where do I start?

First, I would say it plays very well with version control. You often hear the question of whether you should check in all Drupal code in a repo, or manage a parent repo with Git submodules. Let me tell you from experience that both are overkill and hard to maintain. It is *much* easier to check-in a single `.make.yml` file and only version that.

Second, you might have patches applied to your code. Of course, [you should never hack core](/lore/2014/06/26/think-thrice-before-hacking-core-or-contrib/), but sometimes third-party modules or themes are slow to correct a bug, and you want it fixed ASAP. That's where patch maintenance comes in. You can simply give Drush a list of patches to apply to a module or theme (or even core), and he will. The patch can either be a local file (checked in with your `.make.yml` file, for example) or fetched online (like in a issue queue on Drupal.org).

Third, it makes replicating the site much easier. Say you wish to test an update, or a newer version of a module. You can simply update your `.make.yml` file, build it, and do your tests. When satisfied, you can update the code in production.

Finally, it is a very handy place for newcomers to start learning about the project. The `.make.yml` file will list all used modules, themes and libraries, as well as their exact version. It essentially documents the project code-base.

## How To Get Started

First, [install Drush](http://www.drush.org/en/master/install/). You can test Drush is correctly installed by calling:

<pre><code class="language-bash">
drush status
</code></pre>

Next, create a file that will represent your project. This must either be a `.make` file (old *INI* syntax) or `.make.yml` (new *YAML* syntax, recommended). If you are going to use Git (or another CVS), I would put this at the root of a new, empty repo, along with a README file with some simple instructions and a directory for your custom patches:

    project/
        .git/
        patch/
        .gitignore
        project.make.yml
        README.txt

The site will get built in a folder. I like to call this folder `_build/`, and I add it to my `.gitignore` file so I don't have to worry about it.

Now, here's a sample `.make.yml` file example. I'll go over each line later:

<pre><code class="language-php">
api: 2
core: 7.x
projects:
  drupal:
    version: 7.34
  
  ctools:
    subdir: contrib
    patch:
      - https://www.drupal.org/sites/default/files/ctools_patch_6778098_3.patch
      - ./patch/ctools_change-something.patch

  views:
    version: 3.10
    subdir: contrib
  
  zen:
    version: 5.5

  mymodule:
    type: module
    subdir: custom
    download:
      type: git
      url: https://git.bitbucket.org/myname/mymodule.git 
      tag: 1.2

libraries:
  phpexcel:
    download:
      type: get
      url: https://github.com/PHPOffice/PHPExcel/archive/1.8.0.tar.gz
    destination: libraries
    directory_name: PHPExcel
</code></pre>

Lets go over each one of these instructions.

<pre><code class="language-php">
api: 2
</code></pre>

This lets us specify which version of `drush make` we target. The current is `2`. This is required.

<pre><code class="language-php">
core: 7.x
</code></pre>

This lets us specify for which version of Drupal we're building. This is used to download the correct version of Drupal.org projects (as you will see below). This is required.

<pre><code class="language-php">
projects:
</code></pre>

This is will contain all projects, including Drupal core, modules, themes as well as custom modules and/or themes.

<pre><code class="language-php">
  drupal:
    version: 7.34
</code></pre>

This tells Drush to download version 7.34 of Drupal core. *You must at least specify a Drupal core project*.

<pre><code class="language-php">
  ctools:
    subdir: contrib
    patch:
      - https://www.drupal.org/sites/default/files/ctools_patch_6778098_3.patch
      - ./patch/ctools_change-something.patch
</code></pre>


This downloads the latest stable release of Ctools. Notice we also specify where the module should live. This is not mandatory, but it is considered best-practice to put third-party projects in a directory called `sites/*/modules/contrib`, and to put our custom code in a folder called either `sites/*/modules/custom` or `sites/*/modules/project_name`. Here, we also apply 2 patches. The patches are applied in the order specified. Patches can be located online or locally.

<pre><code class="language-php">
  views:
    version: 3.10
    subdir: contrib
</code></pre>

This is a more common format: it specifies the version to use. Here again, we put it in `contrib/`. I personally recommend to always put a version number for documentation purposes and reproducibility.

<pre><code class="language-php">
  zen:
    version: 5.5
</code></pre>

As you can see, it works for themes as well.

<pre><code class="language-php">
  mymodule:
    type: module
    subdir: custom
    download:
      type: git
      url: https://git.bitbucket.org/myname/mymodule.git 
      tag: 1.2
</code></pre>

Of course, this would not be of much use if you couldn't include private projects. Drush can download code in a variety of ways. The `download.type` key can tell Drush to use Git, SVN, a simple `wget`, etc. Check the [official](http://www.drush.org/en/master/make/) documentation for more info. However, for stuff that is not an official Drupal project, we need to specify what it is. This is why we have the `type` key set to `module`.

<pre><code class="language-php">
libraries:
  phpexcel:
    download:
      type: get
      url: https://github.com/PHPOffice/PHPExcel/archive/1.8.0.tar.gz
    destination: libraries
    directory_name: PHPExcel
</code></pre>

Drush can also download third-party libraries. Note that these do not go under `projects`, but inder `libraries`. Here, for example, we download the [PHPExcel](https://github.com/PHPOffice/PHPExcel) library. Because each release of PHPExcel is available as `.tar.gz` files, we choose to download that using `wget` (`download.type` is `get`). We tell Drush the destination is the `sites/*/libraries` folder and the extracted TAR should be renamed `PHPExcel`.

Now, to build this, we call this simple command:

<pre><code class="language-bash">
drush make project.make.yml _build
</code></pre>

This will tell Drush to *make* the `project.make.yml` file, and put everything inside the `_build/` directory. This `_build/` directory will contain a complete Drupal site, along with all your modules, themes and libraries, ready to be used. You can build locally and transfer this code to your server, or, better still, SSH onto your server and use `make` to build the code on there directly.

## How To Use This

No matter if you are working as part of a team or on your own, using `drush make` is a great idea. It documents exactly what you have on the site (especially valuable if you applied patches), and allows you to very easily reproduce the exact same environment for debugging or development.

You can simply check this in your favorite CVS tool, version it, keep track of your modification and the evolution of the project, etc. You can keep it separated from custom modules and themes in the repo this way, which is what some teams prefer (I do).

## Just Scratching The Surface

The above just scratches the surface of what `drush make` can achieve. It is a very powerful tool, and it can greatly simplify your code maintenance and build workflow. I hope this small introduction will help you adopt this tool as part of your Drupal toolbox and workflow.
