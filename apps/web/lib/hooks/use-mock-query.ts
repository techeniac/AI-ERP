"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useMockQuery<T>(
  key: string | string[],
  fetcher: () => T | Promise<T>
): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => fetcher(),
    staleTime: Infinity,
    retry: false,
  });
}

export function useMockQueryById<T>(
  key: string,
  id: string,
  fetcher: (id: string) => T | undefined
): UseQueryResult<T | undefined, Error> {
  return useQuery<T | undefined, Error>({
    queryKey: [key, id],
    queryFn: async () => fetcher(id),
    staleTime: Infinity,
    retry: false,
    enabled: !!id,
  });
}
