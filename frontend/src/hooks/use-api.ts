
import { useState } from 'react';

// Generic hook for handling API requests
export function useApi<T, R>(
  apiFunction: (params: T) => Promise<R>
) {
  const [data, setData] = useState<R | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (params: T) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiFunction(params);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    execute
  };
}

// Example usage:
/*
import { useApi } from '@/hooks/use-api';
import { authService } from '@/api';

function LoginForm() {
  const { execute: login, isLoading, error } = useApi(authService.login);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({
        email: 'user@example.com',
        password: 'password123'
      });
      console.log('Logged in:', userData);
    } catch (err) {
      console.error('Login failed');
    }
  };
  
  return (
    // Form JSX here
  );
}
*/
