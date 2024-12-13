import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

export const useMe = () => {
  const query = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await client.api.auth.me.$get();

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
