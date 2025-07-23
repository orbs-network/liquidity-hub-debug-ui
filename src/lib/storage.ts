// Local Storage Dictionary for Debug Tool
// Provides type-safe storage utilities for managing application state

export interface StorageKeys {
  // Debug settings
  DEBUG_MODE: 'debug';
  
  // Authentication
  GOOGLE_TOKEN: 'google_token';
  
  // Cache keys
  TOKEN_CACHE_PREFIX: 'token_cache_';
  TOKENS_CACHE_PREFIX: 'tokens_cache_';
  USD_ORACLE_CACHE_PREFIX: 'usd_oracle_cache_';
  
  // Swap session data
  SWAP_SESSIONS: 'swap_sessions';
  SWAP_QUOTES: 'swap_quotes';
  SWAP_LOGS: 'swap_logs';
  
  // User preferences
  USER_PREFERENCES: 'user_preferences';
  FILTER_SETTINGS: 'filter_settings';
  
  // Recent searches
  RECENT_SEARCHES: 'recent_searches';
  RECENT_SESSIONS: 'recent_sessions';
  
  // Network settings
  SELECTED_NETWORK: 'selected_network';
  NETWORK_PREFERENCES: 'network_preferences';
  
  // UI state
  UI_STATE: 'ui_state';
  TABLE_COLUMNS: 'table_columns';
  SORT_PREFERENCES: 'sort_preferences';
}

export const STORAGE_KEYS: StorageKeys = {
  DEBUG_MODE: 'debug',
  GOOGLE_TOKEN: 'google_token',
  TOKEN_CACHE_PREFIX: 'token_cache_',
  TOKENS_CACHE_PREFIX: 'tokens_cache_',
  USD_ORACLE_CACHE_PREFIX: 'usd_oracle_cache_',
  SWAP_SESSIONS: 'swap_sessions',
  SWAP_QUOTES: 'swap_quotes',
  SWAP_LOGS: 'swap_logs',
  USER_PREFERENCES: 'user_preferences',
  FILTER_SETTINGS: 'filter_settings',
  RECENT_SEARCHES: 'recent_searches',
  RECENT_SESSIONS: 'recent_sessions',
  SELECTED_NETWORK: 'selected_network',
  NETWORK_PREFERENCES: 'network_preferences',
  UI_STATE: 'ui_state',
  TABLE_COLUMNS: 'table_columns',
  SORT_PREFERENCES: 'sort_preferences',
} as const;

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  dateFormat?: string;
  numberFormat?: 'standard' | 'scientific';
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface FilterSettings {
  network?: number[];
  status?: string[];
  dateRange?: {
    from: number;
    to: number;
  };
  userAddress?: string;
  dex?: string[];
  minAmount?: number;
  maxAmount?: number;
}

export interface UISettings {
  sidebarCollapsed?: boolean;
  debugPanelOpen?: boolean;
  logsPanelOpen?: boolean;
  tablePageSize?: number;
  showAdvancedData?: boolean;
}

export interface RecentSearch {
  query: string;
  timestamp: number;
  type: 'session' | 'transaction' | 'user';
}

export interface RecentSession {
  sessionId: string;
  timestamp: number;
  network: number;
  status: string;
}

export interface NetworkPreferences {
  defaultNetwork?: number;
  favoriteNetworks?: number[];
  gasPricePreferences?: Record<number, number>;
}

export interface TableColumnSettings {
  visible: boolean;
  order: number;
  width?: number;
}

export interface SortPreferences {
  field: string;
  direction: 'asc' | 'desc';
}

// Storage utility class
export class StorageManager {
  private static instance: StorageManager;
  
  private constructor() {}
  
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Generic storage methods
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return defaultValue ?? null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  // Debug mode
  setDebugMode(enabled: boolean): void {
    this.set(STORAGE_KEYS.DEBUG_MODE, enabled);
  }

  getDebugMode(): boolean {
    return this.get(STORAGE_KEYS.DEBUG_MODE, false) ?? false;
  }

  // Authentication
  setGoogleToken(token: string): void {
    this.set(STORAGE_KEYS.GOOGLE_TOKEN, token);
  }

  getGoogleToken(): string | null {
    return this.get<string>(STORAGE_KEYS.GOOGLE_TOKEN);
  }

  // Cache management
  setTokenCache(address: string, chainId: number, data: unknown): void {
    const key = `${STORAGE_KEYS.TOKEN_CACHE_PREFIX}${chainId}_${address}`;
    this.set(key, { data, timestamp: Date.now() });
  }

  getTokenCache(address: string, chainId: number): unknown | null {
    const key = `${STORAGE_KEYS.TOKEN_CACHE_PREFIX}${chainId}_${address}`;
    const cached = this.get<{ data: unknown; timestamp: number }>(key);
    if (!cached) return null;
    
    // Check if cache is still valid (24 hours)
    const cacheAge = Date.now() - cached.timestamp;
    if (cacheAge > 24 * 60 * 60 * 1000) {
      this.remove(key);
      return null;
    }
    
    return cached.data;
  }

  setTokensCache(chainId: number, data: unknown): void {
    const key = `${STORAGE_KEYS.TOKENS_CACHE_PREFIX}${chainId}`;
    this.set(key, { data, timestamp: Date.now() });
  }

  getTokensCache(chainId: number): unknown | null {
    const key = `${STORAGE_KEYS.TOKENS_CACHE_PREFIX}${chainId}`;
    const cached = this.get<{ data: unknown; timestamp: number }>(key);
    if (!cached) return null;
    
    // Check if cache is still valid (1 hour)
    const cacheAge = Date.now() - cached.timestamp;
    if (cacheAge > 60 * 60 * 1000) {
      this.remove(key);
      return null;
    }
    
    return cached.data;
  }

