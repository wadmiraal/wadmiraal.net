---
title: "Measuring What Matters: How to Use GetDx, LinearB, and Co as a Leadership Tool, Not Surveillance"
description: "Tools that attempt to measure developer productivity are often met with scepticism, if not hostility. And for valid reasons. How to use them as a leader to help your team grow."
layout: post
favorite: false
tags:
  - Engineering Management
  - Wisdom
---

About a year ago, Sonar decided to introduce [DX](https://getdx.com/). I'll admit I was sceptical and hesitant to use it for my team. Because, how can you possible hope to measure an activity like software engineering objectively? Every team's context is different, which means certain metrics might look "bad" for one team while actually being acceptable, or look "ok" for another while being totally unacceptable. Furthermore, software engineering is both a creative activity and a team effort, which makes measuring _individual_ productivity incredibly difficult and error-prone. I had +15 years of experience at that time, and +5 years as a leader; I had learned to trust my instincts and value things like extreme ownership, honesty and transparency, continuous improvement, etc, as sure indicators of my teams performing well. I couldn't see how you could _measure_ such things objectively (and, spoiler alert, you can't; at least, not _directly_).

I also remembered the [highly controversial McKinsey article](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/yes-you-can-measure-software-developer-productivity) which claimed to have cracked the code on measuring software developer productivity. I didn't buy it and know many others didn't either. I already saw my own engineers push back and challenge &emdash; for good reasons &emdash; what I thought would be the go-to metrics, like amounts of PRs closed per engineer, or lines of code written (to be fair, this is not what McKinsey was suggesting).

So yeah... I was sceptical. The only reason I did give it an honest shot was that I had read [Accelerate](https://www.goodreads.com/book/show/35747076-accelerate) a few months before, which explains how the DORA metrics work. This was extremely insightful and showed that, maybe, if used correctly and intelligently, we may gain something from using DX.

1 year later and I've come to _love_ using DX. Even my engineers see the value, and I have become one of its strongest proponents in the company. And I want to share my experience here because if you're not using them (correctly), you're missing out.


# How to use these tools

I'll share my experience using DX, but obviously there are others out there, like LinearB, Jellyfish, etc. I don't know which tool is best, or even if there is an objectively better tool. As long as you get more insights into your team's activity you will likely be able to benefit from it.


## The number 1 rule: THE METRIC IS NOT THE OBJECTIVE

Let me say that again: **the metric is not the objective!** Seriously, it's so tempting to look at metrics and have the urge to see them improve. This leads to objectives like "Reduce PR cycle time" or "Increase PR throughput"; they are utterly useless and may even negatively affect your team's morale. Our engineers are smart and they will quickly game the system if they feel this will shut up leadership; but it doesn't mean they will like doing this.

Instead, always remind yourself and the team that metrics should be seen as "proxies", or _signals_.


## Using them as signals, not objective truths

These tools are extremely powerful when used as _signals_, not as objective truths. Take PR cycle time for example. It's is very interesting to look at the team's PR cycle times and then discuss with them how they _feel_ about their PR review times. If the data shows it's quite slow but they're happy with it, what does that mean? Is it because they're very quality-focused and are OK to take more time to ship better code? Or, do they feel it's too slow even if the data shows it's actually quite good? Many metrics won't tell you much until you look at the broader context and _correlate_ it with the engineers' experience. I.e., it's a signal, but it's up to you to dig deeper and understand what it actually means in your specific context. This digging deeper is where you will get the real value out of this data.

Furthermore, many metrics can &emdash; and should &emdash; be looked at over long periods of time to identify trends. If you have a graph showing PR throughput, for instance, you will likely see it swing wildly week over week (because people were sick, or on holiday, or at a conference, etc). But over the long term, what is the _trend_? Over a 3 month, or even 6 month period, is it stable? Or going up? Or down? And what does that tell you? Did you expect it?

There is no single right answer to such questions. But just like a good doctor will treat certain symptoms as signals that guide his diagnostic, you will need to step back and reflect on this with your team to understand what these metrics are telling you. They don't necessarily need to lead to immediate action; the understanding itself is already valuable.


## Looking at multiple metrics holistically

This is probably obvious, but let me state it anyway: the single biggest mistake you can make is look at only 1 metric. It's not only meaningless, it can actually be harmful. It's as if you were looking at the number of unique visitors to your website but are ignoring bounce rate. If you only focus on getting more visits but don't realize 95% are bouncing, you're wasting a lot of that effort.

Similarly, you should look at multiple metrics for your team. If your team's PR throughput is low and PR cycle time is high, that may look "bad"; but if at the same time your change fail rate is best in class, you're doing something right. Conversely, if your PR throughput and cycle times are in the top 5th percentile industry-wise, that may look "amazing"; but if at the same your change fail rate is 50%, you're doing something horribly wrong.

The easiest ones to start with, in my experience, are _team_ PR throughput, _team_ PR cycle time, and _team_ change fail rate (don't look at the data for individual engineers, it is unlikely to tell you anything useful). But be curious! Explore things like review load per engineer, backlog size, sprint burnup, ticket cycle time, and more. DX has a pretty decent AI that can help you explore available data and write queries; I use it extensively and find it super useful.


## Transparency and a shared journey

Be very open with your engineers; tell them you're looking at data and _show_ it to them. If you have a dashboard, give them access to it so they see what you see. Be open about the fact you're figuring this out and that you would like to figure this out with them, together.

What I did with my team was first share my dashboard and suggest we look at it together every retrospective. We would spend ~10mins going over the graphs and trying to understand what we were looking at. And I would always remind them (and myself) about the number 1 rule: **the metric is not the objective**. To illustrate, I've had the experience multiple times now were an engineer, when first exposed to the graphs, would say something like "Oh, but I like to open a PR very early in draft mode. That will impact the metrics, should I not do that?" And I always say the same thing: "**You do what makes sense to you.** The metrics don't matter, we don't change what we do just to make the numbers look better." I feel this has helped build trust: my engineers know we're not changing our ways of working only to make a graph look better, we're trying to see how the graphs correlate to our ways of working (which can, ultimately, lead to real improvements; more on that later).


## Using percentiles and avoid sterile debates

You might face a situation where your engineers start pointing out reasons the data is tainted and thus unreliable. For instance, on my team, we sometimes need to make changes on repos where we need to ask another team for a review, which is typically slow. There are also company-wide sensitive repos where we cannot merge on Fridays, so some PRs need to wait until Monday morning to be merged. These situations can can really mess up our PR cycle time data, especially if you look at the _averages_. But in our case these are exceptions, not the norm. Because of that they will impact our _average_ values but not _median_ values. This is why I have found that splitting data into p50, p75, and p90 buckets really helps:

![I split data into p50, p75, and p90 buckets and discard average data](/posts-media/measure-what-matter/fig01.jpg)
_Screenshot from our PR cycle time dashboard_

The reason I have ended up using these 3 buckets for multiple metrics is for several reasons:

* **p50 is what matters most**: it represents at least half of what your team experiences on a day-to-day basis, and is a solid baseline. If these numbers tend to show you have a problem, you will need to focus your efforts here first.
* **p90 shows you the worst-case scenarios you likely still have some control over**: there will always be cases that are outside your team's control. You need to acknowledge and embrace this, which is why we discard the top 10% worst data. Why bother looking at it, if you cannot influence it? But the 90th percentile shows where your team is likely "suffering" the most, and where you may still have some level of control.
* **p75 is the bridge between the 2**: when changing processes with the expectation it will positively correlate with your p90 data, you will likely see the impact on p75 first. This can create momentum and excitement, or, on the contrary, help you identify early whether an initiative is not paying off.

Another positive impact of using such buckets is it allows you to avoid sterile debates. Whenever an engineer starts arguing that such and such circumstances mess up our data, I remind them that these are A) exceptions, and B) likely to end up in our p90 bucket, or even in the top 10% we don't even have a graph for. _We should not care about those_, nor use them as excuses not to look at our data.

There will always be cases where the data is not 100% accurate, and this can lead to lack of trust. Find ways to circumvent this noise and recenter the conversation on what matters.


# The real payoff: a deeper understanding of your team

For me, the main aha! moment was when I was playing with data and discovered that my best performing engineer had become a bottleneck for our team.

This person had moved to a full stack position a few months prior, having been a frontend engineer before. Our team was now made up of 4 backend engineers, 1 frontend engineer, and 1 fullstack engineer. This meant our fullstack engineer had to review all PRs from our only frontend dev, but would also receive review requests from the backend engineers. I was playing with our data some day and wanted to see if there was a difference in throughput in backend Vs frontend PRs, as they use wildly different stacks. The difference was shocking: we were closing *way* more frontend PRs per week compared to backend PRs! The frontend and fullstack engineers were producing code extremely quickly. So I thought, what about PR cycle time? Again I was shocked, but for another reason: **the cycle times on the frontend PRs were way worse than the backend PRs!** How was that possible? It didn't make sense; how could the throughput be so "good" and yet the cycle time be so "bad"? So I started thinking and then it dawned on me: the fullstack engineer was perhaps overloaded with review requests. So I gathered the data it turned out he was doing almost **50% of all PR reviews in the entire team!** But he was so good people barely noticed; he would still deliver his own work on time and didn't complain about being overloaded with requests. Except that his fellow frontend engineer was waiting longer, on average, on his reviews compared to his teammates. But he didn't dare complain because he knew his colleague was super busy. So this went unnoticed for months until I played with the data.

This showed me that the data could be used as _signals_ to start better understanding the team's way of working.


## Looking for correlations and indirect impacts

Say you change your spec process and make it a lot more thorough to avoid surprises. You can expect to see a slight dip in your PR throughput, although it shouldn't impact your PR cycle time. But, you would expect your change fail rate to drop, or your sprint burnup chart to show better results, etc. This correlation with data is very powerful, because we can now use data to check what we're doing well or not. We don't need to rely on our gut feeling (only); we should actually see impact in the data. This moves the conversation from subjective "feelings" to objectively measurable results.





