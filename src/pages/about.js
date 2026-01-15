import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { useLocation } from '@gatsbyjs/reach-router';
import Layout from 'components/layout';
import Box from 'components/box';
import { HeadContent } from 'components/head';

const About = ({ data }) => (
  <Layout>
    <Box>
      <div
        dangerouslySetInnerHTML={{
          __html: data.aboutJson.content.childMarkdownRemark.html,
        }}
      />
    </Box>
  </Layout>
);

About.propTypes = {
  data: PropTypes.object.isRequired,
};

export const Head = ({ data }) => {
  const location = useLocation();
  return <HeadContent {...data.site.siteMetadata} pageTitle={data.aboutJson.title} location={location} />;
};

export default About;

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        siteTitle
        siteTitleShort
        siteDescription
        siteUrl
        themeColor
        social {
          twitter
        }
      }
    }
    aboutJson {
      title
      content {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`;
