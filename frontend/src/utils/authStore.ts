import { User } from '@/types';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

type AuthListener = (state: AuthState) => void;

class AuthStore {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
  };
  
  private listeners: Set<AuthListener> = new Set();

  // Get current state
  getState(): AuthState {
    return { ...this.state };
  }

  // Subscribe to state changes
  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Update the authentication state
  setState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  // Set user and mark as authenticated
  setUser(user: User): void {
    this.setState({
      user,
      isAuthenticated: true,
    });
  }

  // Clear user and mark as unauthenticated
  clearUser(): void {
    this.setState({
      user: null,
      isAuthenticated: false,
    });
  }

  // Update user data while keeping authenticated state
  updateUser(updates: Partial<User>): void {
    if (this.state.user) {
      const updatedUser = { ...this.state.user, ...updates };
      this.setState({ user: updatedUser });
    }
  }

  // Initialize state from localStorage
  initialize(): void {
    const userStr = localStorage.getItem('nextcinema_user');
    const hasToken = localStorage.getItem('nextcinema_token');
    const hasAuth = localStorage.getItem('nextcinema_auth') === 'true';
    
    if (userStr && hasToken && hasAuth) {
      try {
        const user = JSON.parse(userStr);
        this.setState({
          user,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        this.clearUser();
      }
    } else {
      this.clearUser();
    }
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach(listener => listener(currentState));
  }
}

// Create a singleton instance
export const authStore = new AuthStore();

// Initialize the store when the module loads
authStore.initialize();