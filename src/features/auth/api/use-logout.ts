import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();

      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/sign-in');
    },
    onError: () => {
      toast.error('Failed to log out');
    },
  });

  return mutation;
};
