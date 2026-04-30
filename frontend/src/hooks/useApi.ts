import { useState, useCallback } from "react";
import { ApiError } from "../types/api";

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: <R = T>(promise: Promise<R>) => Promise<R | null>;
  setData: (data: T | null) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Hook para gerenciar requisições à API
 * @param initialData - Dados iniciais (opcional)
 * @returns Estado da requisição + funções auxiliares
 *
 * @example
 * const { data, isLoading, error, execute } = useApi<User>(null);
 *
 * const handleFetch = async () => {
 *   await execute(userService.get(1));
 * };
 */
export function useApi<T>(initialData: T | null = null): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async <R = T>(promise: Promise<R>) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await promise;
      setData(result as unknown as T);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("API Error:", apiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setIsLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    isLoading,
    error,
    execute,
    setData,
    clearError,
    reset,
  };
}

export default useApi;
