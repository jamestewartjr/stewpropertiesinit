import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Title, Copy } from './item.css';

const Item = ({ title, copy, image }) => (
  <figure>
    {image?.childImageSharp?.gatsbyImageData && (
      <GatsbyImage
        image={image.childImageSharp.gatsbyImageData}
        alt={title || ''}
      />
    )}
    <figcaption>
      <Title>{title}</Title>
      <Copy>{copy}</Copy>
    </figcaption>
  </figure>
);

Item.propTypes = {
  title: PropTypes.string,
  copy: PropTypes.string,
  image: PropTypes.object.isRequired,
};

export default Item;
