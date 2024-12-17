'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useJoinWorkspace } from '../api/use-join-workspace';

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
  workspaceId: string;
  code: string;
}

export const JoinWorkspaceForm = ({
  initialValues,
  workspaceId,
  code: inviteCode,
}: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      { param: { workspaceId }, json: { code: inviteCode } },
      {
        onSuccess: ({ data }) => {
          toast.success('Successfully joined workspace');
          router.push(`/workspaces/${data.$id}`);
        },
        onError: () => {
          toast.error('Failed to join workspace');
        },
      },
    );
  };

  return (
    <Card className='w-full h-full border-none shadow-none'>
      <CardHeader className='p-7'>
        <CardTitle className='text-xl font-bold'>Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{initialValues.name}</strong>{' '}
          workspace
        </CardDescription>
      </CardHeader>
      <div className='px-7'>
        <DottedSeparator />
      </div>
      <CardContent className='p-7'>
        <div className='flex flex-col lg:flex-row items-center justify-between'>
          <Button
            variant='secondary'
            type='button'
            size='lg'
            className='w-full lg:w-fit'
            disabled={isPending}
            asChild
          >
            <Link href='/'>Cancel</Link>
          </Button>
          <Button
            size='lg'
            className='w-full lg:w-fit'
            type='button'
            onClick={onSubmit}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
