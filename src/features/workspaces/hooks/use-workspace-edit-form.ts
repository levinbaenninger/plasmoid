'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useUpdateWorkspace } from '../api/use-update-workspace';
import { updateWorkspaceSchema } from '../schemas';
import { Workspace } from '../types';

export const useWorkspaceEditForm = (workspace: Workspace) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...workspace,
      image: workspace.imageUrl ?? undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : undefined,
    };

    mutate(
      { form: finalValues, param: { workspaceId: workspace.$id } },
      {
        onSuccess: () => {
          toast.success('Workspace updated successfully');
          router.refresh();
        },
        onError: () => {
          toast.error('Failed to update workspace');
        },
      },
    );
  };

  return {
    form,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
