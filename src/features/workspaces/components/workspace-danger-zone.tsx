'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useRouter } from 'next/navigation';
import { useDeleteWorkspace } from '../api/use-delete-workspace';

interface WorkspaceDangerZoneProps {
  workspaceId: string;
  disabled?: boolean;
}

export const WorkspaceDangerZone = ({
  workspaceId,
  disabled,
}: WorkspaceDangerZoneProps) => {
  const router = useRouter();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const { confirm } = useConfirmDialog();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Workspace',
      description: 'This action is irreversible. All data will be lost.',
      variant: 'destructive',
      confirmText: 'Delete Workspace',
    });

    if (!confirmed) return;

    deleteWorkspace(
      { param: { workspaceId } },
      {
        onSuccess: () => {
          router.push('/');
        },
      },
    );
  };

  return (
    <Card className='w-full h-full border-none shadow-none'>
      <CardContent className='p-7'>
        <div className='flex flex-col'>
          <h3 className='font-bold'>Danger Zone</h3>
          <p className='text-sm text-muted-foreground'>
            Deleting a workspace is irreversible. All data will be lost.
          </p>
          <DottedSeparator className='py-7' />
          <Button
            className='mt-6 w-fit ml-auto'
            size='sm'
            variant='destructive'
            type='button'
            disabled={disabled || isDeletingWorkspace}
            onClick={handleDelete}
          >
            Delete Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
