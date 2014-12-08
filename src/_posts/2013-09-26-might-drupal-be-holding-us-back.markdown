---
title: "Might Drupal be holding us back ?"
description: "Drupal is an awesome piece of software, and many people learn software by using it. But because of the Drupal API and release cycle, we might be held back."
layout: post
tags:
  - Drupal
  - Rant
  - Open Source
---

Let me get a few things straight first:

1. I love Drupal. I work with it every day and think it's an awesome product.
2. I&rsquo;m thrilled by where Drupal is heading. I'm a big fan of Symfony, and love how Drupal is finally embracing modern techniques.
3. I started thinking about this when trying to understand (and I think I do) why [Backdrop was created](http://www.jenlampton.com/blog/introducing-backdrop-cms-drupal-fork).

So I have *nothing* against Drupal.

## But, I still wonder

Does Drupal hold us back, from a *technical* point of view ?

*Why do you say that ?*, you may ask.

Well, let me briefly tell how I got into PHP development, and eventually into Drupal development.

## It starts with a n00b and a problem

I was the webdesigner of my company when I started there. I had some experience with PHP, but little more than doing some basic MySQL queries and using echos to render the results.

At one point, we had a project for a website. And it had to be in PHP. The others being Java-devs, I was charged to do it, and choose a technology for it. I didn't have a clue. I chose Drupal mostly by chance. The project was horribly done, as you would expect, and I will spare you the gory details.

Months passed, and we had more and more sites that needed to be done in PHP. And I started getting more and more involved in writing PHP scripts, that eventually started looking like modules.

And I learned a lot. I got better and better at PHP. Until I was actually very good at it&thinsp;&mdash;&thinsp;on par with Drupal core itself. Soon after, however, Drupal 7 came along. And it became clear that my knowledge of PHP, of the paradigms that were being used, were outdated. 

PHP, and web technologies in general, had evolved. But because I had mostly been using Drupal and it&rsquo;s APIs, I hadn&rsquo;t noticed. I didn't know there were *much* better ways to do things.

So, I learned a whole new bunch of things, thanks to Drupal 7. I progressed again, albeit with some difficulty. 
The changes were, after all, pretty big. Untill I got on par again with Drupal core and the &ldquo;new&rdquo; paradigms.

You see where I&rsquo;m getting at.

## The Drop is not always moving; it makes quantum leaps

Drupal, at the time it get&rsquo;s released, introduces new best practices, an updated API and new, modern concepts. This is great. 

The problem with this is, many Drupal users don&rsquo;t use or develop with other systems. They stick to their guns and do what they know best. If a Drupal (or any other platform, for that matter) developer does not follow the evolutions of the tech-world around her/him, she/he will start getting &ldquo;behind&rdquo; the pack. And in the case of Drupal, when a new version gets released, she/he has to learn a lot of new things, and realize that all the knowledge accumulated over the years has become obsolete. And that is frustrating. 

## A difficult problem to solve

Because of Drupal&rsquo;s long release cycle, and the very fast pace at which technologies are evolving, many people&thinsp;&mdash;&thinsp;perhaps the less *technical* inclined&thinsp;&mdash;&thinsp;happily continue to use outdated techniques and deprecated functions for extended periods of time.

Sadly, Drupal *cannot* have a short release cycle (say one year)&thinsp;&mdash;&thinsp;it&rsquo;s to big. It takes time for it to get stable and for contrib to catch up. With shorter release cycles, even though the API changes would be smaller, maintainers would constantly be updating their modules, instead of focusing on making them better.

Of course, trying to &ldquo;educate&rdquo; the community (keeping them up to date with technology changes) when they have no way to apply it with their favorite software, is not going to happen. People have to be passionate about *technologies*, not just the software they use.

I think that most developers or Drupal users that *are* excited about Drupal 8 and the new APIs (like myself), have been following the general evolution of our field over the past few years. We *know* it's the best thing. We actually *craved* for it.

## Final word: how hate for Adobe turned to love and gratitude

To finish, and this is more for the &ldquo;Backdroppers&rdquo;, let me tell you something else about me: I used to develop for Flash. And by develop, I mean using Actionscript 1.0. Actionscript 1.0 was a very designer-friendly language. It was simple, yet powerfull. But it was messy. Very messy. But, as designers and more *artistic* people, we don&rsquo;t mind. That&rsquo;s our way of life (right ?) 

When Actionscript 3.0 got introduced, my world crumbled. All the easy-hacks were gone. We had to start using *classes* (I had never heard of OOP before), *event listeners* (what&rsquo;s an *event* ?) and organize our code in seperate files (you can put Actionscript in *files* ?) 

Wow...

That was hardcore. It took me months to learn to code with Actionscript 3.0. I was mad at Adobe, as many others were. How could they do that to us ? At that point, if some alternative platform had existed, I would have switched to it. But there were none (Silverlight, are you serious ?), so I had to give in. And learn.

And learn I did. And, tell you what: after 4 months of sweat, tears and blood, my eyes opened. And I understood *why* Adobe had made the move. Everything was much clearer. I spent much less time trying to find bugs in my code. It was all of a sudden easy to find my way around in older code, or other peoples&rsquo; code. *It all made sense*.

I'm so happy Actionscript 3.0 came around. I might never have looked into other, purely *technical* languages like Ruby, PHP or Haskell if it weren&rsquo;t for that move Adobe made.

Drupal 7 was &ldquo;easy&rdquo;, &ldquo;hackable&rdquo; in many ways. And many didn&rsquo;t mind.

Trust me, though, that learning Drupal 8 *will be worth every minute of your time*. You will see a whole new world open, and understand things *many* other languages, like NodeJS, Java or Ruby, use as well.

Drupal 8 will *finally* become a modern framework. And I actually believe changes from now on will be less brutal and much easier to adjust to. For example: Symfony has managed to keep backward compatibility for several releases. But they had a very modern and structured approach from the start, something Drupal lacked.

Yes, the Drop is making quantum leaps. And yes, this has handicaped some of us. But, this time, it might actually finally arrive near it&rsquo;s destination and finally start a relaxed and pleasant trip to its final destination: world domination.
