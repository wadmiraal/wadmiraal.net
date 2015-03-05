---
title: "Cache the hell out of Drupal"
description: "Leverage Drupal's Cache API to make your modules fly."
tags:
  - Drupal
  - Performance and Scalability
---

Drupal is an awesome platform to work with and develop for. But, there's one thing it os as well: it's pretty heavy. Despite the fact Drupal can be *very* performant, more often than not you will notice significant slow downs on feature-heavy websites. What can you do about it? *Cache the hell out of Drupal!*

## There's Caching, Caching and Caching

When people talk about caching in Drupal, they can mean different things. The first is usually Drupal's built-in &ldquo; production mode&rdquo;. I sure hope you are using this on your site (unless you have good reasons not to). You can find it under Configuration > Performance. It tells Drupal to keep the rendered pages in cache for a certain time, greatly speeding up page load time. This can already have a huge impact on a site's performance.

However, on sites with heavy authenticated traffic, Drupal's page caching is turned off. The reason is simple: authenticated users might see the page differently than other users. The page might even be unique per user. So how could you cache that? Well, Drupal just doesn't. So, in these cases, you need to get that performance gain else where. In code.

### ESI

When dealing with heavy authenticated traffic, it's possible to use a technique called *Edge Side Includes*. This basically caches certain parts of the page, and allows you to only render the parts that are unique per user. It takes some extra work to setup though, because your web server needs to know about these parts and how to inject them into the page when serving it back to the user. Plus, it is not available on most shared hosting. This is why I won't dive into ESI in this post.

## Static PHP Cache

If you have a custom module, it might do some computation to return information, say a list. This list could be anything. Now say you wrote a nice function to return this list, and you call this function whenever you need the list. A problem arises if this function is called more than once, and the computation is done every time. Now you are wasting precious milliseconds for something you already did. Milliseconds might not seem like a lot, but they quickly add up, especially under load.

A simple work around is to use *static caching*. It's really simple:

<pre><code class="language-php">
function mymodule_get_list() {
  static $list;

  if (!isset($list)) {
    // Compute your list.
    $list = ...
  }

  return $list;
}
</code></pre>

What this code does is checking if the list was computed. If not, it computes it and stores the result in a static variable. Think of it as a Class property, that keeps the data for later re-use. The difference is static variables are only accessible to the local function. But we don't mind: we only need it there. The next time the function is called, we use the static variable and return immediately. This is a nice improvement *(side node: Drupal provides an ever better way using [`drupal_static()`](), but the principle is the same)*. But, imagine this list only changes every 2h. If you get 100 visites per minute during these 2 hours, you will compute this list value 12000 times, with the exact same value. In these cases, you might want to look for a more permanent cache.

## Drupal Cache API

Drupal comes with a very simple, but incredibly powerful [Cache API](). This API allows you to store data (any data&thinsp;&mdash;&thinsp;it takes care of serialization for you) in a semi permanent cache bin.

By default, this data gets stored in the database, but many modules provide other cache backends, like Redis, Memcache or even in static files. However, as a developer, you do not control where this is stored. But that doesn't mean you shouldn't make us of the cache API.

Lets take our example of the list again. This time, we use the Cache API *in conjunction with the static cache*. This is because there's a slight overhead to fetch the cached data. So, once you have it, you might as well reuse it.

<pre><code class="language-php">
function mymodule_get_list() {
  static $list;

  if (!isset($list)) {
    $cache = cach_get('mymodule:list');

    if (!empty($cache->data)) {
      $list = $cache->data;
    } else {
      // Compute your list.
      $list = ...
      
      // Store it in cache using the Cache API, with an expiration
      // timestamp for 2h in the future.
      cache_set('mymodule:list', $list, 'cache', time() + (60 * 60 * 2));
    }
  }

  return $list;
}
</code></pre>

Notice we check if the cache contains our list by using a unique identifier (called a *cache ID*, or *CID*). Convention dictates this should be prefixed with your module name when using the default `cache` bin (more on that below).

We also set an expiration timestamp. This tells the Cache API when the data goes stale and must be refreshed. One thing important to realize is that cached data must be considered volatile, meaning you cannot be sure it exists. This is why we always need to check the data and re compute if it doesn't exist.

### Don't Cache Everything

Now, when I say to cache the hell out of Drupal, I don't mean you should cache every single byte of information your module uses. If your list is a single entry from a database table, it would be overkill to cache it. Even if it is the result of a simple `SELECT` with multiple rows, it would probably still be overkill. The idea is that, if the data does not change often, and computing it takes longer than loading it from cache, cache it. Remember, though, that not all sites use the same cache backend. A site using Memcache will load cached data *much* faster than a site using the database (default).

### Custom Cache Bins

If you need to store a whole lot of data, the cache bin might get pretty full. The more data it contains, the slower lookups get. If you have a lot of cached data, it might be an idea to use your own cache bin. In theory, this is as easy as passing a custom name as the cache bin parameter. Most cache backends will take care of the rest. However, out of the box, Drupal maps cache bins to database tables. And it doesn't create new cache tables on the fly. Thus, you must create your own cache table. This is done on install, using the schema hook:

<pre><code class="language-php">
function mymodule_schema() {
  return array(
    'cache_mymodule' => drupal_get_schema_unprocessed('system', 'cache'),
  );
}
</code></pre>

This takes the schema definition for the core cache bin, and simply reuses it. Simple. Notice the convention for cache tables is to use your module name *as a suffix*, and not a prefix as usual. This is to quickly identify cache bins in the database (which you might want to exclude from your database backups).

You would then be able to store data in your own cache bin like so:

<pre><code class="language-php">
// We don't need to prefix the CID with our module name anymore,
// as everything in the bin belongs to our module anyway.
cache_set('list', $list, 'cache_mymodule', time() + (60 * 60 * 2));
</code></pre>

### Expiring Caches and CID strategies

A cache item is identified by its CID. This is not just a simple string: the Cache API allows you to use wildcards, which gives us some sort of cache *inheritance*.

For instance, say you have a specific page, and this page has several parts. You want to cache each part separately, and cache the whole result as well. So, you might have something like this:

    mymodule:page:{id}:complete
    mymodule:page:{id}:block_1
    mymodule:page:{id}:block_2

Whenever you want to clear everything for the page, you can call

<pre><code class="language-php">
// We must specify the cache bin. Passing TRUE as the last
// Parameter tells Drupal our CID contains a wildcard.
cache_clear('mymodule:page:{id}:*', 'cache', TRUE);
</code></pre>

This will cascade down to all the above CIDs.

Unfortunately, it is not possible to do the inverse: clear the parent cache if one child cache is busted. This requires some custom coding, but isn't that hard in most cases.

## Conclusion

Hopefully this will help you to start using Drupal's Cache API to improve your modules' performance. In some future post, I will talk about setting up different cache backends (like Memcache or Redis), which will improve your module speed even more.
