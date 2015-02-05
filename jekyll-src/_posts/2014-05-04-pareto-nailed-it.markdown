---
title: "Pareto Nailed It"
description: "What can we learn from Pareto's 80%-20% law."
layout: post
favorite: true
tags:
  - Wisdom
  - Rant
---

Pareto nailed it.

Of course, he wasn't talking about software design at the time (or any design, in fact). But he did get one thing right:

80% of events (or results) come from 20% of the causes. 

Or, in many ways: 80% of the results can be obtained with 20% of the effort.

## I love simplicity

Simplicity is elegance. Simplicity is speed. Simplicity is flexibility. Simplicity is freedom. 

These are things we *love* and adore when interacting with &ldquo;things&rdquo;, be they physical or digital. 

Yet, despite this, we keep on forgetting this. We make complex things, adding layer after layer of bells an whistles, obscuring our original brilliance and genius with distracting buttons and switches. This holds even more true in software design, *because it's much easier to do*.

For me, the most classic example is *a registration form with an address field*. 

Typical example: your client asks you to set up a form to collect addresses. This form has a field for the street,  a field for the house number, another for the area code, city and country. 5 fields. All required and some (probably) having validation rules. I **hate** these kind of forms with a passion, as a user *and* as a programmer.

We all know our address. But we don't use the same format or logic for it. Some countries have states, others do not. Sometimes the area code comes before the city name, sometimes after. By forcing a format, we make users &ldquo;work&rdquo; to fit their address into our arbitrary defined standard. Worse, many users don't use the tab key to switch fields, making them have to point and click through each field. The end user-experience is terrible when you think of the tiny scale of the task. 

This is what you *should* use: one textarea. Done. That's 1/5th of the work (20%, boom!). It's *much* simpler to manage, and a *lot* easier for the users. It is just as accurate, and I'm willing to bet ROI is higher. 

*Pro tip: if your client retorts that users will insert fake/dummy data with only one textarea, ask them how many of their users live at "6274 sfgdirjfkftd" street, in "19474 jdkflfujdogif", "Afghanistan" (&lt;- usually first country in select lists). *

## Let's get on with it

I'm willing to bet that, if we start focusing on what's really important and forget about the dead weights that keep us down, we will write better software and actually enjoy the process much more.
