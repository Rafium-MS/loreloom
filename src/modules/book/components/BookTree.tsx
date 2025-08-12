import React from 'react';
import { Project, Book, Chapter, Scene } from '../services/bookRepository';

interface BookTreeProps {
  project: Project;
  onSelectChapter?: (chapter: Chapter, book: Book) => void;
  onSelectScene?: (scene: Scene, chapter: Chapter, book: Book) => void;
  onMoveChapter?: (source: { bookId: string; chapterId: string }, target: { bookId: string; chapterId: string }) => void;
  onMoveScene?: (
    source: { bookId: string; chapterId: string; sceneId: string },
    target: { bookId: string; chapterId: string; sceneId: string }
  ) => void;
}

const BookTree: React.FC<BookTreeProps> = ({ project, onSelectChapter, onSelectScene, onMoveChapter, onMoveScene }) => {
  const handleDragStart = (e: React.DragEvent, payload: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
  };

  const handleChapterDrop = (e: React.DragEvent, bookId: string, chapterId: string) => {
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    if (data.type === 'chapter') {
      onMoveChapter?.({ bookId: data.bookId, chapterId: data.chapterId }, { bookId, chapterId });
    }
  };

  const handleSceneDrop = (
    e: React.DragEvent,
    bookId: string,
    chapterId: string,
    sceneId: string
  ) => {
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    if (data.type === 'scene') {
      onMoveScene?.(
        { bookId: data.bookId, chapterId: data.chapterId, sceneId: data.sceneId },
        { bookId, chapterId, sceneId }
      );
    }
  };

  return (
    <div>
      {project.books.map(book => (
        <div key={book.id}>
          <strong>{book.title}</strong>
          <ul>
            {book.chapters.map(chapter => (
              <li
                key={chapter.id}
                draggable
                onDragStart={e => handleDragStart(e, { type: 'chapter', bookId: book.id, chapterId: chapter.id })}
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleChapterDrop(e, book.id, chapter.id)}
              >
                <span onClick={() => onSelectChapter?.(chapter, book)}>{chapter.title}</span>
                {chapter.scenes.length > 0 && (
                  <ul>
                    {chapter.scenes.map(scene => (
                      <li
                        key={scene.id}
                        draggable
                        onDragStart={e =>
                          handleDragStart(e, {
                            type: 'scene',
                            bookId: book.id,
                            chapterId: chapter.id,
                            sceneId: scene.id,
                          })
                        }
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => handleSceneDrop(e, book.id, chapter.id, scene.id)}
                      >
                        <span onClick={() => onSelectScene?.(scene, chapter, book)}>{scene.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BookTree;