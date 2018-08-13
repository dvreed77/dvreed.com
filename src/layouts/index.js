import React from "react"
import {Link} from "gatsby"
import styled from 'styled-components'
import '../css/my-prism-theme.css'
import '../css/reset.css'


const Container = styled.div`
  margin: 0 auto;
  width: 70%;
  padding: 30px;
  padding-top: 30px;

  @media (max-width: 700px) {
    width: 95%;
  }
`

const Title = styled.h1`
  margin-bottom: 20px;
`

const ListLink = props =>
  <li style={{ display: `inline-block`, marginRight: `1rem` }}>
    <Link to={props.to}>
      {props.children}
    </Link>
  </li>

export default ({ children, data }) =>
  <Container>
    <header style={{ marginBottom: `1.5rem` }}>
      <Link to="/" style={{ textShadow: `none`, backgroundImage: `none` }}>
        <h3 style={{ display: `inline` }}>Dave Reed</h3>
      </Link>
      <ul style={{ listStyle: `none`, float: `right` }}>
        <ListLink to="/">Home</ListLink>
        <ListLink to="/about/">About</ListLink>
        <ListLink to="/paintings/">Paintings</ListLink>
      </ul>
    </header>
    {children}
  </Container>