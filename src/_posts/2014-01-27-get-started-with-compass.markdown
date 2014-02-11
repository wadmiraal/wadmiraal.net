---
title: "Get started with Compass"
description: "Compass is your new best friend. Some tips to get started."
layout: post
tags:
  - SASS
  - HTML
  - CSS
  - Compass
---

One of the best tools I started using beginning 2013 is [Compass](http://compass-style.org/). I love it, and miss it dearly when I have to work on a project using plain-ol&rsquo; CSS.

## If you're not using it, you're missing out

And I feel compelled to help you change your deprecating behavior and help you get started with Compass and SASS (I personally prefer the SCSS\* syntax).

First, if you've been living in a cave for the last few years, SASS makes you write &ldquo;CSS&rdquo; in a different &ldquo;language&rdquo;, which needs to be *compiled* to CSS. If you're a front-end purist, like me, this might seem unacceptable. And might be the reason you haven't adopted SASS (or LESS) yet. We hate leaving our precious CSS rules in the hands of a machine. We're crafts(wo)men, not button-pushers.

But, believe me, this is a nice exception to make.

### Why you'll love using SASS and Compass

I guess people like SASS and Compass for different reasons. For me, my top 3 reasons are...

#### ...CSS3 helpers. 
Tired of writing prefixes? Let Compass do it. 

````
// SCSS
.rounded {
  @include border-radius(5px);
}
````

Instead of writing...

````
/* CSS */
.rounded {
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  -ms-border-radius: 5px;
  -o-border-radius: 5px;
  border-radius: 5px;
}
````

#### ...<abbr title="Don't Repeat Yourself">DRY</abbr> CSS
Repetition is a plague in CSS, as it can easily introduce bugs or inconsistencies. Not anymore. 

````
// SCSS
$blue: #5555ff;

.title {
  color: $blue;
}
// ... A quazilion lines further... 
.search {
  border-color: $blue;
} 
````

Instead of...

````
/* CSS */
.title {
  color: #5555ff;
}
/* ... A quazilion lines further... */
.search {
  border-color: #55f; /* <- Different way to write the same color! Search/replace can be misleading in these cases. */
} 
````

Even better (I use this trick a lot):

````
// SCSS
$icons: (home, forum, blog, my-account, logout, news, rss, login, settings, post, comment);
@each $icon in $icons {
  .icon-#{$icon} {
    background-image: url(../img/icon-#{$icon}.png;
  }
}
````

Instead of...

````
/* CSS */
.icon-home {
  background-image: url(../img/icon-home.png;
}

.icon-forum {
  background-image: url(../img/icon-forum.png;
}

.icon-blog {
  background-image: url(../img/icon-blog.png;
}

/* You get the idea...*/
````

#### ...Code organization
I have yet to find a seamless, intuitive way to organize my CSS. Do I put everything in one file? Do I separate styles from structure? How do I manage hierarchy? 

With SASS, however, I found a great way to keep everything tidy and quick to browse through (more below). 

#### &lt;aside role="geek-side-note"&gt;Compass ? SASS ? What's the difference ?&lt;/aside&gt;

[SASS](http://sass-lang.com/) is a syntax that greatly enhances CSS. It provides variables (well, constants actually), functions (called *mixins*), inheritance, shortcuts, etc. It's very, very powerful, yet simple to use. If you know CSS, you know SASS. 

[Compass](http://compass-style.org/), on the other hand, is a set of tools built for SASS that enhances the experience even more. It provides nifty shortcuts and functions out of the box, the most useful being the CSS3 mixins.


## Get started

First things first: some tools provide SASS compiling out of the box. If you're using a JetBrains IDE (like WebStorm or PHPStorm), it provides this for you. Other IDE do this as well. I personally use the command line, however.

### Installation

You must install Ruby first ([on Windows](http://rubyinstaller.org/); [on Mac](http://net.tutsplus.com/tutorials/ruby/how-to-install-ruby-on-a-mac/); Linux depends on your distribution, but `sudo apt-get install ruby` might do the trick). Then, from the command line (cmd on Windows, Terminal on Mac or Linux), call `gem install compass`. This will install everything you need.

Done.

### Use it

Compass expects to find a file called `config.rb` inside your project. In this file, you will specify where your SASS files are located an where you want the compiled CSS to go. Here's an example:

````
css_dir = "/css"
sass_dir = "/sass"

# You can put this file inside the sass folder if you prefer. 
# You would then have:
#css_dir = "/../css"
#sass_dir = "/"

# You can select your preferred output style here (can be overridden via the command line):
output_style = :expanded

# To disable debugging comments that display the original location of your selectors.
line_comments = false
````

Now, `cd` in your project folder (where your `config.rb` file is located) with the command line and call `compass watch`. Compass will start polling your files and, as soon as it detects a change, it compiles to CSS. This is very handy when developing. 


### Organize your project

There are many ways to organize your stylesheets. There are 3 important things to know when organizing your files, which will help you decide how to approach this:

1. SASS files get compiled and &ldquo;mirrored&rdquo; to a CSS equivalent. So `sass/path/to/file.sass` will get compiled to `css/path/to/file.css`.
2. Files that start with an underscore (_) are ignored (called *partials*).
3. Files can import other files via the `@import` statement.

Based on this, I like to separate my style rules in many, small files. Each file has a very specific role, which allows me to quickly find my way around.

It looks a bit like this:

<pre><code class="css">
project/

-- css/
   -- styles.css

-- sass/
   -- styles.scss /* This imports everything. It contains no actual rules. */
   -- partials/
      -- utility/ /* This contains utilities, like my variables, custom mixins, etc. As a rule, this contains no real style rules, only helpers. */
         -- _mixins.scss
         -- _variables.scss
         -- _colors.scss
         -- etc

      -- base/ /* This contains what I call base styles. Think of them as "abstract". They apply to any part if the site by default. */
         -- _html.scss
         -- _tables.scss
         -- _forms.scss
         -- _header.scss
         -- _typography.scss
         -- etc

      -- components/ /* Contains component-specific styles. These overwrite the base ones when necessary. */
         -- search/
            -- _form.scss
            -- _results.scss
            -- etc

         -- comment
            -- _form.scss
            -- _body.scss
            -- etc

         -- _search.scss
         -- _comment.scss

      -- _utility.scss
      -- _base.scss
      -- _components.scss

</code></pre>

As you see, I have at least 3 levels. Each sub-level has a corresponding partial, named the same (like `base/` and `_base.scss`). Each of these only serves to import the level below it (`_base.scss` imports `base/html`, `base/tables`, etc). This makes it very easy to add or remove files from these folders, as the import list is located in a similarly-name file, instead of having a super-long list in `styles.scss`at the root.

For example:

````
/* @file styles.scss */
@import "partials/utility";
@import "partials/base";
@import "partials/component";
````

````
/* @file _utility.scss */
@import "utility/mixins";
@import "utility/variables";
@import "utility/colors";
````

This recursive import allows us to keep our rules modular and well organized. 

### &lsquo;nuff said, get going already

This is just a very quick overview of Compass and SASS. I suggest you start experimenting and using it ASAP; you won't regret it.


*\* Wait, what ? Yeah, SASS provides 2 ways to write SASS (strange sentence there). Indented (also just called SASS &mdash; think CSS written like Ruby) and SCSS (very similar to regular CSS).*