  // Swap sessions
  setSwapSessions(sessions: unknown[]): void {
    this.set(STORAGE_KEYS.SWAP_SESSIONS, sessions);
  }

  getSwapSessions(): unknown[] {
    return this.get<unknown[]>(STORAGE_KEYS.SWAP_SESSIONS, []) ?? [];
  }

  addSwapSession(session: unknown): void {
    const sessions = this.getSwapSessions();
    sessions.unshift(session);
    // Keep only last 100 sessions
    if (sessions.length > 100) {
      sessions.splice(100);
    }
    this.setSwapSessions(sessions);
  }

  // User preferences
  setUserPreferences(preferences: UserPreferences): void {
    this.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  getUserPreferences(): UserPreferences {
    return this.get<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES, {}) ?? {};
  }

  updateUserPreferences(updates: Partial<UserPreferences>): void {
    const current = this.getUserPreferences();
    this.setUserPreferences({ ...current, ...updates });
  }

  // Filter settings
  setFilterSettings(settings: FilterSettings): void {
    this.set(STORAGE_KEYS.FILTER_SETTINGS, settings);
  }

  getFilterSettings(): FilterSettings {
    return this.get<FilterSettings>(STORAGE_KEYS.FILTER_SETTINGS, {}) ?? {};
  }

  // Recent searches
  addRecentSearch(search: RecentSearch): void {
    const searches = this.getRecentSearches();
    // Remove duplicate
    const filtered = searches.filter(s => s.query !== search.query);
    filtered.unshift(search);
    // Keep only last 20 searches
    if (filtered.length > 20) {
      filtered.splice(20);
    }
    this.set(STORAGE_KEYS.RECENT_SEARCHES, filtered);
  }

  getRecentSearches(): RecentSearch[] {
    return this.get<RecentSearch[]>(STORAGE_KEYS.RECENT_SEARCHES, []) ?? [];
  }

  // Recent sessions
  addRecentSession(session: RecentSession): void {
    const sessions = this.getRecentSessions();
    // Remove duplicate
    const filtered = sessions.filter(s => s.sessionId !== session.sessionId);
    filtered.unshift(session);
    // Keep only last 50 sessions
    if (filtered.length > 50) {
      filtered.splice(50);
    }
    this.set(STORAGE_KEYS.RECENT_SESSIONS, filtered);
  }

  getRecentSessions(): RecentSession[] {
    return this.get<RecentSession[]>(STORAGE_KEYS.RECENT_SESSIONS, []) ?? [];
  }

  // Network preferences
  setNetworkPreferences(preferences: NetworkPreferences): void {
    this.set(STORAGE_KEYS.NETWORK_PREFERENCES, preferences);
  }

  getNetworkPreferences(): NetworkPreferences {
    return this.get<NetworkPreferences>(STORAGE_KEYS.NETWORK_PREFERENCES, {}) ?? {};
  }

  // UI state
  setUIState(state: UISettings): void {
    this.set(STORAGE_KEYS.UI_STATE, state);
  }

  getUIState(): UISettings {
    return this.get<UISettings>(STORAGE_KEYS.UI_STATE, {}) ?? {};
  }

  // Table columns
  setTableColumns(tableId: string, columns: Record<string, TableColumnSettings>): void {
    const key = `${STORAGE_KEYS.TABLE_COLUMNS}_${tableId}`;
    this.set(key, columns);
  }

  getTableColumns(tableId: string): Record<string, TableColumnSettings> {
    const key = `${STORAGE_KEYS.TABLE_COLUMNS}_${tableId}`;
    return this.get<Record<string, TableColumnSettings>>(key, {}) ?? {};
  }

  // Sort preferences
  setSortPreferences(tableId: string, sort: SortPreferences): void {
    const key = `${STORAGE_KEYS.SORT_PREFERENCES}_${tableId}`;
    this.set(key, sort);
  }

  getSortPreferences(tableId: string): SortPreferences | null {
    const key = `${STORAGE_KEYS.SORT_PREFERENCES}_${tableId}`;
    return this.get<SortPreferences>(key);
  }

  // Utility methods
  clearCache(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEYS.TOKEN_CACHE_PREFIX) || 
          key.startsWith(STORAGE_KEYS.TOKENS_CACHE_PREFIX) ||
          key.startsWith(STORAGE_KEYS.USD_ORACLE_CACHE_PREFIX)) {
        this.remove(key);
      }
    });
  }

  clearUserData(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key !== STORAGE_KEYS.GOOGLE_TOKEN && key !== STORAGE_KEYS.DEBUG_MODE) {
        this.remove(key);
      }
    });
  }

  exportData(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    Object.keys(localStorage).forEach(key => {
      data[key] = this.get(key);
    });
    return data;
  }

  importData(data: Record<string, unknown>): void {
    Object.entries(data).forEach(([key, value]) => {
      this.set(key, value);
    });
  }
}

// Export singleton instance
export const storage = StorageManager.getInstance();

// Convenience functions for common operations
export const setDebugMode = (enabled: boolean) => storage.setDebugMode(enabled);
export const getDebugMode = () => storage.getDebugMode();
export const setGoogleToken = (token: string) => storage.setGoogleToken(token);
export const getGoogleToken = () => storage.getGoogleToken();
export const setUserPreferences = (preferences: UserPreferences) => storage.setUserPreferences(preferences);
export const getUserPreferences = () => storage.getUserPreferences();
export const setFilterSettings = (settings: FilterSettings) => storage.setFilterSettings(settings);
export const getFilterSettings = () => storage.getFilterSettings(); 