---
title: "How Git Hooks Made Me A Better (And More Lovable) Developer"
description: "Git are an incredible way to enhance your development workflow, encouraging - and even enforcing - you to embrace best practices and write better commit messages."
layout: post
favorite: false
tags:
  - Wisdom
  - Code
  - Git
---

I've, for a very long time, been telling myself *&ldquo;I really should enable some Git hooks here to (run unit tests|spell check my commit message|some other task)&rdquo;*.

But, as usual, I've also, for a very long time, postponed this enabling of Git hooks for reasons we all know: layzness, to busy, procrastination.

Then, I finally decided it was time I dug into it.

## Git Hooks Allow You To Enforce Best Practices (For Yourself)

We all know (and love) best practives. We just don't always have the time (or mental energy) to apply them. It's lazyness on our part, but what can you do ?

Well, for a start, you can create a *Git hook*.

### A Short Note On Git Hooks

If you're not familiar with Git hooks, they basically are small shell scripts that can be automatically run on certain *events*, like a commit, a push, etc.

There are a lot of them. You can find information on existing hooks, what they do and how to implement them [here](http://www.githooks.com).

To create (and enable) a Git hook, create a file with the hook name in ``.git/hooks``. So for a *pre-commit* hook, you would create ``.git/hooks/pre-commit``.

Next, open the file and (on Unix systems), add

<pre><code class="language-bash">
#!/bin/bash

</code></pre>

at the top.

Finally, Git will not invoke the hook if it's not executable. Meaning you need to call

<pre><code class="language-bash">
chmod +x .git/hooks/pre-commit

</code></pre>

to &ldquo;enable&rdquo; it.

## Pre-commit Hooks, Or How To Become A Better Developer (at least looking at your commit history)

The most useful, in my opinion, is *pre-commit*. Pre-commit hooks are run *before* the commit is made. This means you can use ``git add`` normally, but as soon as you run ``git commit`` (or ``git commit -am``), this hook is invoked. If it exits with something (like ``1``), Git will think there's an error and *abort the commit*.

How's this useful ?

For starters, say you develop in PHP. You probably **never** want to commit code with PHP syntax errors, right ? But it probably has happened, and probably will happen again. So...

### Check PHP Syntax Errors Before Committing

This is a nifty pre-commit hook I've set up (and set up for all PHP projects).

<pre><code class="language-bash">
git diff --cached --name-only | while read FILE; do
if [[ "$FILE" =~ ^.+(php|inc|module|install|test)$ ]]; then
    php -l "$FILE" 1> /dev/null
    if [ $? -ne 0 ]; then
        echo -e "\e[1;31m\tAborting commit due to files with syntax errors" >&2
        exit 1
    fi
fi
done

</code></pre>

Let's go through these, line by line.

<pre><code class="language-bash">
git diff --cached --name-only | while read FILE; do

</code></pre>

This tells Git to return the files that have changed, but only their names. We pipe the result to a ``while`` loop, which goes over each file name, assigning them to a variable called ``FILE``.

<pre><code class="language-bash">
if [[ "$FILE" =~ ^.+(php|inc|module|install|test)$ ]]; then

</code></pre>

We then pattern match the file name. If it ends in one of the listed extensions (note I'm listing Drupal file extensions as well), we...

<pre><code class="language-bash">
php -l "$FILE" 1> /dev/nul

</code></pre>

Pass it through the ``php`` linter, pumping the result straight to ``/dev/null``.

<pre><code class="language-bash">
if [ $? -ne 0 ]; then

</code></pre>

If there's a result in memory, it means we have a PHP error.

<pre><code class="language-bash">
echo -e "\e[1;31m\tAborting commit due to files with syntax errors" >&2

</code></pre>

We output an error message. Note the ``-e`` and ``\e[1;31m``, which will output the message in red.

<pre><code class="language-bash">
exit 1

</code></pre>

We exit with &ldquo;something&rdquo;. Anything would do &mdash; we're just telling Git to abort the commit.

<pre><code class="language-bash">
    fi
fi
done

</code></pre>

This is obvious, right ?

This hook will make sure you will *never* commit invalid PHP code again. Pretty neat, huh ?

### Run Your Unit Tests

What do you mean, *&ldquo;I don't have unit tests&rdquo;* ?

If you have unit tests for your code, you probably **never** want to commit code that does not pass your tests. Say your tests are written for [PHPUnit](http://phpunit.de/). This will call PHPUnit and abort the commit if the tests fail.

<pre><code class="language-bash">
git diff --cached --name-only | while read FILE; do
if [[ "$FILE" =~ ^.+(php|inc|module|install|test)$ ]]; then
    /home/wadmiraal/.composer/vendor/bin/phpunit 1> /dev/null
    if [ $? -ne 0 ]; then
      echo -e "\e[1;31m\tUnit tests failed ! Aborting commit." >&2
      exit 1;
    fi
fi
done

</code></pre>

I won't go over each line, but the important one is

<pre><code class="language-bash">
/home/wadmiraal/.composer/vendor/bin/phpunit 1> /dev/null

</code></pre>

I installed PHPUnit through composer. I have a ``phpunit.xml`` file in my project configuring my test suites. If the tests fail, the commit is aborted and a red warning spit out. Pretty cool.

### Remove Debug Calls

Sometimes we forget some tracer code we used locally (like ``dpm`` calls in Drupal, or ``console.log`` in Javascript). Sometimes this is just a performance problem, but other times it actually breaks the system because some debug library has not been included in the production code.

This pre-commit hook checks for certain patterns in code and warns me about it. Note that it does not block the commit like before, because we sometimes *want* to commit debug code. It only warns me.

<pre><code class="language-bash">
git diff --cached --name-only | while read FILE; do
if [[ "$FILE" =~ ^.+(php|inc|module|install|test)$ ]]; then
    RESULT=$(grep "dpm(" "$FILE")
    if [ ! -z $RESULT ]; then
      echo -e "\e[1;33m\tWarning, the commit contains a call to dpm(). Commit was not aborted, however.\e[0m" >&2
    fi
fi
done

</code></pre>

I won't go over each line this time, but the

<pre><code class="language-bash">
RESULT=$(grep "dpm(" "$FILE")

</code></pre>

line calls ``grep`` and checks for the ``dpm(`` pattern (Drupal debug code). If it finds it, it will print a warning message so I'm aware I'm committing a call to ``dpm()``.

### Follow Coding Standards

This is one of my favorites. I love coding standards, I always try to adhere very strictly to one. Doing a lot of Drupal development, I try to stick to its standards as closely as possible. But I always seem to forget some rule. Not anymore.

#### Install PHP Code Sniffer And The Drupal Sniffer

[PHP Code Sniffer](https://github.com/squizlabs/PHP_CodeSniffer) is a handy tool that will check your code (not just PHP) and tell you where you do not comply with a given standard.

Drupal has its own sniffer implementation. It ships with the [Coder](https://www.drupal.org/project/coder) module. You don't need the module itself, but the sniffer it contains (in the ``coder_sniffer/Drupal`` subfolder).

Install PHP Code Sniffer, and clone the Coder Git repo somewhere on your system.

#### Create The Hook

Note the paths to the ``phpcs`` executable and the path to the Drupal sniffer. Change these accordingly.

<pre><code class="language-bash">
git diff --cached --name-only | while read FILE; do
if [[ "$FILE" =~ ^.+(php|inc|module|install|test)$ ]]; then
    /home/wadmiraal/.composer/vendor/bin/phpcs --standard=/home/wadmiraal/.drupal/modules/coder/coder_sniffer/Drupal "$FILE" 1> /dev/null
    if [ $? -ne 0 ]; then
        echo -e "\e[1;33m\tWarning, some files do not respecting the Drupal coding standards. Commit was not aborted, however.\e[0m" >&2
    fi
fi
done

</code></pre>

Again, I won'to go over each line, the important one being

<pre><code class="language-bash">
/home/wadmiraal/.composer/vendor/bin/phpcs --standard=/home/wadmiraal/.drupal/modules/coder/coder_sniffer/Drupal "$FILE" 1> /dev/null

</code></pre>

Here we check all files with ``phpcs``, providing the Drupal sniffer. Here again, I don't abort the commit. I can't always follow Drupal's coding-standards to the letter, but at least I am aware of it and can stick to it as much as possible.

### Putting It All Together

If you just copy-and-paste all the above, you will notice your hook doesn't behave as expected. That is because the different invocations will override each other. So, a PHP syntax error might still get commited. If you want combine these, use ``if/else`` statements to group them, executing *blocking* conditions first and on their own (meaning, if they fail, abort and exit) and *non-blocking* conditions last and in sequence.

So my above example looks like this:

<pre><code class="language-bash">
#!/bin/bash

git diff --cached --name-only | while read FILE; do
if [[ "$FILE" =~ ^.+(php|inc|module|install|test)$ ]]; then
    php -l "$FILE" 1> /dev/null
    if [ $? -ne 0 ]; then
        echo -e "\e[1;31m\tAborting commit due to files with syntax errors" >&2
        exit 1
    else
        /home/wadmiraal/.composer/vendor/bin/phpunit 1> /dev/null
        if [ $? -ne 0 ]; then
            echo -e "\e[1;31m\tUnit tests failed ! Aborting commit." >&2
            exit 1;
        else
            /home/wadmiraal/.composer/vendor/bin/phpcs --standard=/home/wadmiraal/.drupal/modules/coder/coder_sniffer/Drupal "$FILE" 1> /dev/null
            if [ $? -ne 0 ]; then
                echo -e "\e[1;33m\tWarning, some files do not respecting the Drupal coding standards. Commit was not aborted.\e[0m" >&2
            fi

            RESULT=$(grep "dpm(" "$FILE")
            if [ ! -z $RESULT ]; then
                echo -e "\e[1;33m\tWarning, the commit contains a call to dpm(). Commit was not aborted, however.\e[0m" >&2
            fi
        fi
    fi
fi
done

</code></pre>

## Commit-msg, Or Why You're Colleagues Will Love You (for your commit messages)

It's very annoying to read through bad commit messages. It's even worse when these commit messages are littered with errors. This is why I use Aspell to spellcheck my commit messages.

If a message contains an error, I can use ``git commit --amend`` to change it. I also find that, because this forces me to stop and think about my commit message, I'm encouraged, when amending, to rephrase certain aspects to make the commit clearer.

This requires [Aspell](http://aspell.net/) to be installed on your system.

<pre><code class="language-bash">
ASPELL=$(which aspell)
if [ $? -ne 0 ]; then
    echo "Aspell not installed - unable to check spelling" >&2
    exit
else
    WORDS=$($ASPELL list < "$1")
fi
if [ -n "$WORDS" ]; then
    echo -e "\e[1;33m\tPossible spelling errors found in commit message. Use git commit --amend to change the message.\n\tPossible mispelled words: " $WORDS "\e[0m" >&2
fi
</code></pre>

Commit-msg cannot prevent a commit, but can warn the user that's something's wrong. Which is what I do here.

### Gotta Catch'em All !

What about you ? Any Git hooks you use ?
