---
title: "Use Docker to kickstart your Drupal development"
description: "When starting a new Drupal project, setting up a development environment can take up a lot of time. But now, thanks to tools like Docker, we can start developing in seconds."
layout: post
tags:
 - Drupal 7
---

If you're anything like me, you will know what I'm talking about when I say setting up local development environments for your Drupal projects sucks. Maybe, like me, you had a local \*AMP stack, with virtual hosts pointing to different directories or, worse, just subdirectories inside the `/var/www/` directory.

Well, now there's a *much* better way: [Docker](https://www.docker.com/). Docker is *freakishly awesome*! It's super fast and very easy to setup. Containers (&ldquo;virtual machines&rdquo;) are cheap to discard, rebuild, etc. Think of it as Git branches for virtual machines.

*Update 2015-05-22: I added some new functionality to my Docker image, as well as use it a little bit differently. Check at the bottom of this post for more information.*

*Update 2015-12-07: I added support for tags, so you can now pull the image for a specific Drupal version, like*

<pre><code class="language-bash">
docker pull wadmiraal/drupal:7.41
docker pull wadmiraal/drupal:7 # Gets the latest D7 version
docker pull wadmiraal/drupal:8.0.1
docker pull wadmiraal/drupal:8 # Gets the latest D8 version
</code></pre>

