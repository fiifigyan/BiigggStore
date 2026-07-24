// apps/mobile/src/hooks/useOrders.ts
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../api/orders';
import { queryKeys } from '../query/keys';

export const useOrders = (params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => orderApi.getOrders(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => orderApi.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrderStatus = (orderId: string) => {
  return useQuery({
    queryKey: ['order-status', orderId],
    queryFn: () => orderApi.getOrderStatus(orderId),
    enabled: !!orderId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};