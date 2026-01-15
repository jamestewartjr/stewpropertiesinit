import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'components/layout';
import Box from 'components/box';
import Title from 'components/title';
import Gallery from 'components/gallery';
import Modal from 'containers/modal';
import { graphql, useStaticQuery } from 'gatsby';
import { useLocation } from '@gatsbyjs/reach-router';
import { HeadContent } from 'components/head';

const Index = ({ data }) => (
  <Layout>
    <Box>
      <Title as="h2" size="large">
        {data.homeJson.content.childMarkdownRemark.rawMarkdownBody}
      </Title>
      {/* <Modal>
        <video
          src="https://i.imgur.com/gzFqNSW.mp4"
          playsInline
          loop
          autoPlay
          muted
        />
      </Modal> */}
    </Box>
    <Gallery items={data.homeJson.gallery} />
  </Layout>
);

Index.propTypes = {
  data: PropTypes.object.isRequired,
};

export const Head = ({ data }) => {
  const location = useLocation();
  return <HeadContent {...data.site.siteMetadata} location={location} />;
};

export default Index;

export const query = graphql`
  query HomepageQuery {
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
    homeJson {
      title
      content {
        childMarkdownRemark {
          html
          rawMarkdownBody
        }
      }
      gallery {
        title
        copy
        image {
          childImageSharp {
            gatsbyImageData(
              height: 500
              quality: 90
              layout: CONSTRAINED
            )
          }
        }
      }
    }
  }
`;
