'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { CopyIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useResetInviteCode } from '../api/use-reset-invite-code';

interface WorkspaceInviteSectionProps {
  workspaceId: string;
  inviteCode: string;
  disabled?: boolean;
}

export const WorkspaceInviteSection = ({
  workspaceId,
  inviteCode,
  disabled,
}: WorkspaceInviteSectionProps) => {
  const router = useRouter();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();
  const { confirm } = useConfirmDialog();

  const inviteLink = `${window.location.origin}/workspaces/${workspaceId}/join/${inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success('Invite link copied to clipboard'));
  };

  const handleResetInviteCode = async () => {
    const confirmed = await confirm({
      title: 'Reset Invite Code',
      description: 'This action is irreversible. This will invalidate the current invite link.',
      variant: 'destructive',
      confirmText: 'Reset Code',
    });

    if (!confirmed) return;

    resetInviteCode(
      { param: { workspaceId } },
      {
        onSuccess: () => {
          toast.success('Invite code reset successfully');
          router.refresh();
        },
      },
    );
  };

  return (
    <Card className='w-full h-full border-none shadow-none'>
      <CardContent className='p-7'>
        <div className='flex flex-col'>
          <h3 className='font-bold'>Invite members</h3>
          <p className='text-sm text-muted-foreground'>
            Use the invite link to add members to your workspace.
          </p>
          <div className='mt-4'>
            <div className='flex items-center gap-x-2'>
              <Input disabled value={inviteLink} />
              <Button
                variant='secondary'
                className='size-12'
                onClick={handleCopyInviteLink}
              >
                <CopyIcon className='size-5' />
              </Button>
            </div>
          </div>
          <DottedSeparator className='py-7' />
          <Button
            className='mt-6 w-fit ml-auto'
            size='sm'
            variant='destructive'
            type='button'
            disabled={disabled || isResettingInviteCode}
            onClick={handleResetInviteCode}
          >
            Reset Invite Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
