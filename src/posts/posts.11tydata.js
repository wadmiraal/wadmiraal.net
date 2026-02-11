export default {
  layout: "post",
  eleventyComputed: {
    permalink: (data) => {
      const match = data.page.inputPath.match(
        /(\d{4})-(\d{2})-(\d{2})-(.+)\.markdown$/
      );
      if (match) {
        return `/lore/${match[1]}/${match[2]}/${match[3]}/${match[4]}/`;
      }
    },
  },
};
