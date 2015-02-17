---
title: "wadmiraal's lore"
layout: page
---

This is the blog of Wouter Admiraal, web developer extraordinaire. Come here for rants, pseudo-wisdom or loosing precious time.

## Latest post

Straight from the press.

{% for post in site.posts limit:2 %}
#### [{{ post.title }}]({{ post.url }})

{{ post.description }}  
[Read more&hellip;]({{ post.url }})
{% endfor %}

## My favorite posts

Because some articles are just worth keeping.

{% for post in site.posts %}
  {% if post.favorite %}
#### [{{ post.title }}]({{ post.url }})

{{ post.description }}  
[Read more&hellip;]({{ post.url }})
  {% endif %}
{% endfor %}

## Subscribe to The Top 3

The Top 3 is a weekly email I send with 3 interesting links about the web and more. Short and sweet. [Subscribe here](http://www.getrevue.co/profile/wadmiraal).
