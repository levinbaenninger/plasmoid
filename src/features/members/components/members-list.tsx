'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { MemberRole } from '@/features/members/types';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { useWorkspaceId } from '../../workspaces/hooks/use-workspace-id';

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { confirm } = useConfirmDialog();

  const { data } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ param: { memberId }, json: { role } });
  };

  const handleDeleteMember = async (memberId: string, userId: string) => {
    const confirmed = await confirm({
      title: 'Remove Member',
      description: 'Are you sure you want to remove this member?',
      variant: 'destructive',
      confirmText: 'Remove Member',
    });

    if (!confirmed) return;

    deleteMember(
      { param: { memberId }, userId },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };

  return (
    <Card className='w-full h-full border-none shadow-none'>
      <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
        <Button variant='secondary' size='sm' asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className='size-4 mr-1' />
            Back
          </Link>
        </Button>
        <CardTitle className='text-xl font-bold'>Members List</CardTitle>
      </CardHeader>

      <div className='px-7'>
        <DottedSeparator />
      </div>

      <CardContent className='p-7'>
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className='flex items-center gap-2'>
              <MemberAvatar
                name={member.name}
                className='size-10'
                fallbackClassName='text-lg'
              />
              <div className='flex flex-col'>
                <p className='text-sm font-medium'>{member.name}</p>
                <p className='text-xs text-muted-foreground'>{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='ml-auto' variant='secondary' size='icon'>
                    <MoreVerticalIcon className='size-4 text-muted-foreground' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' align='end'>
                  <DropdownMenuItem
                    className='font-medium'
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={
                      isUpdatingMember || member.role === MemberRole.ADMIN
                    }
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='font-medium'
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.MEMBER)
                    }
                    disabled={
                      isUpdatingMember || member.role === MemberRole.MEMBER
                    }
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem
                    className='font-medium text-red-700'
                    onClick={() => handleDeleteMember(member.$id, member.userId)}
                    disabled={isDeletingMember}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className='my-2.5' />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
