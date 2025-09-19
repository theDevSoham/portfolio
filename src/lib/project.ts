import { iconMap } from "./iconMap";

export interface ProjectImage {
  id: string;
  url: string;
  alt?: string;
  projectId: string;
}

export interface Project {
  id: string;
  title: string;
  icon: keyof Omit<typeof iconMap, "User">;
  slug: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  images: ProjectImage[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
