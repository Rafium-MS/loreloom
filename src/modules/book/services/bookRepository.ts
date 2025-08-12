import { v4 as uuidv4 } from 'uuid';

export interface Scene {
  id: string;
  title: string;
  synopsis: string;
  status: string;
  tags: string[];
  wordGoal: number;
  content: string;
}

export interface Chapter {
  id: string;
  title: string;
  synopsis: string;
  status: string;
  tags: string[];
  wordGoal: number;
  content: string;
  scenes: Scene[];
}

export interface Book {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Project {
  id: string;
  books: Book[];
}

const STORAGE_KEY = 'loreloom_book_project';

function loadProject(): Project {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (raw) {
    return JSON.parse(raw) as Project;
  }
  const project: Project = { id: uuidv4(), books: [] };
  saveProject(project);
  return project;
}

function saveProject(project: Project) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }
}

function modifyProject(modifier: (project: Project) => void): Project {
  const project = loadProject();
  modifier(project);
  saveProject(project);
  return project;
}

export const bookRepository = {
  getProject: (): Project => loadProject(),
  saveProject,
  addBook: (title: string): Book => {
    let newBook: Book = { id: uuidv4(), title, chapters: [] };
    modifyProject(project => {
      project.books.push(newBook);
    });
    return newBook;
  },
  updateBook: (book: Book): void => {
    modifyProject(project => {
      const idx = project.books.findIndex(b => b.id === book.id);
      if (idx !== -1) {
        project.books[idx] = book;
      }
    });
  },
  removeBook: (bookId: string): void => {
    modifyProject(project => {
      project.books = project.books.filter(b => b.id !== bookId);
    });
  },
  addChapter: (bookId: string, data: Partial<Chapter>): Chapter => {
    let newChapter: Chapter = {
      id: uuidv4(),
      title: data.title || 'New Chapter',
      synopsis: data.synopsis || '',
      status: data.status || '',
      tags: data.tags || [],
      wordGoal: data.wordGoal || 0,
      content: data.content || '',
      scenes: [],
    };
    modifyProject(project => {
      const book = project.books.find(b => b.id === bookId);
      if (book) {
        book.chapters.push(newChapter);
      }
    });
    return newChapter;
  },
  updateChapter: (bookId: string, chapter: Chapter): void => {
    modifyProject(project => {
      const book = project.books.find(b => b.id === bookId);
      if (!book) return;
      const idx = book.chapters.findIndex(c => c.id === chapter.id);
      if (idx !== -1) {
        book.chapters[idx] = chapter;
      }
    });
  },
  removeChapter: (bookId: string, chapterId: string): void => {
    modifyProject(project => {
      const book = project.books.find(b => b.id === bookId);
      if (!book) return;
      book.chapters = book.chapters.filter(c => c.id !== chapterId);
    });
  },
  addScene: (bookId: string, chapterId: string, data: Partial<Scene>): Scene => {
    let newScene: Scene = {
      id: uuidv4(),
      title: data.title || 'New Scene',
      synopsis: data.synopsis || '',
      status: data.status || '',
      tags: data.tags || [],
      wordGoal: data.wordGoal || 0,
      content: data.content || '',
    };
    modifyProject(project => {
      const book = project.books.find(b => b.id === bookId);
      const chapter = book?.chapters.find(c => c.id === chapterId);
      if (chapter) {
        chapter.scenes.push(newScene);
      }
    });
    return newScene;
  },
  updateScene: (bookId: string, chapterId: string, scene: Scene): void => {
    modifyProject(project => {
      const book = project.books.find(b => b.id === bookId);
      const chapter = book?.chapters.find(c => c.id === chapterId);
      if (!chapter) return;
      const idx = chapter.scenes.findIndex(s => s.id === scene.id);
      if (idx !== -1) {
        chapter.scenes[idx] = scene;
      }
    });
  },
  removeScene: (bookId: string, chapterId: string, sceneId: string): void => {
    modifyProject(project => {
      const book = project.books.find(b => b.id === bookId);
      const chapter = book?.chapters.find(c => c.id === chapterId);
      if (!chapter) return;
      chapter.scenes = chapter.scenes.filter(s => s.id !== sceneId);
    });
  },
};

export default bookRepository;