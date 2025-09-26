export interface User {
  id: string;
  email: string;
  name: string;
  isMember: boolean;
  membershipType?: 'monthly' | 'yearly';
  profileCompleted: boolean;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  // Basic Info
  name: string;
  pronouns?: string;
  ageRange: string;
  location: string;
  willingToRelocate: boolean;
  
  // Physical Profile
  height?: string;
  build?: string;
  eyeColor?: string;
  hairColor?: string;
  ethnicity?: string;
  
  // Training & Experience
  actingSchools: string[];
  workshops: string[];
  coaches: string[];
  stageExperience: boolean;
  filmExperience: boolean;
  specialSkills: string[];
  unionStatus?: string;
  
  // Interests & Aspirations
  preferredGenres: string[];
  careerGoals: string;
  
  // Media
  headshots: string[];
  resume?: string;
  demoReel?: string;
  socialLinks: string[];
  
  // Generated
  bio: string;
  tagline: string;
  profileUrl: string;
  isPublic: boolean;
  completionPercentage: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  user_id: string;
  author_name: string;
  author_headshot?: string;
  type: 'monologue' | 'reel' | 'headshot' | 'resume' | 'text';
  content: string;
  media_url?: string;
  likes_count: number;
  is_liked: boolean;
  comments: Comment[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  author_name: string;
  author_headshot?: string;
  content: string;
  created_at: string;
}

export interface VideoContent {
  id: string;
  title: string;
  source: string;
  duration: string;
  level: 'foundations' | 'intermediate' | 'advanced';
  category: string;
  summary: string;
  thumbnailUrl: string;
  videoUrl: string;
  completed?: boolean;
}

export interface Article {
  id: string;
  title: string;
  source: string;
  summary: string;
  fullUrl: string;
  category: string;
  publishedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  aiInsights?: string;
}