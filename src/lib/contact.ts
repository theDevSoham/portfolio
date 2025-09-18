export interface SocialLink {
  id: string; // MongoDB ObjectId as string
  platform: string; // e.g. "GitHub", "LinkedIn"
  url: string; // profile URL
  contactId: string; // relation to Contact
}

export interface Contact {
  id: string; // MongoDB ObjectId as string
  phone?: string; // optional
  email?: string; // optional
  location?: string; // optional
  resumeUrl?: string; // optional
  mediaUrl?: string; // optional (image/gif/video)
  socials: SocialLink[]; // one-to-many relation
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
