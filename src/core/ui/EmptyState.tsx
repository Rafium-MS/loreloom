import React from 'react';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, actionLabel, onAction }) => (
  <div className="text-center py-10">
    <div className="text-4xl mb-4">📭</div>
    <p className="text-gray-600 mb-4">{message}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="bg-blue-600 text-white px-4 py-2 rounded">
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
