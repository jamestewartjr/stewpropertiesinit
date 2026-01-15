import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { motion } from 'framer-motion';
import { Container } from './header.css';
import Title from 'components/title';
import Nav from 'components/header/nav';

// Example of a component-specific page transition
const AnimatedContainer = motion.div;

const Header = ({ title }) => (
  <AnimatedContainer
    initial={{ y: '-100%' }}
    animate={{ y: 0 }}
    exit={{ y: '-100%' }}
    transition={{
      ease: 'easeInOut',
    }}
  >
    <Container>
      <Link to="/">
        <Title as="h1">{title}</Title>
      </Link>

      <Nav />
    </Container>
  </AnimatedContainer>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
