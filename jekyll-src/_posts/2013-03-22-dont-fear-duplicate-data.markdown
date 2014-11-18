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

As soon as we start applying this logic to our clients' data (even with the best intentions), we can unknowingly break the user experience of our product. Sometimes pretty badly.

I've seen this time and time again. It's frustrating. It's mind boggling. It's a real pain.

## A little story

Once uppon a time, a merchant had a problem. He had a list of products inside a system. Each product had a unique reference (a string).

When someone purchased one of these products anywhere in the world, (from a physical shop), a line would get inserted into the database, containing the client information and the product reference.

Now, it sometimes happened that a product was purchased from a shop **before** the merchant had the time to insert the product into his system. How would one link these 2 then, because one of the 2 was missing ?

The merchant said: "Just store the bought reference. It's identical to the one the new product will have. And it's unique, too. So, when the product gets added, the link will be easy and automatic. Simple."

But the developer saw a pitfall: what if the reference had to change ? What if the merchant wanted to change the reference of his product in the future ? This was a very serious concern.

But how could one solve this ? The merchant wanted this to be automatic and straightforward. He wanted to spend as little time as possible working with this system. But the developer didn't want to duplicate information. It was against his most sacred beliefs. So he invented a new interface. This interface would list all purchases that did not relate to a product yet. And the merchant would only have to click on it, select the actual product it was related to, and click save. Easy !

The developer was really happy and proud. He told the merchant: "Now you only have to logon a few days a week to make sure that there are no unlinked purchases."

The merchant did not understand why the developer made him logon so often to check something a computer, surly, would be able to do as well.

This is actually a true story. And even though it's very simple, it highlights a big problem: **that fear of duplicate data can add complexity to a system**.

There's absolutely no valid reason to change a product reference after it's been used before. This would take tremendous efforts, as many past orders, receipts, etc, would become invalid. This data **could safely be duplicated**, and it would make the life of our merchant a little easier.

Steve Krug nailed this with his mantra &ldquo;Don't make me think !&rdquo; Every page, form, button or link that exists in such a system adds &ldquo;mental bloat&rdquo;. It forces you to *stop* and *think*.

Remove just one of these *stops*, and the whole thing, all of a sudden, seems so much *easier*.

This is a simple (read: &ldquo;stupid&rdquo;) example, but I feel it illustrates this pretty well. I've worked on projects where this fear **did** become a UX nightmare. With *dozens* of admin pages all over the place, just to manage a few *web pages*.

## Duplication of data is the client's problem

It's not ours. If the data is never going to change anyway, why bother adding a layer of complexity to the system ?

Sure, from time to time, this will come back and bite you. Because, sometimes the duplication can become a problem in the long run. But *it's a problem when it's a problem*. Why break the user experience now because of some issue we might never encounter ?

A piece of advice: talk about it with the client. Share your fears, and let them decide. Explain to them you can make the system more durable, but that it comes at the price of more complexity (or vice versa). This will not only free you from the burden of making the right decision, it will also prove that you know your business.

Because if your product prevents duplication of data, but becomes difficult to use, your clients will think you're a nerdy idiot.

And if your product is easy to use, but prevents them from using key content throughout the product and makes them type it in again and again, they will think you're a nerdy slacker.

By making them decide, you show them you know all the implications. That you care. And they will <del>love you for it</del> respect you a little more.
