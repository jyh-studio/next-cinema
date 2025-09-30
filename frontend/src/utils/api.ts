// Determine the correct API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    // If running on the dev server port with proxy, use relative URL
    if (window.location.port === '5137') {
      return '/api/v1';
    }
  }
  
  // Use the environment variable for API base URL, fallback to localhost:8000
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return `${baseUrl}/api/v1`;
};

const API_BASE_URL = getApiBaseUrl();

// Backend base URL for media files - use environment variable
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8000';

// Utility function to get full media URL
export const getMediaUrl = (relativePath: string | null | undefined): string | null => {
  if (!relativePath) return null;
  // If it's already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  // Prepend backend base URL to relative paths
  return `${BACKEND_BASE_URL}${relativePath}`;
};

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('nextcinema_token');
};

// Make authenticated API request
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (parseError) {
      // If we can't parse the error response as JSON, it might be HTML
      const text = await response.text().catch(() => '');
      if (text.includes('<!doctype') || text.includes('<html')) {
        errorMessage = 'Server returned HTML instead of JSON. Check if the backend is running and accessible.';
      }
    }
    throw new Error(errorMessage);
  }
  
  // Ensure we can parse the response as JSON
  try {
    return await response.json();
  } catch (parseError) {
    const text = await response.text().catch(() => '');
    if (text.includes('<!doctype') || text.includes('<html')) {
      throw new Error('Server returned HTML instead of JSON. Check if the backend is running and accessible.');
    }
    throw new Error('Invalid JSON response from server');
  }
};

// Community Feed API functions
export const communityApi = {
  // Posts
  createPost: async (postData: { content: string; type: string; media_url?: string }) => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  getPosts: async (skip: number = 0, limit: number = 20) => {
    return apiRequest(`/posts?skip=${skip}&limit=${limit}`);
  },

  getPost: async (postId: string) => {
    return apiRequest(`/posts/${postId}`);
  },

  updatePost: async (postId: string, postData: { content?: string; media_url?: string }) => {
    return apiRequest(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  deletePost: async (postId: string) => {
    return apiRequest(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  getUserPosts: async (userId: string, skip: number = 0, limit: number = 20) => {
    return apiRequest(`/users/${userId}/posts?skip=${skip}&limit=${limit}`);
  },

  // Likes
  toggleLike: async (postId: string) => {
    return apiRequest(`/posts/${postId}/like`, {
      method: 'POST',
    });
  },
  // File Upload
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      let errorMessage = `Upload failed! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (parseError) {
        const text = await response.text().catch(() => '');
        if (text.includes('<!doctype') || text.includes('<html')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        }
      }
      throw new Error(errorMessage);
    }
    
    try {
      return await response.json();
    } catch (parseError) {
      const text = await response.text().catch(() => '');
      if (text.includes('<!doctype') || text.includes('<html')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw new Error('Invalid response from server');
    }
  },

  // Comments
  createComment: async (postId: string, content: string) => {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  deleteComment: async (commentId: string) => {
    return apiRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (parseError) {
        const text = await response.text().catch(() => '');
        if (text.includes('<!doctype') || text.includes('<html')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        }
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const text = await response.text().catch(() => '');
      if (text.includes('<!doctype') || text.includes('<html')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw new Error('Invalid response from server');
    }
    
    // Store token
    localStorage.setItem('nextcinema_token', data.access_token);
    
    return data;
  },

  signup: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      let errorMessage = 'Signup failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (parseError) {
        const text = await response.text().catch(() => '');
        if (text.includes('<!doctype') || text.includes('<html')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        }
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const text = await response.text().catch(() => '');
      if (text.includes('<!doctype') || text.includes('<html')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw new Error('Invalid response from server');
    }
    
    // Store token
    localStorage.setItem('nextcinema_token', data.access_token);
    
    return data;
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('nextcinema_token');
    localStorage.removeItem('nextcinema_user');
    localStorage.removeItem('nextcinema_auth');
  },

  getUserProfile: async (userId: string) => {
    return apiRequest(`/profiles/user/${userId}`);
  },

  createProfile: async (profileData: Record<string, unknown>) => {
    return apiRequest('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  updateProfile: async (profileId: string, profileData: Record<string, unknown>) => {
    return apiRequest(`/profiles/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  getProfileAIInsights: async (profileId: string) => {
    return apiRequest(`/profiles/${profileId}/ai-insights`);
  },

  getUserProfileAIInsights: async (userId: string) => {
    return apiRequest(`/profiles/user/${userId}/ai-insights`);
  },
};

// Worksheet API functions
export const worksheetApi = {
  getWorksheets: async () => {
    return apiRequest('/worksheets');
  },

  downloadWorksheet: async (category: string, itemId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/worksheets/${category}/${itemId}`, {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download worksheet: ${response.status}`);
    }

    // Get the filename from the response headers or use a default
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `${itemId}.pdf`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};

// News API functions
export const newsApi = {
  getNews: async (skip: number = 0, limit: number = 20, category?: string) => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...(category && { category })
    });
    return apiRequest(`/news?${params}`);
  },

  getNewsArticle: async (articleId: string) => {
    return apiRequest(`/news/${articleId}`);
  },

  fetchNews: async () => {
    return apiRequest('/news/fetch', {
      method: 'POST',
    });
  },

  createNewsArticle: async (articleData: Record<string, unknown>) => {
    return apiRequest('/news', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },

  getNewsCategories: async () => {
    return apiRequest('/news/categories');
  },
};