import React from 'react';

export type ToolbarProps = React.HTMLAttributes<HTMLDivElement>;

const Toolbar: React.FC<ToolbarProps> = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

export default Toolbar;