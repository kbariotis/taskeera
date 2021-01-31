module.exports = {
  pathPrefix: "/docs",
  siteMetadata: {
    title: `Taskeera`,
    description: `Bring visibility of your background tasks.`,
    author: `@taskeerahq`,
  },
  plugins: [
    {
      resolve: "smooth-doc",
      options: {
        name: "Smooth DOC Starter",
        description: "Use your own description...",
        siteUrl: "https://docs.taskeera.com",
        sections: ["Guides", "Concepts", "API"],
        twitterAccount: "taskeerahq",
        navItems: [{ title: "Home", url: "https://taskeera.com" }],
      },
    },
  ],
}
