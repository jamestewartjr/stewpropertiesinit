import React from 'react';
import PropTypes from 'prop-types';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button, Close } from './modal.css';

// This component is here only to to showcase the
// React Context integration. No need to keep this if
// you don't require a Modal in your project.
const Modal = ({ children, open, showModal, hideModal }) => {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => {
      if (!isOpen && hideModal) {
        hideModal();
      } else if (isOpen && showModal) {
        showModal();
      }
    }}>
      <Dialog.Trigger asChild>
        <Button>Show Modal</Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1001,
          }}
        >
          <Dialog.Close asChild>
            <Close>
              <VisuallyHidden>Close</VisuallyHidden>
              <span aria-hidden>×</span>
            </Close>
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
};

export default Modal;
