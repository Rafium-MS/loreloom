import React from 'react';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
}

const Modal: React.FC<ModalProps> = ({ open, children, ...rest }) => (
  open ? <div {...rest}>{children}</div> : null
);

export default Modal;