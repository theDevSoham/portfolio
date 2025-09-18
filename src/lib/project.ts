import { iconMap } from "./iconMap";

export interface Project {
  id: string;
  title: string;
  description: string;
  icon: keyof Omit<typeof iconMap, "User">;
  slug: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
