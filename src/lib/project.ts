export interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
