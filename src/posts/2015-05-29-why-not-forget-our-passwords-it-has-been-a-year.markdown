---
title: "Why not forget all our passwords completely: it has been one year"
description: "One year ago I wrote about why we should not use passwords online, and how email could help us provide better authentication methods. After one year of cheating the system, this is what I learned."
layout: post
tags:
  - Email
  - Wisdom
  - Rant
---

More than one year ago, I wrote [*Why not forget our passwords completely ?*](/lore/2014/04/13/why-not-forget-our-passwords/). In that post, I wrote about how *email* could be used as an *access manager* for our online applications. In fact, more and more online service start providing this option: instead of giving a password, you give your email address, and they send you a one-time login link.

## Cheating the password system: how I did it

Now, many services don't provide the above option. So I decided to use it anyway, but using a different method. I was getting really obsessed with the security of some of my online accounts, especially Github, Bitbucket, Evernote and Twitter. These are services I use almost everyday. Github and Twitter also serve as authentication providers for other services that I use, making these pretty critical.

Of course, I also use email. For my email, I use a *very* strong password as well as a two-factor authentication. The password is uber-long, has special characters, numbers, punctuation, etc. Email being the corner-stone of our online identities, you'd better make sure it's *super* safe.

Because of this, I felt confident using my email as my *access-manager*, meaning I would rely on my email for logging in to other services. Obviously, the above services don't provide this option. So I had to trick them into doing so.

For almost a year now, whenever I wished to login to an online service, I would go to the &ldquo;Forgot my password&rdquo; link and provide my email. Seconds later I would receive an email with a password reset-link.

Clicking on this link would take me to a password-reset form. I would provide a very long, random password\* I wouldn't even bother to write down. Just copy-and-paste, and save. Some services would log me in instantly after that, others would take to the login page again, where I would simply paste in the same password one more time.

And voilà: I am in. The advantages of this method is that the password changes very often, and each time it is a very hard password to crack.

The drawback is, obviously, that it's pretty long. It takes time, and is super annoying when using authentication providers for a third-party service (like I do with Twitter, a lot). But the worst part was authenticating on mobile. All this fiddling and copy-pasting long password on a mobile device is a true pain. In the end, it is this aspect that was a deal-breaker for me.

After almost a year, I decided to pull the plug.

*\*I use a generator to generate long (+40 characters), random passwords.*

## Using a better alternative: two-factor authentication

Twitter and Github offer two-factor authentication methods. At first, this may seem like a hassle (and it kinda is&thinsp;&mdash;&thinsp;always have your phone ready and charged), but it's still much easier than the above. Not all services allow two-factor authentication, though (or some do, but not for all countries). 

I would still prefer the email method, but I must say it *is* a good solution. Two-factor authentication allows you to use passwords that are less secure, and thus easier to remember. The fact a person needs access to your mobile phone for logging in makes it all pretty safe.

Twitter especially has a very nifty two-factor authentication method. Instead of using text messages, you can use your mobile Twitter app. As soon as a web application requests to login using your Twitter account, the app shows a notification on your phone, with a &ldquo;Yes&rdquo; or &ldquo;No&rdquo; question. You tap, and instantly the browser refreshes (how they do that so quickly, I don't know&thinsp;&mdash;&thinsp;I'm very impressed) and you're in. Much better than text messages.

## My time is more valuable than my data's security

In the end, some applications just don't do two-factor authentication. And some are just too much of a hassle to use with my above hack (I'm looking at you, LinkedIn). About 3 months ago, I decided to go back to using &ldquo;regular&rdquo; passwords for some services. My time is more valuable than my data's security in those apps. I'd hate one of my accounts to get hacked, for sure. But I use different passwords for almost all online services, and all include special characters, numbers, and are long enough to make rainbow tables inefficient (although for how long, no one knows&hellip;)

## Conclusion: passwords are the new IE6

Passwords are still the major way of authenticating users today. Worse, some services continue to enforce *maximum* lengths on passwords, or *prevent* you from using special characters (Microsoft does this; Banks do it; I even subscribed to a [SaaS hosting provider](https://twitter.com/wadmiraal/status/595112216107552768) that does this).

But passwords are a *terrible idea*. The whole concept is broken, especially because so many *morons* are responsible for the safe-keeping of these passwords, or don't allow people use complex ones (for reasons I cannot fathom; probably they write Assembly code for the backend).

And yet, passwords linger on. Know what that reminds me of? **IE6.** IE6 was one of the worst things that happened to our industry, and it took *years* to get rid of it ([even Microsoft got sick of IE6](https://www.modern.ie/en-us/ie6countdown)). I think passwords are going the same route. Just as with IE6, many people just don't realize yet how incredibly bad it is&hellip;

The user experience of security is important. We, in our industry, know how fragile online security can be. Security has become a luxury, and many users don't have access to it, because they don't have the necessary knowledge. Providing secure authentication methods that are intuitive and easy to use (again, kudos to Twitter for that) are essential for our users and for the future of our industry.

Just as with browsers some years back, big players in the industry (Google, Twitter, Github, etc) are showing the way by encouraging their users to use two-factor authentication. Others provide you with a fallback using email, sending you a one-time login link (Pinterest does this). However, it takes time for others, especially big companies that have a history in *not*-innovating, to catch up.

And, frankly, I don't think we can do much about it except wait it out. IE6 died in the end, it did. Passwords will too.
