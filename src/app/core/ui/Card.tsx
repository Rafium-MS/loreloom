import React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card: React.FC<CardProps> = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

export default Card;