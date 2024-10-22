import { Stack, Skeleton } from '@chakra-ui/react';

export function PageLoader({className = ''}: {className?: string}) {
  return (
    <Stack width="100%" className={className}>
      <Skeleton width="80%" height="20px" />
      <Skeleton width="60%" height="20px" />
      <Skeleton width="50%" height="20px" />
      <Skeleton width="50%" height="20px" />
      <Skeleton width="20%" height="20px" />
    </Stack>
  );
}

