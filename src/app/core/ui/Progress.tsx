import React from 'react';

export type ProgressProps = React.ProgressHTMLAttributes<HTMLProgressElement>;

const Progress: React.FC<ProgressProps> = props => <progress {...props} />;

export default Progress;