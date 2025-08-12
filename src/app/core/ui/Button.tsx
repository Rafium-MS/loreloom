import React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = props => <button {...props} />;

export default Button;