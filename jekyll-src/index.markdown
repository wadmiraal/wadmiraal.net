---
title: "wadmiraal's lore"
layout: page
---

This is the blog of Wouter Admiraal, web developer extraordinaire. Come here for rants, pseudo-wisdom or loosing precious time.

## Latest posts

{% for post in site.posts limit:2 %}
* [{{ post.title }}]({{ post.url }})
{% endfor %}

## Some of my favorite posts

{% for post in site.posts %}
  {% if post.favorite %}
* [{{ post.title }}]({{ post.url }})
  {% endif %}
{% endfor %}