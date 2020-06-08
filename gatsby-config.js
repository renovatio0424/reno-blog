module.exports = {
  siteMetadata: {
    title: `Reno's Blog`,
    name: `Reno`,
    siteUrl: `https://reno-blog.netlify.app/`,
    description: `This is Reno's blog. I'm Android Developer. I love LOL, Cooking, Riding a electric kickboard. I want to make an app that makes the world fun!!`,
    hero: {
      heading: `Welcome to Reno Blog !!`,
      maxWidth: 652,
    },
    social: [
      {
        name: `github`,
        url: `https://github.com/renovatio0424`,
      },
      {
        name: `linkedin`,
        url: `https://www.linkedin.com/in/정원-김-33b30415a`,
      }
    ],
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: true,
        sources: {
          local: true,
          // contentful: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Reno Blog`,
        short_name: `Reno`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/reno-favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
      },
    },
  ],
};
