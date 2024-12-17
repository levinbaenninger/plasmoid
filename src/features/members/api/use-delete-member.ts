import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCurrent } from '../../auth/api/use-current';

type ResponseType = InferResponseType<
  (typeof client.api.members)[':memberId']['$delete'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[':memberId']['$delete']
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: currentUser } = useCurrent();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType & { userId: string }
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[':memberId']['$delete']({
        param,
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      return await response.json();
    },
    onSuccess: (_, { userId }) => {
      toast.success('Member removed successfully');
      queryClient.invalidateQueries({ queryKey: ['members'] });

      if (userId === currentUser?.$id) {
        router.push('/');
      }
    },
    onError: () => {
      toast.error('Failed to remove member');
    },
  });

  return mutation;
};
