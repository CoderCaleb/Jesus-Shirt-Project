// lib/fetch-helper.ts
import { notFound } from 'next/navigation';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any
  ) {
    super(`${data?.error?.message||data}`);
    this.name = 'ApiError';
  }
}

type FetchOptions = {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
};

type ErrorHandlers = {
  on404?: () => void;
  onAuthError?: (status: number) => void;
  onServerError?: (status: number) => void;
  onOtherError?: (status: number) => void;
};

export async function fetchHelper<T>(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: object;
    headers?: Record<string, string>;
    customConfig?: FetchOptions;
    errorHandlers?: ErrorHandlers;
  } = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    customConfig = {},
    errorHandlers = {},
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
      const errorData = await response.json().catch(() => null);
      const { status } = response;

      // Handle specific status codes
      if (status === 404) {
        if (errorHandlers.on404) {
          errorHandlers.on404();
        } else {
          notFound();
        }
      } else if (status === 401 || status === 403) {
        if (errorHandlers.onAuthError) {
          errorHandlers.onAuthError(status);
        }
      } else if (status >= 500) {
        if (errorHandlers.onServerError) {
          errorHandlers.onServerError(status);
        }
      } else {
        if (errorHandlers.onOtherError) {
          errorHandlers.onOtherError(status);
        }
      }

      throw new ApiError(
        response.status,
        response.statusText,
        errorData
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      'Network Error',
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}
