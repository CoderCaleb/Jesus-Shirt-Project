// lib/fetch-helper.ts
import { notFound } from 'next/navigation'

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any
  ) {
    super(`${data.error.message}`);
    this.name = 'ApiError';
  }
}

type FetchOptions = {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

export async function fetchHelper<T>(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: object;
    headers?: Record<string, string>;
    customConfig?: FetchOptions;
  } = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    customConfig = {}
  } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      // Next.js 13+ specific options
      cache: customConfig.cache,
      next: {
        revalidate: customConfig.revalidate,
        tags: customConfig.tags,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }

      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        response.status,
        response.statusText,
        errorData
      );
    }

    const data = await response.json();
    console.log(data)
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle fetch errors (network issues, etc.)
    throw new ApiError(
      500,
      'Network Error',
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}
