import { Stack, Skeleton } from '@chakra-ui/react';

export function PageLoader({className = ''}: {className?: string}) {
  return (
    <Stack width="100%" className={className}>
      <Skeleton width="100%" height="20px" />
      <Skeleton width="80%" height="20px" />
      <Skeleton width="70%" height="20px" />
    </Stack>
  );
}

