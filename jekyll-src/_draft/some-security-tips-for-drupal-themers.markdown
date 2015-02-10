---
title: "Some security tips for Drupal themers"
description: "Drupal is a very secure system, but we can make it vulnerable if we don't do our theming correctly. Here's some tips for themers."
layout: post
tags:
  - Drupal
---

As you probably know, the Drupal community is strongly committed to security. The [Drupal security team](https://security.drupal.org/team-members) is one of the largest of any open source project, and security vulnerabilities are treated swiftly and with great seriousness. In fact, the vast majority of security flaws are usually difficult to exploit, as it requires users to have some level of administration clearance, which on most sites is only given to trusted users. And, would a malevolent user get such an admin account, exploiting the said flaw would probably be the least of her concerns, as she would have access to much more valuable data anyway. Nonetheless, Drupal's security team deals with these vulnerabilities just as they would with more serious flaws, and modules or themes that fail to quickly correct them are blocked. But I digress.

*Tip: subscribe to the security newsletter to get updates as soon as security vulnerabilities are found and corrected. Log in, go to your profile page (click on your name), click **Edit**, then **My newsletters** and check Security announcements.* 

The reason I'm telling you all this is that Drupal sites *do* get hacked, but as many a surprised Drupal themer learns, it is more often than not the *theme* that is at fault.

This is likely to change when Drupal 8 comes out, but as Drupal 7 is here for some years still, let me explain why the theme can be a serious risk and how you can easily avoid it.

## Clean Escape

The single most made mistake by themers is *not* escaping variables that are printed.

*I don't blame them !* This is clearly a problem in educating both module maintainers and themers. The main reason behind this confusion is that it is not always clear what is safe to output and what is not. This is a big problem, as *not* escaping variables can be a security risk, whereas *double* escaping variables can have undesired results and mess up the output.

Module maintainers are always encouraged to clearly indicate which variables are already escaped, and which ones are not. For instance, a module that adds a new property on a node may automatically make this property available in the node template. However, if this property is not escaped, and a themer unknowingly prints it out "raw", we expose our site to exploits. Take this example:

A classified ads site lets users create an account and post ads. We use a module that creates a custom node type for this. Imagine it has a body, title, etc. Most of these fields are Drupal fields; hence, Drupal handles them and makes certain they are escaped at render time and safe for printing.

However, the module adds one custom field for a bio section. This field is *not* handled by Drupal, and unfortunately not escaped at render time. A malevolent user, Jeannine, knows this flaw, and confirms that on the site, the themer *did not* escape the bio field.

If she were to put this deceptively simple code in there, she would be able to take over *any user account* (User-1 in our example, which is the worst that could happen) as soon as *any admin* visits her ad (which is highly likely when ads are validated by hand):

    (function($) {
      $.get('/user/1/edit', function (data, status) {
        if (status == 'success') {
          var matches = data.match(/name="form_token" value="([a-z0-9]*)"/);
          
              console.log(matches)
              
              return;
              
          var data = {
            form_id: 'user_profile_form',
            form_token: token,
            'pass[pass1]': 'pwned',
            'pass[pass2]': 'pwned'
          };
          
          $.post('/user/1/edit', data);
        }
      });
    })(jQuery);

This is why you should *always* triple-check your templates and make sure that *everything* that is being printed out is safe.

### Solution

Be paranoid. *Never* expect a variable to be safe unless it specifically says so (like the `safe_value` key on Drupal fields-you were printing these ones and *not* the `value` keys, right ?)

If a variable uses no HTML markup, pass it through `check_plain`, like so:

  <?php print check_plain($value); ?>

If it does contain markup, it is going to be trickier. Usually, the variable will contain some information on the *format* being used (like *filtered HTML* or *full HTML*). In many cases, the variable will have a `value` key and a `format` key. If you do not know the format, just pick a restrictive one and use it by default. It's better to strip too much HTML than not enough. You can then use `check_format` to strip unauthorised HTML:

  <?php print check_format($value['value'], ['format']); ?>

CHECK CHECK CHECK

## Hacking and SQL injection

Sometimes, themers are not specially good at PHP programming (why should they? We expect them to know HTML and CSS). I've seen many themes where PHP code was being executed *directly inside a template*. Except for the fact that this violates the principle of *separation of concerns*, it sometimes also leads to vulnerabilities by SQL injection.

For instance, a newcomer to Drupal might want to display some informatiom about a node. This information (say, a read count) is not directly available on the node object. However, instead of using the appropriate APIs to retrieve this info, the themer uses something like this:

  db_query ("SELECT * FROM {node_read} WHERE nid = " . arg(1));

CHECK CHECK TABLE
CHECK CHECK CHECK D7 DB SYNTAX
CHECK CHECK CHECK EXPLOIT USING /node/bad GOING TO /node

This might not pose a problem on the node page itself, but on some default pages like /node, it can be quite dramatic. Even if you do not use this page on your site, it is still there.

### Solution

RTFM, or get some help. *Never* execute SQL queries directly unless you really know what you're doing.

## Drupal 8 And Twig

In Drupal 8, Drupal's in-house template engine PHPTemplate will be dropped in favour of Twig.

Twig is a beautifully elegant, *fast* and flexible template engine. But one of the biggest advantages it has over the old PHPTemplate is security.

PHPTemplate was pretty fast compared to many other tools in the industry, and it was fairly easy to use, even for nontechnical users. However, its biggest flaw was that it executed PHP code directly. Twig, on the other hand, allows no code execution. Furthermore, Twig can be configured (and will be in Drupal 8 CHECK CHECK CHECK CHECK) to *always* escape variables that are being printed out. So, the risk of a theme outputting malovalent code is greatly reduced.