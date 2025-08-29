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
  // Placeholder: real implementation would use the docx package
  return null;
}

export function importFromMarkdown(_markdown: string): Project | null {
  // Placeholder for future parser
  return null;
}
