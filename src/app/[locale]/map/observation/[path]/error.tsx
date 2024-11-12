'use client';

// Error components must be Client Components
import { useEffect } from 'react';

import ErrorMessage from '@/components/error-message';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <ErrorMessage message={error?.message} />
    </div>
  );
}
