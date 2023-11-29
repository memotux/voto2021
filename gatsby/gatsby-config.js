module.exports = {
  siteMetadata: {
    title: `Voto 2021 | Asamblea Legislativa`,
    description: `Voto 2021, Asamblea Legislativa,  Resultados Preliminares y Finales. Se exponen inconsistencias con las publicaciones de Medios de Comunicación.`,
    author: `@memotux`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `voto2021`,
        short_name: `voto2021`,
        start_url: `/`,
        background_color: `#312E81`,
        theme_color: `#312E81`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`, // This path is relative to the root of the site.
      },
    },
    // `gatsby-plugin-gatsby-cloud`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
