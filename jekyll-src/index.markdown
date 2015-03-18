---
title: "Wouter Admiraal's lore"
layout: page
home: true
---

This is the blog of Wouter Admiraal, web developer extraordinaire. Come here for rants, pseudo-wisdom or loosing precious time.

## Latest post

Straight from the press.

{% for post in site.posts limit:1 %}
#### [<time datetime="{{ post.date | date_to_utc | date:"%Y-%m-%dT%H:%M:%SZ" }}">{{ post.date | date:"%Y-%m-%d" }}</time>&thinsp;&mdash;&thinsp;{{ post.title }}]({{ post.url }})

{{ post.description }}  
[Read more&hellip;]({{ post.url }})
{% endfor %}

## How About Some Weekend Reads?

The Top 3 is a weekly email I send with 3 interesting links about the web and more. Short and sweet. [Subscribe here](http://www.getrevue.co/profile/wadmiraal). You can read past issues [here](https://www.getrevue.co/profile/wadmiraal#archive).

## Find Me Online

I'm *wadmiraal* online. [Google it](https://www.google.ch/search?q=wadmiraal), most links are about me. Social accounts:

<a class="about-links" href="http://twitter.com/wadmiraal"><i class="icon icon-twitter3 icon--inline"></i> Twitter</a>
<a class="about-links" href="http://drupal.org/u/wadmiraal"><i class="icon icon-drupal icon--inline"></i> Drupal</a>
<a class="about-links" href="http://github.com/wadmiraal/wadmiraal.net"><i class="icon icon-github icon--inline"></i> Github</a>
<a class="about-links" href="http://www.linkedin.com/in/wadmiraal"><i class="icon icon-linkedin-with-circle icon--inline"></i> LinkedIn</a>