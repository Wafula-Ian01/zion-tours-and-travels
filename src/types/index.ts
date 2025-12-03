export interface TravelPackage {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  category: string;
  details: string;
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string; // ISO date string from backend
  author: string;
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  type: 'accommodation' | 'certification';
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
}

export interface Creditation {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
}
