# Query Re-fetching Issue Fix

## Problem Description

The queries were re-fetching on every render despite having `staleTime: Infinity` set. This was causing unnecessary network requests and poor performance.

## Root Causes

### 1. **Unstable Query Keys**

**Before:**
```typescript
// useTokens hook
queryKey: ["useTokens", tokenAddresses, chainId]

// useToken hook
const data = useTokens([address], chainId); // Creates new array every time
```

**Issues:**
- `tokenAddresses` array was being recreated on every render
- `useToken` was creating a new array `[address]` on every call
- Array references changed even with same content

### 2. **Missing Query Options**

**Before:**
```typescript
return useQuery({
  queryKey: ["useTokens", tokenAddresses, chainId],
  queryFn: async () => { /* ... */ },
  enabled: !!tokenAddresses?.length && !!chainId && !disabled,
  staleTime: Infinity,
  // Missing important options
});
```

**Missing Options:**
- `refetchOnMount: false`
- `refetchOnWindowFocus: false`
- `refetchOnReconnect: false`
- `gcTime` (garbage collection time)

### 3. **Inefficient useToken Implementation**

**Before:**
```typescript
export const useToken = (address?: string, chainId?: number) => {
  const data = useTokens([address], chainId); // Creates new array
  return useMemo(() => {
    return data.data?.[0];
  }, [data.data]);
};
```

**Issues:**
- Created new array `[address]` on every call
- Depended on `useTokens` which had its own instability issues
- Unnecessary wrapper around `useTokens`

## Solutions Applied

### 1. **Stabilized Query Keys**

**After:**
```typescript
// useTokens hook
const tokenAddresses = useMemo(
  () => {
    const addresses = _tokenAddresses?.filter((a): a is string => !!a) ?? [];
    return _.uniq(addresses).sort(); // Sort to ensure consistent order
  },
  [_tokenAddresses]
);

const queryKey = useMemo(
  () => ["useTokens", tokenAddresses, chainId],
  [tokenAddresses, chainId]
);
```

**Benefits:**
- Consistent array order with `.sort()`
- Stable query key with `useMemo`
- Prevents unnecessary re-renders

### 2. **Added Proper Query Options**

**After:**
```typescript
return useQuery({
  queryKey,
  queryFn: async () => { /* ... */ },
  enabled: !!tokenAddresses?.length && !!chainId && !disabled,
  staleTime: Infinity,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  gcTime: 1000 * 60 * 60 * 24, // 24 hours
});
```

**Benefits:**
- Prevents re-fetching on mount
- Prevents re-fetching on window focus
- Prevents re-fetching on reconnect
- Controls garbage collection

### 3. **Separate useToken Hook**

**After:**
```typescript
export const useToken = (address?: string, chainId?: number) => {
  const queryKey = useMemo(
    () => ["useToken", address, chainId],
    [address, chainId]
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Direct token fetching logic
    },
    enabled: !!address && !!chainId,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
```

**Benefits:**
- Independent query key
- No array creation
- Direct token fetching
- Better performance

### 4. **Fixed USD Oracle Query**

**After:**
```typescript
const query = useQuery({
  queryKey: ["usd-oracle", token.data?.address, token.data?.decimals, chainId],
  // ... rest of config
  staleTime: 1000 * 60 * 5, // 5 minutes for price data
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  gcTime: 1000 * 60 * 30, // 30 minutes
});
```

**Benefits:**
- Proper token data access
- Appropriate stale time for price data
- Prevents unnecessary re-fetching

## Performance Improvements

### Before Fix:
- Queries re-fetched on every render
- Multiple network requests for same data
- Poor user experience with loading states
- Unnecessary bandwidth usage

### After Fix:
- Queries only fetch once per unique data
- Cached data reused across renders
- Smooth user experience
- Reduced network requests

## Testing the Fix

### 1. **Check Network Tab**
- Open browser dev tools
- Go to Network tab
- Navigate between pages
- Verify no duplicate requests for same data

### 2. **Check React Query DevTools**
- Install React Query DevTools
- Monitor query cache
- Verify queries stay in cache
- Check query invalidation

### 3. **Performance Monitoring**
- Monitor bundle size
- Check memory usage
- Verify render performance
- Test with multiple tokens

## Best Practices for Future Queries

### 1. **Always Use Stable Query Keys**
```typescript
const queryKey = useMemo(() => ['queryName', stableParams], [stableParams]);
```

### 2. **Add Proper Query Options**
```typescript
return useQuery({
  queryKey,
  queryFn,
  staleTime: Infinity, // or appropriate time
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  gcTime: 1000 * 60 * 60 * 24, // 24 hours
});
```

### 3. **Avoid Array Creation in Query Keys**
```typescript
// ❌ Bad
queryKey: ['tokens', [address1, address2]]

// ✅ Good
queryKey: ['tokens', address1, address2]
```

### 4. **Use Separate Hooks for Different Data**
```typescript
// ❌ Bad - Single hook for multiple purposes
const useData = (params) => useQuery({...})

// ✅ Good - Specific hooks
const useToken = (address) => useQuery({...})
const useTokens = (addresses) => useQuery({...})
```

## Migration Guide

If you have existing queries with similar issues:

1. **Identify unstable query keys**
2. **Add missing query options**
3. **Stabilize array parameters**
4. **Test thoroughly**
5. **Monitor performance**

## Common Pitfalls to Avoid

1. **Creating arrays in query keys**
2. **Missing query options**
3. **Unstable dependencies**
4. **Not using useMemo for query keys**
5. **Over-fetching data**

## Debugging Tips

1. **Use React Query DevTools**
2. **Check query cache**
3. **Monitor network requests**
4. **Add console logs to queryFn**
5. **Verify query key stability** 