*Drupal 8 containers also ship with [Drupal Console](http://www.drupalconsole.com/).*

## What Is Docker

If you're not familiar with Docker, it's a way to run server software. To some, it's a replacement for the classic virtual machine approach. To others, it is merely an improvement to it (where I work, we use Docker in production, but on top of virtual machines, not as a replacement). It is important to realize Docker is a *very Linux-centric product*. You *can* run it on Windows or Mac OS, but you won't get the full benefit of its performance (I won't go into details about why in this post). It's also not as straightforward to setup. Finally, Docker *images* can only run Linux distributions (which is no problem, as you will probably use Linux servers in production anyway).

A Docker *image* is a like a snapshot of a particular Linux setup. It has pre-installed packages, usually configured and ready to use. A Docker *container* is an instance of this *image*. You can have many containers running the same image. What's really cool with Docker is these images are usually super-lightweight and lean. A base image will have a very bare-bones Linux install, not even shipping with a text editor! This allows us to install *only* what we want, giving is very fast and light systems. Furthermore, containers are incredibly fast to instantiate. Creating a new container takes literally **seconds**, giving us a whole new, pristine and running system in no time. And this last part is what makes it ideal for development.

## An Example: wadmiraal/drupal

If you go to the [Docker Hub](https://registry.hub.docker.com/), and search for &ldquo;drupal&rdquo;, you will find **many** Docker images, ready to be used. You can use any image you wish. I created my own to get a better understanding of how Docker works, and because I had a clear idea of what I wanted it to be.

You can find the source &ldquo;code&rdquo; [here](https://github.com/wadmiraal/docker-drupal), and the image [here](https://registry.hub.docker.com/u/wadmiraal/drupal/).

What I wanted was a simple LAMP stack, with a pre-installed up-to-date version of Drupal (D7, in this case), pre-installed with [Admin menu](https://www.drupal.org/project/admin_menu) and the admin account password set to &ldquo;admin&rdquo;. This would allow me to quickly start configuring the site, or run my unit tests in a clean setup. I wanted it to use MySQL (because I prefer it to Postgres) and Apache (as I'm more familiar with it then NginX). Because it is a development environment, I didn't want things like Memcache or Redis, which are more suited for production. Finally, I wanted it pre-installed with [Drush](http://www.drush.org/en/master/) and [Composer](https://getcomposer.org/), and compatible with [Drush aliases](http://www.astonishdesign.com/blog/drush-aliases-what-why-and-how) (meaning it comes with a SSH server).

### Preamble: attention non-Linux users

If you're on Mac OS or Windows, the following will require a little more work. This is because of the way Docker works (Docker only works on Linux... so, to bypass this problem on Mac OS and Windows, it runs Linux inside a &ldquo;classic&rdquo; virtual machine through Virtual Box, and starts Docker there&thinsp;&mdash;&thinsp;actually pretty clever).

I don't work with Mac OS, but [this article](http://viget.com/extend/how-to-use-docker-on-os-x-the-missing-guide) seems pretty good at covering most caveats I could think of (especially the port forwarding).

For Windows, I found [this article](http://blog.tutum.co/2014/11/05/how-to-use-docker-on-windows/) by Tutum. Tutum is pretty active with everything Docker related, so they probably know their stuff. However, please let me know if you find any better resources. 

### Start using it for your local development

So, first you need to [install Docker](https://docs.docker.com/installation/). After installing it, fire up a terminal and call the following:

<pre><code class="language-bash">
docker pull wadmiraal/drupal
</code></pre>

If you're on Linux, you might need *sudo*&thinsp;&mdash;&thinsp;at the office, we simply aliased `docker` to `sudo docker` (`alias docker="sudo docker"` in your `~/.bashrc` file).

This will take some time, but it only takes time *the first time you call it*. After that, the image will be saved on your hard drive and firing up new instances of it will take *seconds*.

After that, I recommend setting up a new directory like this:

    project/
        modules/
        themes/

Now, `cd` into this `project/` directory and call:

<pre><code class="language-bash">
docker run -d -p 8080:80 -p 8022:22 -v `pwd`/modules:/var/www/sites/all/modules/custom -v `pwd`/themes:/var/www/sites/all/themes wadmiraal/drupal
</code></pre>

*Note: Windows users, the `pwd` part won't work. Pass the absolute path instead.*

Let me go through each part and explain what they do.

<pre><code class="language-bash">
docker run -d
</code></pre>

This tells Docker to run the image in *detached* mode. It basically runs Docker in the background, giving you back control over your terminal. Otherwise, the process will continue inside your terminal until you interrupt it, stopping the container as well.

<pre><code class="language-php">
-p 8080:80 -p 8022:22
</code></pre>

This *forwards* the ports on the left of the `:` (on your machine) to the ports on the right (on the Docker container). You can choose anything you want on the left part. Changing these values allows you to have multiple containers running simultaneously without them creating interferences. We forward to port `80` for Apache and to port `22` for the SSH server (more on these later).

*Note: there's a third port you can forward to, `3306`, which is MySQL.*

<pre><code class="language-bash">
-v `pwd`/modules:/var/www/sites/all/modules/custom -v `pwd`/themes:/var/www/sites/all/themes
</code></pre>

*Note: `pwd` won't work on Windows machines; pass the complete, absolute path instead.*

This mounts our local `modules/` and `themes/` directories to `sites/all/modules/custom/` and `sites/all/themes/` on the Docker container, respectively. Notice I recommend mounting your modules to `sites/all/modules/custom/`, as `sites/all/modules/contrib/` already contains some modules, and mounting it would *overwrite* its content with your local directory.

<pre><code class="language-bash">
wadmiraal/drupal
</code></pre>

This final parts tells Docker which image you wish to run, in our case `wadmiraal/drupal`.

### The result

If you didn't change the port-forwarding options, you can now point your browser to `http://localhost:8080` and see your new Drupal site. You can log in with *admin:admin*.

*Note: remember that Windows and Mac OS requires an extra step for the port-forwarding. Read the above articles.*

You can SSH into the Docker container (Windows users, use [PuTTy](http://www.chiark.greenend.org.uk/~sgtatham/putty/)):

<pre><code class="language-bash">
ssh root@localhost -p 8022
</code></pre>

The password is &ldquo;root&rdquo;. You can then do whatever you wish inside the container. But the real benefit&thinsp;&mdash;&thinsp;and the reason I added a SSH server in the first place&thinsp;&mdash;&thinsp;is being able to use *Drush aliases* (more below).

### Stopping, re-starting and removing the container

Once it's running, you can call:

<pre><code class="language-bash">
docker ps
</code></pre>

to see it. Remember: you may need to call `docker` with `sudo` if you are on Linux. You will see something like this:

<pre><code class="language-bash">
CONTAINER ID        IMAGE                     COMMAND                CREATED             STATUS              PORTS                                                  NAMES
0036189f1688        wadmiraal/drupal:latest   "/bin/sh -c 'exec su   About an hour ago   Up About an hour    3306/tcp, 0.0.0.0:8022->22/tcp, 0.0.0.0:8080->80/tcp   loving_mcclintock
</code></pre>

If you want to **stop** the container, you can call:

<pre><code class="language-php">
docker stop [id or name]
# For example:
docker stop 0036189f1688
# Or
docker stop loving_mcclintock
</code></pre>

If you call:

<pre><code class="language-bash">
docker ps
</code></pre>

again, you won't see your container anymore. That is because `ps` only shows running containers by default. But it's still there. If you call:

<pre><code class="language-bash">
docker ps -a
</code></pre>

you will see it again.

To **start** it again, call:

<pre><code class="language-php">
docker start [id or name]
# For example:
docker start 0036189f1688
# Or
docker start loving_mcclintock
</code></pre>

Finally, if you wish to **remove** it completely, call:

<pre><code class="language-php">
docker rm [id or name]
# For example:
docker rm 0036189f1688
# Or
docker rm loving_mcclintock
</code></pre>

#### Giving a custom name

By default, Docker will generate a cool name for your container, like *loving_mcclintock*, *angry_wright*, *berserk_hoover* or even *gloomy_wozniak*. However, you can very well give a custom name to it. Simply add this to your `docker run ...` command, **before the image name**:

<pre><code class="language-bash">
docker run (...) --name mycontainer_name wadmiraal/drupal
</code></pre>

Names can only be alphanumerical and contain underscores.

### See how fast it is

Just so you get an idea of how **fast** Docker is, create a new instance using the `docker run ...` command above. Then remove it using `docker rm ...`, and finally call `docker run ...` again. You will see it takes *seconds* to create a whole new, pristine copy of your image and run it. This is why using Docker for local development is *awesome*!

### Integration with Drush

Now, here comes the really neat part. I designed this Docker image to be used with [Drush aliases](http://www.astonishdesign.com/blog/drush-aliases-what-why-and-how). It's very easy to implement.

First, make sure your container is running and you forwarded the `22` port. If you used my above `docker run ...` command, it should be forwarded to port `8022`. You need an SSH key for this to work ([read about creating SSH keys here](https://help.github.com/articles/generating-ssh-keys/)). Copy the contents of your local `~/.ssh/id_rsa.pub` file and SSH into the container (remember: password is &ldquo;root&rdquo;):

<pre><code class="language-bash">
ssh root@localhost -p 8022
</code></pre>

Add the content of your local `~/.ssh/id_rsa.pub` file to `/root/.ssh/authorized_keys`. Exit.

Now, verify you can SSH into the container *without typing the password*:

<pre><code class="language-bash">
ssh root@localhost -p 8022
</code></pre>

If so, we can go on to the next step.

Make sure [Drush is installed](http://www.drush.org/en/master/install/). Create a new file inside your local `~/.drush/` folder, call it something like `docker.aliases.drushrc.php`. Add the following lines to it:

<pre><code class="language-php">
&lt;?php
$aliases['wadmiraal_drupal'] = array(
  'root' => '/var/www',
  'remote-user' => 'root',
  'remote-host' => 'localhost',
  'ssh-options' => '-p 8022', // Or any other port you specified for the SSH server.
);

</code></pre>

Clear your Drush cache by calling:

<pre><code class="language-bash">
drush cc drush
</code></pre>

Now, you can execute *any* Drush command on the container locally by prefixing the command with `@docker.wadmiraal_drupal` (or `@[name_of_file].[name_of_alias]`). Let's download and enable Devel:

<pre><code class="language-bash">
drush @docker.wadmiraal_drupal dl devel
drush @docker.wadmiraal_drupal en devel
</code></pre>

How's that for cool? Your container now has Devel, and you didn't even log in to the container.

## Where do I go from here

Surely you get the idea of how powerful this is. It is much better than having a local \*AMP stack, because each environment is separated. You don't pollute your local system with otherwise unneeded software, and you can even work with different versions of Apache, PHP, etc.

There's a lot more you can do with Docker, like creating your custom images, or creating a new image based on the current state of a container (also very handy). I'll dive into all this in a future post.

If you are on Mac OS or Windows, I'd love some feedback on how this works for you. I know it takes some more work, especially the port forwarding part.

If you have any trouble, you can [submit issues here](https://github.com/wadmiraal/docker-drupal/issues), or [fork the repo](https://github.com/wadmiraal/docker-drupal) and submit a pull-request.

## 2015-05-22 update

So, I updated my `wadmiraal/drupal` image a little bit since my original post. First and foremost, I've taken the habit to *not* run my containers in daemonized mode. This means my Terminal is unusable for as long as the container is running. But, this has 2 nice advantages:

* I can stop my container by hitting *^C* (*Ctrl + C* or *&#8984; + C*). Much easier than `docker stop [id or name]`.
* It allows me to run the container with the `--rm` flag. This will *remove* the container as soon as it stops, cleaning up my system.

This last point is a big deal. If you start new containers a lot, you will probably notice your start having a *lot* of stale containers on your system. The `--rm` flag solves this problem nicely.

So, compared to what I wrote above, I now use a command that looks more like this:

<pre><code class="language-bash">
docker run -it --rm -p 8080:80 -p 8022:22 -v `pwd`/modules:/var/www/sites/all/modules/custom -v `pwd`/themes:/var/www/sites/all/themes wadmiraal/drupal
</code></pre>


### Running unit tests

Running unit tests takes a little tweaking if you don't forward to `80` or `8080`. This is because of the way Drupal's Simpletest runs its tests. If you forward your container's port `80` to something other than `80` or `8080` on localhost, you must add a little line to the container's Apache configuration. SSH into your running container (don't forget to forward your port `22`) and make Apache bind to your other port:

<pre><code class="language-bash">
# If you forwarded to another port than 8022, change accordingly.
# Remember, password is "root".
ssh root@localhost -p 8022
# Change the port number accordingly. This example is if you forward
# to port 8081.
echo "Listen 8081" >> /etc/apache2/ports.conf
/etc/init.d/apache2 restart
</code></pre>

Now you will be able to run your Simpletests without problem, even if you don't use ports `80` or `8080`.

### PHPMyAdmin

The new image comes with [PHPMyAdmin](http://www.phpmyadmin.net/home_page/index.php) installed by default. Just navigate to `http://localhost:[forwarded_ip]/phpmyadmin`. The root user is `root` and does not use any password.

### Blackfire

The latest version of the image comes with [Blackfire](https://blackfire.io) pre-installed. Blackfire is a new, free tool developed by [Sensiolabs](https://sensiolabs.com/) (the guys behind the [Symfony](http://symfony.com/) framework). To use it with your container, you must first register at the Blackfire website. You will get a *server ID* and a *server token*. You can pass these to the container when starting it. If the container detects these variables, it will start Blackfire. You will then be able to profile your application. How's that for cool?

To tell the container about your server ID and token, you must pass it as Docker *environment variables*. This is done using the `-e` option. The variables are called `BLACKFIREIO_SERVER_ID` and `BLACKFIREIO_SERVER_TOKEN`.

Example:

<pre><code class="language-bash">
docker run -it --rm -e BLACKFIREIO_SERVER_ID="[your id here]" -e BLACKFIREIO_SERVER_TOKEN="[your token here]" -p 8022:22 -p 8080:80 wadmiraal/drupal
</code></pre>
