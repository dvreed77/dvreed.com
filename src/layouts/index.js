import React from "react"
import Link from "gatsby-link"
import styled from 'styled-components'
import 'css/my-prism-theme.css'
import 'css/reset.css'


const Container = styled.div`
  margin: 0 auto;
  width: 70%;
  padding: 30px;
  padding-top: 30px;
`

const Title = styled.h1`
  margin-bottom: 20px;
`

export default ({ children, data }) =>
  <Container>
    <Link to={`/`}>
      <Title>
        {data.site.siteMetadata.title}
      </Title>
    </Link>
    {children()}
  </Container>

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`