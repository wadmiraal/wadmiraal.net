---
title: "Thank You This"
description: "For SEO"
layout: post
favorite: false
tags:
  - Javascript
  - Code
  - For lolz
---

The `this` keyword in Javascript has been screamed at, laughed at, insulted, and many more terrible things. When I believe
we should be thankful for this little guy: he's here for a reason.

## A little &ldquo;history&rdquo;

*I'm completely making this up! Don't post in on Wikipedia claiming this is
for real and all!*

We can only imagine that it went somewhat like this. Some smart guys working on
Javascript decided to implement *Objects*, similar to *Classes* in some ways.
And Bill said:
> Wait a minute. We have this uber-cool method on our String object called
> `toUpperCase`, and your telling me that every single string will have to
> recompile this method for its own use? What if we have 200 strings\*? Have you
> any idea how much memory that would use?

*\* Remember, in those days, javascript was slooooow.*

And Dr Dre said:
> So what do you suggest, smarty pants?

So Bill said:
> Hmmm&hellip; What if we kept a &ldquo;copy&rdquo; of our String object, like the parent of all
> strings, and only compiled the methods on that one. Then all the &ldquo;child&rdquo;
> strings could simply re-use those methods!

So Dr Dre said:
> Duh, how would you get the actual string's string property? We can't ask
> programmers to pass the string as a parameter all the time. That won't look
> cool. Remember, we want to play with the cool kids. That's why we called it
> **Java**script, remember?

And Bill said, sealing Javascript's fate forever:
> What if the `this` keyword did not necessarily refer to the object the method
> was compiled on? What if it depended *on the context it was called on?*

And the rest is history.

## Why this is so powerful (pun intended)

You see, Javascript's *prototypal* inheritance model is actually really flexible
and useful. It allows developpers to access the *parent* methods, properties, etc
without having to compile them on the child objects\*. How's that for cool?
Consider this example:

    var objects = {};

    function MyObj(name) {
      this.name = name;
    }

    MyObj.prototype.myMethod = function() {
      var hi = "hi",
          there = "there",
          you = "you",
          yes = "yes";
    }

    MyObj.prototype.myOtherMethod = function() {
      var hi = "hi",
          there = "there",
          you = "you",
          yes = "yes";
    }

    MyObj.prototype.myThirdMethod = function() {
      this.myOtherMethod();
      this.myMethod();

      return this.myFourthMethod();
    }

    MyObj.prototype.myFourthMethod = function() {
      return this.name;
    }

    for (i = 0; i < 1000; i++) {
      var obj = new MyObj("obj" + i);

      var name = obj.myThirdMethod();

      objects[name] = obj;
    }

What we're doing here is creating 1000 instances of the MyObj object. Let's popup
Chrome's web profiler and see what we've got:

![Figure 01](/posts-media/thank-you-this/fig01.jpg)

We see that our first element's *shallow size* is 12B and
all child instances 16B.

Hmm&hellip; And what if we try this:

    var objects = {};

    function MyObj(name) {
      this.name = name;

      // Private methods! Yay!
      var myMethod = function() {
        var hi = "hi",
            there = "there",
            you = "you",
            yes = "yes";
      }

      var myOtherMethod = function() {
        var hi = "hi",
            there = "there",
            you = "you",
            yes = "yes";
      }

      this.myThirdMethod = function() {
        myOtherMethod();
        myMethod();

        return this.myFourthMethod();
      }

      this.myFourthMethod = function() {
        return this.name;
      }
    }

    for (i = 0; i < 1000; i++) {
      var obj = new MyObj("obj" + i);

      var name = obj.myThirdMethod();

      objects[name] = obj;
    }

Let's check Chrome again:

![Figure 02](/posts-media/thank-you-this/fig02.jpg)

Lo! Behold! Now, all shallow sizes have gone up to 24B! What happened? Well,
simply put, each and every child instance has his very own methods, compiled just
for him. Basically, every child as an exact copy of the same method. 1000 copies&hellip;
Scary, isn't it?

So, what else can we do, knowing that all public methods need only be present on
the Object declaration, the *parent*, so to speek?

The prototypal model allows developpers to extend Objects (by adding to the
`prototype` property) at runtime. This means that, if you think
`Array` misses a method, you can add it at runtime like so:

    Array.prototype.first = function () {
      return this[0];
    };

Now, when adding this at runtime with a classical model, all existing objects
do not inherit this method, because they're already compiled. But because of the
*prototype* model, all arrays can now call `first()`: javascript will notice that
the array does not have the method/property, look at the parent object and see if
he finds it there. And because `this` is bound to the *context* and not the
object itself, we can safely use it in our code and access all the properties we
need. In the words of the great Einstein:

> This is great!\*\*

*\*Now this obviously sounds really cool and nice and all, but there's actually a few gotchas.
You have to take into account speed, retained size, etc.*

*\*\*Come on, I'm sure he must have said at least **once**.*

### Bonus feature

`this` also allows developpers to create *Interface*-like objects, that can interact
with elements by using the `this` keyword without having to add any methods to
the element's `prototype` at all.

For more info I really recommend vjeux's article [Javascript – How Prototypal
Inheritance really
works](http://blog.vjeux.com/2011/javascript/how-prototypal-inheritance-really-works.html).

## So why's everyone confused (and hatefull) ?

I personnaly believe (and have found this to be true for me) that the reason
people get confused about `this` is that developpers&thinsp;&mdash;&thinsp;and even javascript creators like [Brendan Eich](http://brendaneich.com/)&thinsp;&mdash;&thinsp;tend
to treat javascript like OO languages. Look at the `new` keyword: just syntactic
sugar. There's no such thing as a `new` instance in javascript. There are even
[discussions](http://brendaneich.com/2011/10/jsconf-eu/)
about adding *Classes* to javascript in the future. But only as a **syntax**.
Behind the scenes, javascript will still be the same.

## What to do (IMHO)

I personnaly believe that we should just start using javascript the way it was
supposed to be. True, we are bound to using `new`, as javascript does not provide
a *real* way to extend another Object's prototype otherwise (ironic). But we
should embrace `this` in all it's weird, awkward forms.

We should give him the
love he deserves, the warmth he craves for.

In the words of Princess Fiona (Shrek):

> You're a little unorthodox, I'll admit.
>
> But thy deed is great, and thy heart is pure.
>
> I am eternally in your debt.

So&hellip;

Thank you `this`.
