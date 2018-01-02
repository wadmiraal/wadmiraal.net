---
title: "Don't hack the Drupal database !"
description: "Hacking core is bad, but this goes further than just hacking code. Changing the database schema can also have very bad effects down the road. Here's why."
layout: post
tags:
- Drupal
- Wisdom
---

We all now the One Golden Rule for Drupal: *Thou shall not hack core!*

Hacking source code of *any* project is almost always a Bad Idea&tm;. It can lead to unforeseen bugs and make updated a nightmare. How many projects have just completely opted out of updating their source code or libraries because of undocumented modifications? I worked on a Drupal site (pretty large, lots of traffic) that had not been updated *for 3 years*. That's *huge*, and almost all skipped updated were security updates.

But, there's another *hack* some coders make: they change the database schema.

## Why Would You Want To Do That ?

Of course, it could make sense. If you want to track a simple value for each node, for instance, it is much simpler to just add a new column to the `node` column (like, `read_count`). But this has some serious drawbacks.

## Just Don't

The main drawback is that it can screw up `INSERT` statements. You'd better make sure you have some default value set! But even then, it might not always work, depending on your database system and its version.

If you try to use the following statement:

    INSERT INTO {node} VALUES (NULL, vid, title, );

It will probably fail, as the `VALUES` statement does not contain enough columns (it's missing the `read_count` we talked about earlier).

## How To Do It

Simple: just create your own, one-on-one table in the database. Yes, there will be a (tiny) overhead, but because Drupal's content is *all over the place* in the database, this one more table won't make a difference.

If you don't know what a one-on-one table is, it's simply a database table that has the same number of rows as its *companion* table, in our case `node`.

You could create the following table:

    function my_module_schema() {
      return array(
        'my_module_node_read_count' => array(
          'fields' => array(
            'nid' => array(
            
            ),
            'read_count' => array(

            ),  
          ),
        )
      );
    }

The advantage of doing things this way is that it's:

* clean
* more robust
* self-documenting

The relationship parts in the `hook_schema` definition have no effect on the database per-se, but serve as a documentation for other developers.

What *will* make a difference, however, is the fact that you leave the core database schema intact. This will prevent any potential errors that might arise when using other modules (or even simply core). It is also much clearer; if a developer searches where you store that `read_count` you provide through your module, there's a good chance the `node` table will be the **last** place she will look. You're just not supposed to touch it.

## Conclusion

