---
title: "Wouter Admiraal's lore"
layout: page
home: true
---

This is the blog of Wouter Admiraal, web developer extraordinaire. Come here for rants, pseudo-wisdom or loosing precious time.

## Latest posts

Straight from the press.

{% for post in site.posts limit:3 %}
#### [<time datetime="{{ post.date | date_to_utc | date:"%Y-%m-%dT%H:%M:%SZ" }}">{{ post.date | date:"%Y-%m-%d" }}</time>&thinsp;&mdash;&thinsp;{{ post.title }}]({{ post.url }})

{{ post.description }}  
[Read more&hellip;]({{ post.url }})
{% endfor %}

## Subscribe to The Top 3

The Top 3 is a weekly email I send with 3 interesting links about the web and more. Short and sweet. [Subscribe here](http://www.getrevue.co/profile/wadmiraal).

