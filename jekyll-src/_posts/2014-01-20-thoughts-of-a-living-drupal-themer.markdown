---
title: "Thoughts of a living Drupal themer"
description: "Some quick thoughts and tips about Drupal theming."
layout: post
tags:
  - Drupal
  - HTML
  - CSS
  - Theming
---

As a Drupal themer, I have had this habit for years of creating my own templates for about anything, every single project. Nodes, blocks, fields, views, etc. Maybe you did so as well. 

The thing is: *you really shouldn't*. Drupal's markup is very well done and provides all the flexibility you require. 

## It starts with prototyping
If you're anything like me, you start prototyping your new project by writing plain HTML/CSS. You create your markup your way, except maybe for the menu, where you copy-paste Drupal's markup. 

But when comes the time to actually convert it to a theme, it gets messy. Your classes and markup don't match that of Drupal, so you overwrite what Drupal does with theme hooks and templates. 

## The other way around
Drupal was built by some pretty clever people. And much thought was put in the markup as well (the CSS though, we all agree, is horrible). 

For the main layout, there's no beating plain HTML/CSS for iterating quickly. But once you start diving into details (like node layouts), I suggest you stop and convert to a Drupal theme immediately. It will look crude, but bear with me. 

Next, start fleshing out the site structure. The content types, the fields, the image styles. Everything you will do anyway. Tip: if you're doing this locally, turn it into a [feature](http://www.drupal.org/project/features) so you can migrate it all to the live site. 

Once you got that set up, turn to your node display settings. Use those settings to make Drupal churn out markup that is relevant to you (like hiding labels, using the correct image styles, etc). 

Now, create some content, and continue your theming. Don't worry too much about that strange, unfamiliar markup. Embrace it. And something grand will happen: you will notice *a lot* can be achieved with Drupal's core markup. You will spend far less time copy-pasting template files you need to overwrite. You will hardly open the template.php file. It all will start to make sense. 

You will probably end up writing a little more CSS than you usually do, but on the other hand your theme is becoming much more portable and lean. You will reduce code duplication dramatically (remember having one `node.tpl.php` file per node type? How much of each of these were actually 100% unique?) This will be even more obvious if you use a CSS preprocessor like SASS. 

## Give it a spin
It's really worth a try. Only create a template when you really have to (which, of course, will happen) and your CSS begins to look way too hacky. I might post an example one of these days&thinsp;&mdash;&thinsp;if I find the time. 

