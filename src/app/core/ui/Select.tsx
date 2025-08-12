import React from 'react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select: React.FC<SelectProps> = props => <select {...props} />;

export default Select;