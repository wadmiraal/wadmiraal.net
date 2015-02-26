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

Next, create a file that will represent your project. The convention is to put a `.make` extension. I recommend this; it will make it obvious what the file is for. If you are going to use Git, I would put this at the root of a new, empty repo, along with a README file with some simple instructions and a directory for your custom patches:

    project/
        .git/
        patch/
        .gitignore
        project.make
        REAMDE.txt

Now, here's a sample `.make` file content. I'll go over each line later:

<pre><code class="language-php">
api = 2

; Shorthand, works for any project
projects[] = drupal

; Specific version
projects[views][version] = 7.x-3.5
projects[views][subdir]  = contrib

; Latest version, apply patches
projects[ctools][subdir]  = contrib
projects[ctools][patch][] = https://www.drupal.org/sites/default/files/ctools_patch_6778098_3.patch
projects[ctools][patch][] = ./patch/ctools_change-something.patch

; Themes work the same way
projects[zen][version] = 7.x-4.0

; Custom module in a private Git repo
projects[mymodule][type]           = module
projects[mymodule][subdir]         = custom
projects[mymodule][download][type] = git
projects[mymodule][download][url]  = https://git.bitbucket.org/myname/mymodule.git 
projects[mymodule][download][tag]  = 7.x-1.2

; Libraries can be downloaded as well
libraries[phpexcel][download][type] = get
libraries[phpexcel][download][url] = https://github.com/PHPOffice/PHPExcel/
libraries[phpexcel][destination] = libraries
libraries[phpexcel][directory_name] = PHPExcel
</code></pre>

Lets go over each of these.

<pre><code class="language-php">
api = 2
</code></pre>

This lets us specify which version of `drush make` we target. The current is `2`. This is required.

<pre><code class="language-php">
projects[] = drupal
</code></pre>

This is the shorthand for adding a project. This simply tells Drush to download the latest stable release. This works for any project, be it themes or modules. It is not limited to Drupal.

<pre><code class="language-php">
projects[views][version] = 7.x-3.5
projects[views][subdir]  = contrib
</code></pre>

This is a more common format (and one I personally recommend for documentation purposes and reproducability). It specifies the version to use. Notice we also specify where the module should live. This is not mandatory, but it is considered best-practice to put third-party projects in a directory called `sites/*/modules/contrib`, and to put our custom code in a folder called either `sites/*/modules/custom` or `sites/*/modules/project_name`.

<pre><code class="language-php">
projects[ctools][subdir]  = contrib
projects[ctools][patch][] = https://www.drupal.org/sites/default/files/ctools_patch_6778098_3.patch
projects[ctools][patch][] = ./patch/ctools_change-something.patch
</code></pre>

This download Ctools, puts it in `contrib/` as well, but also applies 2 patches. The patches are applied in the order specified. Patches can be located online or locally.

<pre><code class="language-php">
projects[mymodule][type]           = module
projects[mymodule][subdir]         = custom
projects[mymodule][download][type] = git
projects[mymodule][download][url]  = https://git.bitbucket.org/myname/mymodule.git 
projects[mymodule][download][tag]  = 7.x-1.2
</code></pre>

Of course, this would not be of much use if you couldn't include private projects. Drush can download code in a variety of ways. The `[download][type]` key can tell Drush to use Git, SVN, a simple `wget`, etc. Check the [official]() documentation for more info. However, for stuff that is not an official Drupal project, we need to specify what it is. This is why we have the `[type]` key set to module.

<pre><code class="language-php">
libraries[phpexcel][download][type] = get
libraries[phpexcel][download][url] = https://github.com/PHPOffice/PHPExcel/
libraries[phpexcel][destination] = libraries
libraries[phpexcel][directory_name] = PHPExcel
</code></pre>

The final part is Drush can download third-party libraries. Here, for example, we download the [PHPExcel]() library. Because the library is available as `.tar.gz` files for each release, we use that. We tell Drush the destination is the `sites/*/libraries` folder and the extracted TAR should be renamed *PHPExcel*.

## How To Use This

No matter if you are working as part of a team or on your own, using `drush make` is a great idea. It documents exactly what you have on the site (especially valuable of you applied patches), and allows you to very easily reproduce the exact same environment for debugging or development.

You can simply check this in your favorite CVS tool, version it, keep track of your modification and the evolution of the project, etc. You can keep it separated from custom modules and themes in the repo this way, which is what some teams prefer (I do).

## Just Scratching The Surface

The above just scratches the surface of what `drush make` can achieve. It is a very powerful tool, and it can greatly simplify your code maintenance and build workflow. I hope this small introduction will help you adopt this tool as part of your Drupal toolbox and workflow.
