---
title: Take your editor's UX to the next level, part 1.
description: Drupal is pretty nice out of the box, but often it can use some tweaking to improve the editors' UX. This is how I tackle this.
layout: post
tags:
 - Drupal
 - Wisdom
 - UX
---

When doing a Drupal project, what is the most important group of people you should tend to? *The content editors.* Why? Because they will be using the site most. If the content editors (which, sometimes, is the main client himself) are happy with what you gave them, there's a good chance they will vouch for you when new projects come along.

We, as an industry, still have a lingering image of nerds and geeks that build applications that are hard to use. Sure, the last few years have seen a *tremendous* improvement in UX and UI design. But, the reputation tends to stick.

What I'm getting at is, if you provide an awesome user experience to your client (which will mostly be felt by the content editors), you will stand out. And standing out is the best way to get more work.

## Drupal's UX And UI

If you've been doing Drupal for some time, you will know that, out of the box, it's not too bad... OK, it sucks. The UI is convoluted, there are many options, the out-of-the-box permissions don't give us fine-grained control over what editors can see or not, etc.

If you've used Drupal since Drupal 6 (or even before&thinsp;&mdash;&thinsp;I started when Drupal 6 came out), you know Drupal 7 is already much better than Drupal 6. And, having played around with Drupal 8, I can tell you it is, in turn, better than Drupal 7. So, that's good news.

But, Drupal's interface **will always be intended for site builders**. Site builders are not content editors. Site builders expect UIs to be more complex, because they need all those settings to tweak the site just how they want it. Content editors, on the other hand, are usually not technically inclined, and have better things to do than read a manual.

That's where you come in. For your next project, *do not settle for Drupal's default experience*. Trust me, if you invest some time in getting the UX just right (budget it upfront, if you have to), your clients will love you for it.

## Small Wins

I recommend looking [at this presentation](http://www.slideshare.net/PamelaBarone/for-the-love-of-the-content-editors-drupalcon-prague-27036809), given by Pamela Barone ([@pameeela](https://twitter.com/pameeela)) at DrupalCon Prague in 2013. It's brilliant, and packed with good advice. She talks about a bunch of modules she uses at [PreviousNext](https://www.previousnext.com.au/) to improve the content editor experience. These modules are simple to install, yet can greatly improve the content editing experience.

I won't go over all these modules; to me, they don't apply to all projects. But, some that I definitely recommend for 95% of projects are:

* [CKeditor](https://www.drupal.org/project/ckeditor)
* [Admin views](https://www.drupal.org/project/admin_views)
* [IMCE](https://www.drupal.org/project/imce)
* [Link it](https://www.drupal.org/project/linkit)
* [Login destination](https://www.drupal.org/project/login_destination)
* [Admin menu](https://www.drupal.org/project/admin_menu)
* A nice administration theme (Pamela suggests [Shiny](https://www.drupal.org/project/shiny) in her talk; it's very nice, indeed)

I assume you are installing some sort of WYSIWYG editor on most of your projects. If you are using the [WYSIWYG](https://www.drupal.org/project/wysiwyg) module for it, I recommend you to switch to a module providing a single editor instead (CKeditor is very good, and will ship by default with Drupal 8). The reason is, the WYSIWYG module only allows you to use the &ldquo;lowest common denominator&rdquo;, meaning some very nice functionality of one editor might not be available, because other editors don't support it. The WYSIWYG was a great idea on paper (having a single API with which a wide variety of WYSIWYG editors could be used, allowing you to switch the editor at the click of a button). Unfortunately, you miss out on great improvements made by some projects (like CKeditor), as the other supported editors fail to catch up.

When setting up a WYSIWYG editor, provide a strict minimum of buttons. The less, the better. First, it prevents editors from messing up the design (font colors...) and gives them less distraction. Of course, the exact set of features should be discussed upfront with the editor team.

Pamela also suggested using *help text*, which is great advice. When creating content types and adding fields to them, there are optional *description* fields. *Do not ignore these*. Put some helpful, well worded text in there, so editors know what this field is for. Don't make them think: let them focus on the task at hand. Another great tip: put the fields in their order of appearance once rendered.

When content types get very large (meaning, many fields), it is a good idea to group fields together. The [Field group](https://www.drupal.org/project/field_group) module allows you to do just that, and even allows you to put these groups in the vertical tabs in the form footer, or in horizontal tabs. For instance, some fields might rarely change, and others need constant updating. If so, put your fields in 2 horizontal tabs. The one opened by default is the one containing fields that change often. The other ones are just a click away, but do not distract the editor.

## Next Steps

The above are quick wins, easy steps that will greatly improve the site UX, while being cheap to implement. In my next post, I will discuss taking this a step further by going into code.
