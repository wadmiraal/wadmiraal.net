---
title: "Why not forget all our passwords completely ?"
description: "Heartbleed has prompted many users to change their passwords. But should we use passwords to begin with ?"
layout: post
tags:
  - Email
  - Wisdom
  - Rant
---

The Heartbleed bug has prompted thousands of people (including me) to reset all their (important) passwords.

I got 1Password, changed my most important passwords, revoked all SSH keys for my servers and GIT repos... A tremendous pain. And, probably, *a total waste of time*.

## We already have the best *access* manager possible

Yes, *access* manager, not *password* manager. 

Email. 

[I blogged about this last week](http://wadmiraal.net/lore/2014/04/07/less-is-more). I love email. There are so many ways we can use email.

Most services provide one-time password resets, sent *to your email*, which allow us to easily log in. This is a secure and easy way to access the service.

Usually, these then prompt you for a new password. This is great: you can just provide a super-strong, random password\* you forget as soon as you entered it, and use the service. This is very powerful, because it means you can provide very strong passwords, *and* that these passwords change very often, limiting the risks even more. 

Not all services will easily allow us to use this &ldquo;paradigm&rdquo;, but many do. Obviously, this makes our email very, *very* important. You'd better come up with a very complex password for your email, and change it regularly as well.

This is much easier to use/implement than two factor authentication, yet almost as secure. 

What do you think? Can we just rely on our email?

\* You can use [online](https://www.random.org/passwords/), [random](https://passwords-generator.org/) [password](https://identitysafe.norton.com/password-generator/) generators. Remember that many services still use hash-mechanisms for which lookup tables exist. Get as long a password as possible. Some (idiotic) services set a maximum length for passwords, but if that's not the case, go berserk. I like +20 characters in my passwords, but now use at least 30. You're never too safe.

