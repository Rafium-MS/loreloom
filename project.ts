import { Document, Packer, Paragraph, HeadingLevel } from 'docx';

export interface Character {
  id: number;
  name: string;
  description: string;
  role: string;
}

export interface Location {
  id: number;
  name: string;
  description: string;
  type: string;
}

export interface Scene {
  id: number;
  title: string;
  text: string;
}

export interface Chapter {
  id: number;
  title: string;
  scenes: Scene[];
}

export interface Project {
  id: number;
  title: string;
  chapters: Chapter[];
  characters: Character[];
  locations: Location[];
}

export function createProject(title: string): Project {
  return { id: Date.now(), title, chapters: [], characters: [], locations: [] };
}

export function exportToMarkdown(project: Project): string {
  let md = `# ${project.title}\n`;
  project.chapters.forEach((ch, i) => {
    md += `\n## Capítulo ${i + 1}: ${ch.title}\n`;
    ch.scenes.forEach(sc => {
      md += `\n### ${sc.title}\n${sc.text}\n`;
    });
  });
  return md;
}

export async function exportToDocx(_project: Project): Promise<Blob | null> {
  try {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ text: _project.title, heading: HeadingLevel.TITLE }),
            ..._project.chapters.flatMap((ch, i) => [
              new Paragraph({
                text: `Capítulo ${i + 1}: ${ch.title}`,
                heading: HeadingLevel.HEADING_1,
              }),
              ...ch.scenes.flatMap((sc) => [
                new Paragraph({ text: sc.title, heading: HeadingLevel.HEADING_2 }),
                new Paragraph(sc.text),
              ]),
            ]),
          ],
        },
      ],
    });
    return await Packer.toBlob(doc);
  } catch {
    return null;
  }
}

export function importFromMarkdown(_markdown: string): Project | null {
  const lines = _markdown.split(/\r?\n/);
  if (!lines[0]?.startsWith('#')) return null;
  const project: Project = {
    id: Date.now(),
    title: lines[0].replace(/^#\s*/, '').trim(),
    chapters: [],
    characters: [],
    locations: [],
  };

  let currentChapter: Chapter | null = null;
  let currentScene: Scene | null = null;
  let chapterId = 1;
  let sceneId = 1;
  let buffer: string[] = [];

  const flushScene = () => {
    if (currentChapter && currentScene) {
      currentScene.text = buffer.join('\n').trim();
      currentChapter.scenes.push(currentScene);
    }
    buffer = [];
    currentScene = null;
  };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      flushScene();
      const match = line.match(/^##\s+(?:Capítulo\s+\d+:\s+)?(.+)$/);
      const title = match ? match[1].trim() : line.substring(2).trim();
      currentChapter = { id: chapterId++, title, scenes: [] };
      project.chapters.push(currentChapter);
    } else if (line.startsWith('### ')) {
      flushScene();
      if (!currentChapter) continue;
      const title = line.substring(4).trim();
      currentScene = { id: sceneId++, title, text: '' };
    } else if (currentScene) {
      buffer.push(line);
    }
  }

  flushScene();
  return project;
}
