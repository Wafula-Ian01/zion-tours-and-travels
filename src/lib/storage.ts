// src/lib/storage.ts
import { TravelPackage, BlogArticle, GalleryImage, FAQ, Partner, Category, Creditation } from '@/types';
import { getAuthToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to make authenticated requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const storage = {
  // Generic get/set (kept for backward compatibility, but now uses API)
  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      // Map old localStorage keys to API endpoints
      const endpoint = keyToEndpoint(key);
      if (endpoint) {
        return await apiRequest<T>(endpoint);
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      return defaultValue;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    // This would need specific implementation per entity
    console.warn('Generic set not implemented - use specific methods');
  },

  // Packages
  getPackages: async (category?: string): Promise<TravelPackage[]> => {
    try {
      const url = category ? `/packages?category=${category}` : '/packages';
      return await apiRequest<TravelPackage[]>(url);
    } catch (error) {
      console.error('Error fetching packages:', error);
      return [];
    }
  },

  getPackage: async (id: string): Promise<TravelPackage | null> => {
    try {
      return await apiRequest<TravelPackage>(`/packages/${id}`);
    } catch (error) {
      console.error('Error fetching package:', error);
      return null;
    }
  },

  createPackage: async (pkg: Omit<TravelPackage, 'id'>): Promise<TravelPackage> => {
    return await apiRequest<TravelPackage>('/packages', {
      method: 'POST',
      body: JSON.stringify(pkg),
    });
  },

  updatePackage: async (id: string, pkg: Partial<TravelPackage>): Promise<TravelPackage> => {
    return await apiRequest<TravelPackage>(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pkg),
    });
  },

  deletePackage: async (id: string): Promise<void> => {
    await apiRequest(`/packages/${id}`, { method: 'DELETE' });
  },

  setPackages: async (packages: TravelPackage[]): Promise<void> => {
    console.warn('setPackages deprecated - use createPackage/updatePackage');
  },

  // Articles
  getArticles: async (): Promise<BlogArticle[]> => {
    try {
      return await apiRequest<BlogArticle[]>('/articles');
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  },

  getArticle: async (id: string): Promise<BlogArticle | null> => {
    try {
      return await apiRequest<BlogArticle>(`/articles/${id}`);
    } catch (error) {
      console.error('Error fetching article:', error);
      return null;
    }
  },

  createArticle: async (article: Omit<BlogArticle, 'id'>): Promise<BlogArticle> => {
    return await apiRequest<BlogArticle>('/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  },

  updateArticle: async (id: string, article: Partial<BlogArticle>): Promise<BlogArticle> => {
    return await apiRequest<BlogArticle>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  },

  deleteArticle: async (id: string): Promise<void> => {
    await apiRequest(`/articles/${id}`, { method: 'DELETE' });
  },

  setArticles: async (articles: BlogArticle[]): Promise<void> => {
    console.warn('setArticles deprecated - use createArticle/updateArticle');
  },

  // Gallery
  getGallery: async (): Promise<GalleryImage[]> => {
    try {
      return await apiRequest<GalleryImage[]>('/gallery');
    } catch (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }
  },

  createGalleryImage: async (image: Omit<GalleryImage, 'id'>): Promise<GalleryImage> => {
    return await apiRequest<GalleryImage>('/gallery', {
      method: 'POST',
      body: JSON.stringify(image),
    });
  },

  updateGalleryImage: async (id: string, image: Partial<GalleryImage>): Promise<GalleryImage> => {
    return await apiRequest<GalleryImage>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(image),
    });
  },

  deleteGalleryImage: async (id: string): Promise<void> => {
    await apiRequest(`/gallery/${id}`, { method: 'DELETE' });
  },

  setGallery: async (images: GalleryImage[]): Promise<void> => {
    console.warn('setGallery deprecated - use createGalleryImage/updateGalleryImage');
  },

  // FAQs
  getFAQs: async (): Promise<FAQ[]> => {
    try {
      return await apiRequest<FAQ[]>('/faqs');
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  },

  createFAQ: async (faq: Omit<FAQ, 'id'>): Promise<FAQ> => {
    return await apiRequest<FAQ>('/faqs', {
      method: 'POST',
      body: JSON.stringify(faq),
    });
  },

  updateFAQ: async (id: string, faq: Partial<FAQ>): Promise<FAQ> => {
    return await apiRequest<FAQ>(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faq),
    });
  },

  deleteFAQ: async (id: string): Promise<void> => {
    await apiRequest(`/faqs/${id}`, { method: 'DELETE' });
  },

  setFAQs: async (faqs: FAQ[]): Promise<void> => {
    console.warn('setFAQs deprecated - use createFAQ/updateFAQ');
  },

  // Partners
  getPartners: async (): Promise<Partner[]> => {
    try {
      return await apiRequest<Partner[]>('/partners');
    } catch (error) {
      console.error('Error fetching partners:', error);
      return [];
    }
  },

  createPartner: async (partner: Omit<Partner, 'id'>): Promise<Partner> => {
    return await apiRequest<Partner>('/partners', {
      method: 'POST',
      body: JSON.stringify(partner),
    });
  },

  updatePartner: async (id: string, partner: Partial<Partner>): Promise<Partner> => {
    return await apiRequest<Partner>(`/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(partner),
    });
  },

  deletePartner: async (id: string): Promise<void> => {
    await apiRequest(`/partners/${id}`, { method: 'DELETE' });
  },

  setPartners: async (partners: Partner[]): Promise<void> => {
    console.warn('setPartners deprecated - use createPartner/updatePartner');
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    try {
      return await apiRequest<Category[]>('/categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    return await apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    return await apiRequest<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiRequest(`/categories/${id}`, { method: 'DELETE' });
  },

  setCategories: async (categories: Category[]): Promise<void> => {
    console.warn('setCategories deprecated - use createCategory/updateCategory');
  },

  // Creditations
  getCreditations: async (): Promise<Creditation[]> => {
    try {
      return await apiRequest<Creditation[]>('/creditations');
    } catch (error) {
      console.error('Error fetching creditations:', error);
      return [];
    }
  },

  createCreditation: async (creditation: Omit<Creditation, 'id'>): Promise<Creditation> => {
    return await apiRequest<Creditation>('/creditations', {
      method: 'POST',
      body: JSON.stringify(creditation),
    });
  },

  updateCreditation: async (id: string, creditation: Partial<Creditation>): Promise<Creditation> => {
    return await apiRequest<Creditation>(`/creditations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(creditation),
    });
  },

  deleteCreditation: async (id: string): Promise<void> => {
    await apiRequest(`/creditations/${id}`, { method: 'DELETE' });
  },

  setCreditations: async (creditations: Creditation[]): Promise<void> => {
    console.warn('setCreditations deprecated - use createCreditation/updateCreditation');
  },

  // Settings
  getSettings: async (): Promise<any> => {
    try {
      return await apiRequest<any>('/settings');
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  },

  updateSettings: async (settings: any): Promise<any> => {
    return await apiRequest<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // About (now part of settings)
  getAbout: async (): Promise<string> => {
    try {
      const settings = await storage.getSettings();
      return settings?.aboutContent || 'Welcome to Zion Train Tours & Travel Uganday.';
    } catch (error) {
      console.error('Error fetching about:', error);
      return 'Welcome to Zion Train Tours & Travel Uganda.';
    }
  },

  setAbout: async (content: string): Promise<void> => {
    await storage.updateSettings({ aboutContent: content });
  },

  // Contact submissions
  submitContact: async (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<any> => {
    return await apiRequest<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getContactSubmissions: async (): Promise<any[]> => {
    try {
      return await apiRequest<any[]>('/contact');
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      return [];
    }
  },

  updateContactStatus: async (id: string, status: string): Promise<any> => {
    return await apiRequest<any>(`/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Booking inquiries
  submitBooking: async (data: {
    packageId: string;
    packageTitle: string;
    customerName: string;
    email: string;
    phone: string;
    preferredDate: string;
    numberOfPeople: number;
    specialRequests?: string;
  }): Promise<any> => {
    return await apiRequest<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getBookings: async (status?: string): Promise<any[]> => {
    try {
      const url = status ? `/bookings?status=${status}` : '/bookings';
      return await apiRequest<any[]>(url);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },

  updateBookingStatus: async (id: string, status: string): Promise<any> => {
    return await apiRequest<any>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Helper to map old localStorage keys to API endpoints
function keyToEndpoint(key: string): string | null {
  const mapping: Record<string, string> = {
    'safari_packages': '/packages',
    'safari_articles': '/articles',
    'safari_gallery': '/gallery',
    'safari_faqs': '/faqs',
    'safari_partners': '/partners',
    'safari_categories': '/categories',
    'safari_creditations': '/creditations',
  };
  return mapping[key] || null;
}