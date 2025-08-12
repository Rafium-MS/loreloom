import React, { useState } from 'react';
import BookTree from '../components/BookTree';
import ChapterMetaForm from '../components/ChapterMetaForm';
import SceneMetaForm from '../components/SceneMetaForm';
import {
  bookRepository,
  Project,
  Book,
  Chapter,
  Scene,
} from '../services/bookRepository';

const BookManagerPage: React.FC = () => {
  const [project, setProject] = useState<Project>(bookRepository.getProject());
  const [selection, setSelection] = useState<{ book: Book; chapter?: Chapter; scene?: Scene } | null>(null);
  const [editorText, setEditorText] = useState('');

  const refresh = () => setProject(bookRepository.getProject());

  const handleSelectChapter = (chapter: Chapter, book: Book) => {
    setSelection({ book, chapter });
    setEditorText(chapter.content || '');
  };

  const handleSelectScene = (scene: Scene, chapter: Chapter, book: Book) => {
    setSelection({ book, chapter, scene });
    setEditorText(scene.content || '');
  };

  const handleChapterSave = (chapter: Chapter) => {
    if (!selection) return;
    bookRepository.updateChapter(selection.book.id, chapter);
    refresh();
  };

  const handleSceneSave = (scene: Scene) => {
    if (!selection?.chapter) return;
    bookRepository.updateScene(selection.book.id, selection.chapter.id, scene);
    refresh();
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditorText(value);
    if (selection?.scene) {
      bookRepository.updateScene(selection.book.id, selection.chapter!.id, {
        ...selection.scene,
        content: value,
      });
      refresh();
    } else if (selection?.chapter) {
      bookRepository.updateChapter(selection.book.id, {
        ...selection.chapter,
        content: value,
      });
      refresh();
    }
  };

  const handleMoveChapter = (
    source: { bookId: string; chapterId: string },
    target: { bookId: string; chapterId: string }
  ) => {
    const proj = bookRepository.getProject();
    const srcBook = proj.books.find(b => b.id === source.bookId);
    const tgtBook = proj.books.find(b => b.id === target.bookId);
    if (!srcBook || !tgtBook) return;
    const srcIndex = srcBook.chapters.findIndex(c => c.id === source.chapterId);
    const [moved] = srcBook.chapters.splice(srcIndex, 1);
    const tgtIndex = tgtBook.chapters.findIndex(c => c.id === target.chapterId);
    tgtBook.chapters.splice(tgtIndex, 0, moved);
    bookRepository.saveProject(proj);
    refresh();
  };

  const handleMoveScene = (
    source: { bookId: string; chapterId: string; sceneId: string },
    target: { bookId: string; chapterId: string; sceneId: string }
  ) => {
    const proj = bookRepository.getProject();
    const srcBook = proj.books.find(b => b.id === source.bookId);
    const tgtBook = proj.books.find(b => b.id === target.bookId);
    const srcChapter = srcBook?.chapters.find(c => c.id === source.chapterId);
    const tgtChapter = tgtBook?.chapters.find(c => c.id === target.chapterId);
    if (!srcChapter || !tgtChapter) return;
    const srcIndex = srcChapter.scenes.findIndex(s => s.id === source.sceneId);
    const [moved] = srcChapter.scenes.splice(srcIndex, 1);
    const tgtIndex = tgtChapter.scenes.findIndex(s => s.id === target.sceneId);
    tgtChapter.scenes.splice(tgtIndex, 0, moved);
    bookRepository.saveProject(proj);
    refresh();
  };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <BookTree
        project={project}
        onSelectChapter={handleSelectChapter}
        onSelectScene={handleSelectScene}
        onMoveChapter={handleMoveChapter}
        onMoveScene={handleMoveScene}
      />
      <div style={{ flex: 1 }}>
        {selection?.scene ? (
          <>
            <SceneMetaForm scene={selection.scene} onSave={handleSceneSave} />
            <textarea
              value={editorText}
              onChange={handleEditorChange}
              style={{ width: '100%', height: '300px' }}
            />
          </>
        ) : selection?.chapter ? (
          <>
            <ChapterMetaForm chapter={selection.chapter} onSave={handleChapterSave} />
            <textarea
              value={editorText}
              onChange={handleEditorChange}
              style={{ width: '100%', height: '300px' }}
            />
          </>
        ) : (
          <p>Select a chapter or scene to edit.</p>
        )}
      </div>
    </div>
  );
};

export default BookManagerPage;