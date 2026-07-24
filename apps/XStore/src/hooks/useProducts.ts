// apps/mobile/src/hooks/useProducts.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productApi } from '../api/products';
import { queryKeys } from '../query/keys';

export const useProducts = (filters?: any) => {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: ({ pageParam = 0 }) =>
      productApi.getProducts({
        limit: 20,
        offset: pageParam,
        ...filters,
      }),
    getNextPageParam: (lastPage) => {
      const { offset, limit, count } = lastPage;
      return offset + limit < count ? offset + limit : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productApi.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => productApi.searchProducts(query),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
};