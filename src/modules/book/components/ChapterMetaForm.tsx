import React, { useState } from 'react';
import { Chapter } from '../services/bookRepository';

interface ChapterMetaFormProps {
  chapter: Chapter;
  onSave: (chapter: Chapter) => void;
}

const ChapterMetaForm: React.FC<ChapterMetaFormProps> = ({ chapter, onSave }) => {
  const [draft, setDraft] = useState<Chapter>(chapter);

  const update = <K extends keyof Chapter>(field: K, value: Chapter[K]) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Chapter Metadata</h3>
      <label>
        Title
        <input value={draft.title} onChange={e => update('title', e.target.value)} />
      </label>
      <label>
        Synopsis
        <textarea value={draft.synopsis} onChange={e => update('synopsis', e.target.value)} />
      </label>
      <label>
        Status
        <input value={draft.status} onChange={e => update('status', e.target.value)} />
      </label>
      <label>
        Tags
        <input
          value={draft.tags.join(', ')}
          onChange={e =>
            update(
              'tags',
              e.target.value
                .split(',')
                .map(t => t.trim())
                .filter(Boolean)
            )
          }
        />
      </label>
      <label>
        Word Goal
        <input
          type="number"
          value={draft.wordGoal}
          onChange={e => update('wordGoal', parseInt(e.target.value, 10) || 0)}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default ChapterMetaForm;