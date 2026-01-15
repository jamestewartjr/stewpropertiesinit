import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { useLocation } from '@gatsbyjs/reach-router';
import Box from 'components/box';
import Layout from 'components/layout';
import { HeadContent } from 'components/head';

const NotFound = () => (
  <Layout>
    <Box>Not found.</Box>
  </Layout>
);

export const Head = () => {
  const location = useLocation();
  const data = useStaticQuery(graphql`
    query {
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
    }
  `);

  return <HeadContent {...data.site.siteMetadata} pageTitle="404" location={location} />;
};

export default NotFound;
