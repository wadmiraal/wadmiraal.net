---
title: "Don't fear duplicate data"
description: "Good programmers strictly follow the DRY principle. But sometimes, this can be harmfull in terms of user experience."
layout: post
tags:
  - UX
  - Wisdom
---

We, as programmers, are often thought the almighty <abbr  title="Dont Repeat Yourself">DRY</abbr > principle. This is a good thing. It makes us think in terms of independent components. It allows us to work faster, more efficiently and with less stress.

But, there is a side effect, where this almighty principle can become a UX nightmare: **preventing duplication of data**.

## Are you suggesting...

Yes, I am.

The DRY principle should always be adhered to. Always. But in *our code*. In *our* realm.

As soon as we start applying this logic to our clients' data (even with the best intentions), we can unkowingly break the user experience of our product. And sometimes pretty badly so.

I've seen this time and time again. It's frustrating. It's mind boggling. It's a real pain.

## Real world example

A client needed a way to manage courses. In their most basic form, these courses had a title and short description. Cool. Easy. But it soon got tricky, and out of hand.

Each course must be in a category. We added a <abbr title="Create Read Update Delete">CRUD</abbr> area to manage these categories, and added a select list on the course form. Good.

Next, each course needs a "color" (not related to the category). Colors can also be re-used across courses. Here again, we added a CRUD. Third one. And a new select list on the course form.

Next, each course has a price list. Again, some courses have the same prices. Create a fourth CRUD. And a new select list on the course form.

Next, each course spans several days, with multiple breaks between sessions (like morning session and afternoon session). So we added the possibility to add multiple from-to date fields, on the fly, directly on the course form.

Next, each of these *sessions* has a different teacher. But some teachers give multiple sessions. So we created a fifth CRUD area to manage teachers (only their names - no address, contact info, nothing). And a select field for each session to pick a teacher (*note: most teachers are never used twice*).

Next, each of these *sessions* can be in a different physical location. So we do the same trick as with the teachers. A sixth CRUD.

So we ended up with **6 different admin pages**, each to manage a particular content. And a big form with many select fields. And a client who still can't remember how everything works, *2 years later*.

## What should have been done

Categories and locations are re-used heavily. These 2 are indeed good candidates for a separate management.

But...

* the teacher should have been a simple textfield. The chances of having to type the same name twice is like 1/10. Not worth managing separately
* the color field should have been a simple color picker
* the price list should simply be a textarea, or even included in the description

This would have reduced the number of admin pages to 3. That's *half* the pages. But remember: **complexity does not grow linearly. It grows exponentially.**

Steve Krug nailed this with his mantra &ldquo;Don't make me think !&rdquo; Every link that exists in such a form adds &ldquo;mental bloat&rdquo;. It forces you to *stop* and *think*. Remove just one of these *stops*, and the whole thing all of a sudden seems so much easier.

This is a simple (stupid) example, but because this client has so much trouble with this interface to this day, I feel it illustrates this pretty well.

## Duplication of data is the client's problem

It's not ours. If the data is never going to change anyway, why bother adding a layer of complexity to the system ? Sure, from time to time, this will come back and bite you. Because, sometimes the duplication can become a problem in the long run. But *it's a problem when it's a problem*. Why break the user experience now because of some issue we might never encounter ?

Either way, talk about it with the client. Share your fears, and let them decide. Explain to them you can make the system more durable, but that it comes at the price of more complexity (or vice versa).

This will not only free you from the burden of making the right decision, it will also prove that you know your business.

Because if your product prevents duplication of data, but becomes difficult to use, your clients will think your a nerdy idiot.

And if your product is easy to use, but prevents them from using key content throughout the product and makes them type it in again and again, they will think your a nerdy slacker.

By making them decide, you show them you know all the implications. That you care. And they will <del>love you for it</del> respect you a little more.
