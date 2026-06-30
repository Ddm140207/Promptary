export interface Author {
  name: string;
  role: string;
  github?: string;
  linkedin?: string;
}

export interface Prompt {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  tags: string[];
  author: Author;
  usageCount: number;
  isTrending?: boolean;
  isCustom?: boolean;
  forkedFrom?: string; // ID of prompt it was forked from, if applicable
  forkedFromAuthor?: string; // Name of original author, if applicable
}
