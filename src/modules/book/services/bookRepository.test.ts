import { describe, it, expect, beforeEach } from 'vitest';
import { bookRepository } from './bookRepository';

const createStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  } as Storage;
};

beforeEach(() => {
  // @ts-ignore - provide minimal localStorage implementation for Node env
  global.localStorage = createStorage();
});

describe('bookRepository', () => {
  it('adds and removes a book', () => {
    const book = bookRepository.addBook('My Book');
    expect(bookRepository.getProject().books).toHaveLength(1);
    bookRepository.removeBook(book.id);
    expect(bookRepository.getProject().books).toHaveLength(0);
  });

  it('handles chapters and scenes', () => {
    const book = bookRepository.addBook('Book');
    const chapter = bookRepository.addChapter(book.id, { title: 'Chap' });
    bookRepository.addScene(book.id, chapter.id, { title: 'Scene' });

    const project = bookRepository.getProject();
    const savedBook = project.books[0];
    expect(savedBook.chapters[0].title).toBe('Chap');
    expect(savedBook.chapters[0].scenes[0].title).toBe('Scene');
  });
});
