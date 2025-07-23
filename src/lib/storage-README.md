# Local Storage Dictionary

This module provides a comprehensive, type-safe local storage utility for the Debug Tool application. It centralizes all localStorage operations and provides a clean API for managing application state.

## Features

- **Type-safe storage**: All storage operations are fully typed with TypeScript
- **Centralized keys**: All storage keys are defined in one place to prevent conflicts
- **Caching with expiration**: Built-in cache management with automatic expiration
- **Error handling**: Graceful error handling for storage operations
- **Utility methods**: Helper functions for common operations
- **Data export/import**: Ability to export and import storage data

## Quick Start

```typescript
import { storage, setDebugMode, getDebugMode } from '@/lib/storage';

// Set debug mode
setDebugMode(true);

// Get debug mode
const isDebug = getDebugMode();

// Or use the storage instance directly
storage.setDebugMode(true);
const isDebug = storage.getDebugMode();
```

## Storage Keys

All storage keys are defined in the `STORAGE_KEYS` constant:

```typescript
export const STORAGE_KEYS = {
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
```

## Data Types

### UserPreferences
```typescript
interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  dateFormat?: string;
  numberFormat?: 'standard' | 'scientific';
  autoRefresh?: boolean;
  refreshInterval?: number;
}
```

### FilterSettings
```typescript
interface FilterSettings {
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
```

### RecentSearch
```typescript
interface RecentSearch {
  query: string;
  timestamp: number;
  type: 'session' | 'transaction' | 'user';
}
```

## API Reference

### Storage Manager Instance

The main storage utility is available as a singleton instance:

```typescript
import { storage } from '@/lib/storage';
```

### Generic Methods

```typescript
// Set a value
storage.set<T>(key: string, value: T): void

// Get a value
storage.get<T>(key: string, defaultValue?: T): T | null

// Remove a key
storage.remove(key: string): void

// Check if key exists
storage.has(key: string): boolean

// Clear all storage
storage.clear(): void
```

### Debug Mode

```typescript
// Set debug mode
storage.setDebugMode(enabled: boolean): void

// Get debug mode
storage.getDebugMode(): boolean

// Convenience functions
setDebugMode(enabled: boolean): void
getDebugMode(): boolean
```

### Authentication

```typescript
// Set Google token
storage.setGoogleToken(token: string): void

// Get Google token
storage.getGoogleToken(): string | null

// Convenience functions
setGoogleToken(token: string): void
getGoogleToken(): string | null
```

### Cache Management

```typescript
// Token cache (24 hour expiration)
storage.setTokenCache(address: string, chainId: number, data: unknown): void
storage.getTokenCache(address: string, chainId: number): unknown | null

// Tokens list cache (1 hour expiration)
storage.setTokensCache(chainId: number, data: unknown): void
storage.getTokensCache(chainId: number): unknown | null
```

### User Preferences

```typescript
// Set user preferences
storage.setUserPreferences(preferences: UserPreferences): void

// Get user preferences
storage.getUserPreferences(): UserPreferences

// Update user preferences (partial)
storage.updateUserPreferences(updates: Partial<UserPreferences>): void

// Convenience functions
setUserPreferences(preferences: UserPreferences): void
getUserPreferences(): UserPreferences
```

### Filter Settings

```typescript
// Set filter settings
storage.setFilterSettings(settings: FilterSettings): void

// Get filter settings
storage.getFilterSettings(): FilterSettings

// Convenience functions
setFilterSettings(settings: FilterSettings): void
getFilterSettings(): FilterSettings
```

### Recent Searches

```typescript
// Add recent search (automatically manages duplicates and limits)
storage.addRecentSearch(search: RecentSearch): void

// Get recent searches
storage.getRecentSearches(): RecentSearch[]

// Convenience functions
addRecentSearch(search: RecentSearch): void
getRecentSearches(): RecentSearch[]
```

### Recent Sessions

```typescript
// Add recent session
storage.addRecentSession(session: RecentSession): void

// Get recent sessions
storage.getRecentSessions(): RecentSession[]
```

### UI State

```typescript
// Set UI state
storage.setUIState(state: UISettings): void

// Get UI state
storage.getUIState(): UISettings
```

### Table Settings

```typescript
// Set table columns for a specific table
storage.setTableColumns(tableId: string, columns: Record<string, TableColumnSettings>): void

// Get table columns for a specific table
storage.getTableColumns(tableId: string): Record<string, TableColumnSettings>

// Set sort preferences for a specific table
storage.setSortPreferences(tableId: string, sort: SortPreferences): void

// Get sort preferences for a specific table
storage.getSortPreferences(tableId: string): SortPreferences | null
```

### Utility Methods

```typescript
// Clear all cache entries
storage.clearCache(): void

// Clear all user data (keeps auth tokens and debug mode)
storage.clearUserData(): void

// Export all storage data
storage.exportData(): Record<string, unknown>

// Import storage data
storage.importData(data: Record<string, unknown>): void
```

## Usage Examples

### Managing User Preferences

```typescript
import { setUserPreferences, getUserPreferences } from '@/lib/storage';

// Set theme preference
setUserPreferences({
  theme: 'dark',
  language: 'en',
  autoRefresh: true,
  refreshInterval: 30000
});

// Get current preferences
const prefs = getUserPreferences();
console.log(prefs.theme); // 'dark'
```

### Managing Filter Settings

```typescript
import { setFilterSettings, getFilterSettings } from '@/lib/storage';

// Set network filters
setFilterSettings({
  network: [1, 137], // Ethereum and Polygon
  status: ['success', 'failed'],
  minAmount: 100
});

// Get current filters
const filters = getFilterSettings();
console.log(filters.network); // [1, 137]
```

### Managing Recent Searches

```typescript
import { addRecentSearch, getRecentSearches } from '@/lib/storage';

// Add a search
addRecentSearch({
  query: '0x1234...',
  timestamp: Date.now(),
  type: 'session'
});

// Get recent searches
const searches = getRecentSearches();
console.log(searches.length); // Number of recent searches
```

### Cache Management

```typescript
import { storage } from '@/lib/storage';

// Cache token data
storage.setTokenCache('0x1234...', 1, {
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18
});

// Retrieve cached token data
const tokenData = storage.getTokenCache('0x1234...', 1);
if (tokenData) {
  console.log(tokenData.name); // 'Ethereum'
}
```

### Debug Mode

```typescript
import { setDebugMode, getDebugMode } from '@/lib/storage';

// Enable debug mode
setDebugMode(true);

// Check if debug mode is enabled
if (getDebugMode()) {
  console.log('Debug mode is active');
}
```

## Migration from Direct localStorage

If you're migrating from direct localStorage usage, here's how to update your code:

### Before
```typescript
// Setting a value
localStorage.setItem('debug', 'true');

// Getting a value
const debug = localStorage.getItem('debug') === 'true';
```

### After
```typescript
import { setDebugMode, getDebugMode } from '@/lib/storage';

// Setting a value
setDebugMode(true);

// Getting a value
const debug = getDebugMode();
```

## Error Handling

The storage utility includes built-in error handling:

- All operations are wrapped in try-catch blocks
- Errors are logged to console but don't throw exceptions
- Failed operations return sensible defaults (null, empty arrays, etc.)

## Performance Considerations

- Cache entries have automatic expiration to prevent storage bloat
- Recent searches and sessions are limited to prevent excessive storage usage
- All operations are synchronous for simplicity
- Consider using the cache methods for frequently accessed data

## Testing

The storage utility can be easily tested by mocking localStorage:

```typescript
// In your test setup
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
``` 