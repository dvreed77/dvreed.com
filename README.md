# gatsby-starter-hello-world
Starter with the bare essentials needed for a [Gatsby](https://www.gatsbyjs.org/) site

Install this starter (assuming Gatsby is installed) by running from your CLI:
```
gatsby new gatsby-site https://github.com/gatsbyjs/gatsby-starter-hello-world
```

## Running in development
`gatsby develop`

## Deploy
```
gatsby build --prefix-paths
rsync -avz public/* trlabs2:public_html
```