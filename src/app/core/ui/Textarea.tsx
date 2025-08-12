import React from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea: React.FC<TextareaProps> = props => <textarea {...props} />;

export default Textarea;