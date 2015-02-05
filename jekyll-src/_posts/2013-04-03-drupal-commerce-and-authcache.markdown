---
title: "Drupal Commerce and Authcache"
description: "Drupal Commerce does not work well with caching solutions, as many parts of a page are unique for each user (like the cart). Authcache provides mecanism to solve this problem."
layout: post
tags:
  - Drupal
  - Performance and Scalability
---

Whereas Drupal 6 could take a serious punch when it comes to performance, memory usage and speed, Drupal 7 on the other hand can sometimes get painfully slow. This is particularly the case when creating ecommerce sites using Drupal Commerce. Don't get me wrong: Drupal is an awesome product, and Drupal Commerce is the best commerce platform out there - period.

But on shared hosts, a Drupal Commerce install can be slow as hell.

We had a fairly large and complex site for a client where page requests could take as long as 8 seconds. This was unacceptable. So we found a solution.

## Caching for authenticated users

Drupal has a fairly efficient caching mechanism, which allows us to cache pages and/or blocks for anonymous traffic. However, there are 2 major cases where the Drupal cache system does not help:

1. When having a lot of authenticated traffic
2. When pages contain user-centric data

This is obviously on purpose, as a caching system that needs to take into account user-centric data and satisfy every use-case would be bloated, heavy and unmaintainable. That's why Drupal provides a caching API so other modules can extend this mechanism and provide their own logic.

In comes [Authcache](http://drupal.org/project/authcache).

Authcache allows pages to be fully cached based on the user role(s), assuming that most of the page content is role-centric instead of user-centric. For those parts that *are* user-centric, though, it provides a simple &ldquo;callback&rdquo; API which allows these parts to be rendered seperately server-side, and inserted into the page via AJAX requests. Think of it as a poorman's <abbr title="Edge Side Include">ESI</abbr>.

## Extending Authcache

The Authcache API is not very developer friendly. By default, it makes developers write global callbacks (prefixed with *_authcache_*).

On the client side, these callbacks are global JS functions. On the server-side, these are PHP functions **that must live in a authcache_custom.php** file in the configuration directory.

This is crap (IMHO). It prevents other modules from extending the module in a install-and-forget fashion. It makes people copy code around - which is not going to be enough for us.

Luckily, there is a very simple hack that allows module developers to package functionality inside a module and distribute it in a user-friendly manner. This approach was used for [Commerce Authcache](http://drupal.org/project/commerce_authcache), the module we created to allow our Commerce sites to be fully cached, refreshing only the parts that are user-centric (like the cart).

But first, a simple walkthrough. Let's use the Commerce Cart example from [Commerce Authcache](http://drupal.org/project/commerce_authcache).

### Overwriting the block content

We want to be able to swap the cart block with the actual cart content with an AJAX request. Of course, we do not want to hack the Commerce Cart module. So we implement [`hook_block_view_alter`](http://api.drupal.org/api/drupal/modules%21block%21block.api.php/function/hook_block_view_alter/7) to change the block content on the fly.

    // In commerce_authcache.module

    /**
     * Implements hook_block_view_MODULE_DELTA_alter() for the Commerce Cart cart block.
     */
    function commerce_authcache_block_view_commerce_cart_cart_alter(&$data, $block) {
      // Authcache provides a global flag telling us wether the current request is cacheable or not.
      global $_authcache_is_cacheable;

      if (!empty($_authcache_is_cacheable)) {
        // Include the JS, which will trigger the AJAX request and insert the block content.
        drupal_add_js(drupal_get_path('module', 'commerce_authcache') .'/js/commerce_authcache.js');

        // Change the block content to be an empty div, but with a unique, easily identifiable ID.
        $data['content'] = '<div id="commerce-authcache--commerce-cart-cart-block" class="authcache-target commerce-authcache-target">&nbsp;</div>';
      }
    }


Now, each time the block is rendered and the request is cached by Authcache, we replace the block with a simple, empty container. Notice we added some CSS classes, so themers can customize the look of the container while it's being loaded.

Next, we need to implement the client-side logic. We add a new behavior to the Drupal object (similar to jQuery `$(document).ready()`), which will check if the cart block is on the page and, if so, trigger the AJAX request.

    // In js/commerce_authcache.js

    ;(function($, Drupal, undefined) {

      Drupal.behaviors.commerceAuthcache = {

        attach: function(context) {
          // Is the cart block located on the current page ?
          if ($('#commerce-authcache--commerce-cart-cart-block', context).length) {
            // Trigger a request with Authcache.
            Authcache.ajaxRequest({
              // The key is the callback, both server and client-side.
              commerce_authcache__commerce_cart_cart_block: 1,
            });
          }
        }

      };

    })(jQuery, Drupal);

This will tell Authcache to fetch content from the server. It will call a function called `_authcache_commerce_authcache__commerce_cart_cart_block()` on the server, first. The return value of that function will then be serialized in JSON, sent back to the browser and passed to a JS function, also called `_authcache_commerce_authcache__commerce_cart_cart_block()`. This function can then refresh the HTML on the page.

### Hack

As mentioned above, Authcache will look inside a *authcache_custom.php* file in the configuration directory for the callbacks. This is not good. However, there's a way around this.

Authcache bootstraps Drupal up to the SESSION phase. This means that all boot modules are loaded at that point. The trick is to make our module bootable as well, by declaring [`hook_boot`](http://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_boot/7). This can be an empty function. It just has to exist.

    // In commerce_authcache.module

    function commerce_authcache_boot() {
      // Dummy implementation - allows the .module file to be included at bootstrap.
      // This allows us to write the _authcache callbacks in our module file, instead
      // of copying them to sites/*/authcache_custom.php.
    }

This will make sure out module is loaded on Authcache requests. Thus, we can simple declare our callbacks inside our `.module` file !

### Adding the callbacks

Now, we simple need to add our server-side callback first:

    // In commerce_authcache.module ! Yay !

    function _authcache_commerce_authcache__commerce_cart_cart_block() {
      // We need to bootstrap Drupal fully, as we need the theme system, form API, unicode handling as well as all module
      // dependencies fully loaded.
      drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);

      return commerce_cart_block_view('cart');
    }

Notice how we're depending on Drupal being fully bootstrapped in our particular case, because Commerce Cart uses the [`theme`](http://api.drupal.org/api/drupal/includes%21theme.inc/function/theme/7) function. Because Authcache only bootstraps Drupal up to the SESSION phase, we manually go further up to the FULL phase. Note that, even though this does increase the memory footprint, it will only do so on pages that include the cart block. And because it's asynchronous, users won't notice that much of a difference.

Finally, we must add our JS callback as well:

    // In js/commerce_authcache.js

    function _authcache_commerce_authcache__commerce_cart_cart_block(vars) {
      // Notice we're using jQuery and not $. This is because Drupal calls jQuery in no conflict mode.
      jQuery('#commerce-authcache--commerce-cart-cart-block').replaceWith(vars.content);
    }

And presto ! We just implemented Authcache in a clean, logical way.

[You can find the complete Commerce Authcache module here](http://drupal.org/project/commerce_authcache).