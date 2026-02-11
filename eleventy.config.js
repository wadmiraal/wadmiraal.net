import markdownIt from "markdown-it";

export default function(eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/posts-media");
  eleventyConfig.addPassthroughCopy("src/resume");
  eleventyConfig.addPassthroughCopy("src/opensearch.xml");
  eleventyConfig.addPassthroughCopy("src/.htaccess");

  // Exclude resume directory from template processing (standalone HTML, passthrough only)
  eleventyConfig.ignores.add("src/resume/**");

  // Treat .markdown files as Markdown (Eleventy only recognizes .md by default)
  eleventyConfig.addExtension("markdown", { key: "md" });

  // Markdown configuration: html: true to match Jekyll's kramdown
  const md = markdownIt({ html: true });
  eleventyConfig.setLibrary("md", md);

  // Custom collection for posts (sorted oldest-first, matching Jekyll internal order)
  eleventyConfig.addCollection("posts", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/posts/*.markdown").sort((a, b) => a.date - b.date);

    // Add previous/next navigation (Jekyll provides page.previous / page.next)
    posts.forEach((post, index) => {
      post.data.previousPost = index > 0
        ? { url: posts[index - 1].url, title: posts[index - 1].data.title }
        : null;
      post.data.nextPost = index < posts.length - 1
        ? { url: posts[index + 1].url, title: posts[index + 1].data.title }
        : null;
    });

    return posts;
  });

  // Filter: extract all unique tags from a collection (excluding internal tags)
  eleventyConfig.addFilter("getAllTags", function(collection) {
    let tags = new Set();
    for (let item of collection) {
      if (item.data.tags) {
        for (let tag of item.data.tags) {
          tags.add(tag);
        }
      }
    }
    return [...tags];
  });

  // Filter: XML-escape a string (for RSS feed)
  eleventyConfig.addFilter("xml_escape", function(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  });

  // Filter: format date as ISO UTC string (replaces Jekyll's date_to_utc + date format)
  eleventyConfig.addFilter("toISOString", function(date) {
    return new Date(date).toISOString().replace(".000Z", "Z");
  });

  // Filter: format date as YYYY-MM-DD in UTC
  eleventyConfig.addFilter("toUTCDate", function(date) {
    return new Date(date).toISOString().split("T")[0];
  });

  // Filter: format date for RSS pubDate
  eleventyConfig.addFilter("toRSSDate", function(date) {
    return new Date(date).toUTCString();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    templateFormats: ["html", "liquid", "markdown"],
  };
};
