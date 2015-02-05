---
title: "Semantic versioning is the way to go"
description: "Drupal 8.x will start using semantic versioning. I think it's the right choice, here's why."
layout: post
tags:
  - Rant
---

I've always been puzzled by the way some software companies version their products. Having a product with a version of 2.34.1.2585368.35779532 strikes me as confusing and error-prone. 

That's why I loved Drupal's approach when I first saw it: 7.26. Major version [dot] minor version.

When the first number changes, the API changes. 7.x is not compatible with 8.x. When the minor version changes, the API does not change. 7.1 is compatible with 7.26 (kinda). Easy. 

But how do you differentiate between a bug fix or a new feature? For Drupal core, it used to be a no brainer. New features always had to wait for the next major version. Hence their version system. But if you're a module or distribution maintainer, you have 3 different cases:

1. Bug fixes
2. New backward compatible features
3. Major overhaul, not backward compatible

Even though most people probably don't care too much what they get, as long as it's the latest and greatest, some are interested in knowing what they are downloading.

When Drupal projects will be able to use the [Semantic Versioning System](http://semver.org), we will make it clearer. We would have the Major version, as before. A Minor version, denoting *feature changes*. And finally a Patch version, which denotes a bug fix. 

1.5.2

Still easy. But it carries more information. 

And the great news is: [Drupal will start using it from 8.x onwards](https://infrastructure.drupal.org/node/88). 
