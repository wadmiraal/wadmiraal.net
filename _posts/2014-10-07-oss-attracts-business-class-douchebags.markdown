---
title: "Open Source now attracts business-class douchebags"
description: "The Open Source community has changed. Where there were once passionate, rebellious freedom fighters, we now see white collars and snake-oil sales(wo)men. This is because, Open Source is now a valid business model."
layout: post
favorite: false
tags:
  - Open Source
  - Rant
---

***Note: Tildeslash [retracted their claim](https://github.com/github/dmca/blob/master/2014-10-06-tildeslash-retraction.md).***

I'm pissed today. Pissed by [this completely ridiculous claim by Tildeslash](https://github.com/github/dmca/blob/master/2014-10-05-tildeslash.md) sent to Github. But also pissed at the guy they target, [Mike Perham](https://twitter.com/mperham).

I'll let you go on and read their open letter to Github. One of my favorite parts:

> [private]'s dishonest exploitation of Open Source work by others for his own gain is *despicable*.  
> (emphasis mine)

But, once you read that, please go check out what Mr. Perham *did* with his derivative work: [Inspeqtor Pro](http://contribsys.com/inspeqtor/)

Not cool man. Not cool *at all*.

I *get* why Tildeslash is pissed. Hell, I would too. But that's *the rules of the Open Source game.* You cannot go on a Copyright-defense-spree and walk around waving Cease And Desist notices. If your code is Open Source (with a permissive license like AGPL, in this case), you must accept *others* can make money with *your* software.

However, M. Perham *should* have done 2 things differently (IMHO):

* The enhancements he made should have been made in the original software via a fork, after which he should have filed a pull request. It's only fair to give back to the original authors.
* Or, he should have gone on and make a *complete*, new product. Don't go on admitting your work is heavily influenced (what does that even mean ? A simple rewrite, less the parts you changed ?) by another one, then setting up a competing service. Tildeslash claims he even went as far as copying the DSL used for configuration. That would indeed mean a &ldquo;simple&rdquo; rewrite, *not* any &ldquo;original&rdquo; work.

## Weekend A#$holes Now Surpassed By Business Class A#$holes

There are things that can turn the most friendly person into a complete a$#hole. One of them is driving a car. Another one is cold, hard ca$h.

Open Source software has always had some <abbr title="a$#holes">peculiar people</abbr> in its midsts. But we are seeing a shift in the Open Source world; all of a sudden, it seems to attract a whole new bunch of them; and they are much worse.

They are business (wo)men. White collars. And I don't mean the entrepreneurs *à la* Dries Buytaert and others (who *are* a great Open Source business (wo)men&thinsp;&mdash;&thinsp;they understand the game). I mean the old guard, looking to make money at the competition's expense.

## &ldquo;Freedom Is Fine; As Long As We Can Make A Buck And Competition Can't&rdquo;

Open Source Software used to be in the hands of a selected few individuals that thoroughly believed in freedom (as in Free Speech) in using and/or modifying software. It triggered a whole new approach in our industry about sharing knowledge, best practices, security... Collaboratively built software is usually much better than their proprietary counterparts (given enough time to grow a contributor base).

Currently, however, we see a new shift in our industry towards using Open Source *as a Business Model*.

Business means money. **That's ok**: developers need money to survive, just as anyone else. But business also means some people use Open Source for different reasons. They don't care about *your* freedom. Freedom does not make them money. They are interested in:

* **publicity**: Open Source projects tend to get much more attention than proprietary ones
* **reduced development costs**: Open Source software attracts other developers (often very good ones, too). These find bugs, fix bugs, provide security audits, add new features... this is a **gold mine** for software owners

They then capitalize on selling services, like training, hosting solutions, or custom development. I know this. I convinced my previous employer to launch [Opigno](http://www.opigno.org) under this model for these exact, same reasons (and it worked out pretty well).

It's a *great* business model, which benefits everyone. Until someone breaks the &ldquo;rules&rdquo;.

## &ldquo;Freedom Ain't Abou' Rules, Man !&rdquo;

Freedom is **all about rules**, on the contrary. I won't go into details about why, but thinking freedom is about **not** having rules is <abbr title="Idiotically, stupidly, naively, incredibly, blatantly, %&amp;*+§ DUMB !!">just silly</abbr>.

Some business people don't know the rules of this Open Source game. The (tacit) rules are simple:

> 1. We help *you* make your software better, and you let *us* do whatever the hell we want with it.
> 2. We *respect* you and your project, and the work you put into it.

*Note: for instance, about rule 2, if someone rewrites your project in another language (e.g.: your Java library rewritten in Ruby), it's a **huge** compliment, not a threat (e.g.: [Jekyll](http://jekyllrb.com/) and [Hyde](http://hyde.github.io/)).*

Sure, software owners might want to put *some* restrictions on their software, like preventing other companies from selling it further as proprietary software (seriously, if you're even *considering* taking OSS and selling it under a proprietary license, you're The King Of All Douchebags incarnate).

But some of these business people go further.

They don't abide to rule 1., looking for ways to control as much as possible what people do with their software (this is when you see &ldquo;Open Source Software&rdquo; having its own, custom license, or a &ldquo;Community Edition&rdquo; VS a &ldquo;Pro Edition&rdquo;). This is typical *proprietary* software business mentality. Fear the competition. Loath them. Restrict them in any way possible.

Exactly, in my opinion, what Tildeslash is doing here.

However, *others* don't respect rule 2. They take this Open Source software and make money with it *at the expense of the original authors*. They will go, like *&ldquo;Hey, thanks for the software. Sucker !&rdquo;* This, although *legal* (in most cases), isn't really *fair*. Of course, there's a blurry line dividing what is to be considered leeching an existing software to make money from it (without sharing it with the original authors), or simple creating competing software and making money out of that.

*Reasons* for creating such competing software may be a different view about what the software should *be*, or *become*. But creating a fork (or simply rewriting it), which serves the *same* purpose, for almost the *exact same audience*, and has the *same features*... To me, that is unfair.

Mike Perham is &ldquo;on&rdquo; this blurry line. If it really is a simple rewrite (as Tildeslash claims), it seems unfair (to me) to make a competing product. If there's no added value except a *[few bug fixes](https://github.com/mperham/inspeqtor/wiki/Other-Solutions#monit)*, than it is *not* a *new* product. Rule 2 would suggest fixing these bugs and giving it *back* to the community (and original authors). *That* is a win-win situation.

*Note: [there are no pull requests](https://bitbucket.org/tildeslash/monit/pull-requests?displaystatus=declined) made by M. Perham, so it is not a case of &ldquo;He wanted to help fixing it, but they didn't let him&rdquo;.*

## In The End, It Is About Trust And Respect

In the end, everyone will criticize Tildeslash's letter (side note: you guys *really* should have handled this differently&thinsp;&mdash;&thinsp;you could have turned it around and make *Perham* look like a douchebag; too late now).

But some (like me) will also criticize Mike Perham, for it *does* not feel right.

If both parties had shown respect and trust, we probably would not have seen this situation arise.