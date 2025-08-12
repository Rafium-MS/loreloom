import React from 'react';

interface FiltersBarProps {
  categories: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ categories, selected, onChange }) => {
  const toggle = (category: string) => {
    const exists = selected.includes(category);
    const next = exists ? selected.filter(c => c !== category) : [...selected, category];
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map(cat => (
        <label key={cat} className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(cat)}
            onChange={() => toggle(cat)}
          />
          {cat}
        </label>
      ))}
    </div>
  );
};

export default FiltersBar;