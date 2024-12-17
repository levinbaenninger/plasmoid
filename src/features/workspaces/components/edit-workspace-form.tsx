'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspaceEditForm } from '../hooks/use-workspace-edit-form';
import { Workspace } from '../types';
import { WorkspaceDangerZone } from './workspace-danger-zone';
import { WorkspaceImageUpload } from './workspace-image-upload';
import { WorkspaceInviteSection } from './workspace-invite-section';

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  workspace: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  workspace,
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const { form, isPending, onSubmit } = useWorkspaceEditForm(workspace);

  return (
    <div className='flex flex-col gap-y-4'>
      <Card className='w-full h-full border-none shadow-none'>
        <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
          <Button
            size='sm'
            variant='secondary'
            onClick={onCancel ? onCancel : () => router.back()}
          >
            <ArrowLeftIcon className='size-4 mr-1' />
            Back
          </Button>
          <CardTitle className='text-xl font-bold'>{workspace.name}</CardTitle>
        </CardHeader>
        <div className='px-7'>
          <DottedSeparator />
        </div>
        <CardContent className='p-7'>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className='flex flex-col gap-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='My Workspace' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='image'
                  render={({ field }) => (
                    <FormItem>
                      <WorkspaceImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DottedSeparator className='py-7' />
              <div className='flex items-center justify-between'>
                <Button
                  type='button'
                  size='lg'
                  variant='secondary'
                  onClick={onCancel}
                  disabled={isPending}
                  className={cn(!onCancel && 'invisible')}
                >
                  Cancel
                </Button>
                <Button size='lg' disabled={isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <WorkspaceInviteSection
        workspaceId={workspace.$id}
        inviteCode={workspace.inviteCode}
        disabled={isPending}
      />

      <WorkspaceDangerZone workspaceId={workspace.$id} disabled={isPending} />
    </div>
  );
};
