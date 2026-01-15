import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { timeout } from 'constants/transition';

const Transition = ({ children, location }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          delay: timeout / 1000,
          delayChildren: timeout / 1000,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

Transition.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Transition;
