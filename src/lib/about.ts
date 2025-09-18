export interface About {
  id: string;
  name: string;
  headline: string;
  bio: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  achievements: Achievement[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startYear: number;
  endYear: number;
  grade?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  desc: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Achievement {
  id: string;
  text: string;
}
