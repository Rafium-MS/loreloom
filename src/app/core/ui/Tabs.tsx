import React from 'react';

export type TabsProps = React.HTMLAttributes<HTMLDivElement>;

const Tabs: React.FC<TabsProps> = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

export default Tabs;