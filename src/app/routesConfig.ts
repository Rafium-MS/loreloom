import { LucideIcon, FileText, Book, Users, Globe, Zap, Cpu, Clock, Share2 } from 'lucide-react';

export interface AppRoute {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const appRoutes: AppRoute[] = [
  { path: '/editor', label: 'Editor', icon: FileText },
  { path: '/book', label: 'Book', icon: Book },
  { path: '/characters', label: 'Characters', icon: Users },
  { path: '/world', label: 'World', icon: Globe },
  { path: '/plot', label: 'Plot', icon: FileText },
  { path: '/magic', label: 'Magic', icon: Zap },
  { path: '/tech', label: 'Tech', icon: Cpu },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/relationships', label: 'Relationships', icon: Share2 },
];
